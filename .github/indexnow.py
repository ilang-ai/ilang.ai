#!/usr/bin/env python3
"""Tell IndexNow which ilang.ai pages changed, so Bing and the other IndexNow engines recrawl them.

.github/workflows/indexnow.yml runs this after every push to main:

    python3 .github/indexnow.py <before-sha> <after-sha>

It collects the pages whose files changed between the two commits and every sitemap entry whose
<lastmod> changed, keeps the URLs a sitemap lists, waits until Cloudflare Pages serves the pushed
files, and posts the list to api.indexnow.org, which shares it with every IndexNow engine (Bing,
Yandex, Naver, Seznam, Yep). Google is not one of them; it reads sitemap.xml.

    python3 .github/indexnow.py --all              every URL the sitemaps list
    python3 .github/indexnow.py --dry-run A B      print what would be sent, send nothing

Standard library only. The key is public by design: the engines fetch it from the site root.
"""
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

HOST = "ilang.ai"
KEY = "e801590c735a4ae633cb360a51cf39c1"
KEY_URL = "https://%s/%s.txt" % (HOST, KEY)
ENDPOINT = "https://api.indexnow.org/indexnow"
SITEMAPS = ("sitemap.xml", "blog/sitemap.xml")
UA = "ilang-indexnow/1.0 (+https://github.com/ilang-ai/ilang.ai)"  # Cloudflare turns away Python-urllib
EMPTY = "0" * 40


def git(*args):
    r = subprocess.run(["git", *args], capture_output=True)
    return r.stdout if r.returncode == 0 else None


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, b""
    except Exception:
        return 0, b""


def lastmods(xml):
    """loc -> lastmod for every <url> in a sitemap (empty for a sitemap that does not exist)."""
    out = {}
    for block in re.findall(rb"<url>(.*?)</url>", xml or b"", re.S):
        loc = re.search(rb"<loc>\s*(.*?)\s*</loc>", block)
        mod = re.search(rb"<lastmod>\s*(.*?)\s*</lastmod>", block)
        if loc:
            out[loc.group(1).decode()] = mod.group(1).decode() if mod else ""
    return out


def page_url(path):
    """The page a repo file is, or None for files that are not pages."""
    if path in ("index.html", "index.md"):
        return "https://%s/" % HOST
    if path == "privacy.html":
        return "https://%s/privacy" % HOST
    if path in ("llms.txt", "llms-full.txt"):
        return "https://%s/%s" % (HOST, path)
    m = re.fullmatch(r"(.+)/index\.(?:html|md)", path)
    return "https://%s/%s/" % (HOST, m.group(1)) if m else None


def file_url(path):
    """Where Cloudflare Pages serves a repo file (text files byte for byte; HTML see as_served)."""
    if path.endswith(".html"):
        return page_url(path)
    return "https://%s/%s" % (HOST, path)


def as_served(html):
    """What Cloudflare changes in HTML on the way out: email obfuscation drops the email_off
    comments and Web Analytics adds its beacon script. Both are removed, and so is all whitespace,
    before comparing."""
    html = html.replace(b"<!--email_off-->", b"").replace(b"<!--/email_off-->", b"")
    html = re.sub(rb"<script[^>]*cloudflareinsights[^>]*>\s*</script>", b"", html)
    return re.sub(rb"\s+", b"", html)


def served(path, rev):
    """True once the live copy of path matches the pushed one."""
    want = git("show", "%s:%s" % (rev, path))
    status, body = fetch(file_url(path))
    return status == 200 and want is not None and as_served(body) == as_served(want)


def sitemap_urls(rev):
    listed = {}
    for sm in SITEMAPS:
        listed.update(lastmods(git("show", "%s:%s" % (rev, sm))))
    return listed


def changed(before, after):
    """Pages changed between two commits, and the files to watch for the deploy."""
    names = (git("diff", "--name-only", before, after) or b"").decode().split()
    urls = {page_url(p) for p in names} - {None}
    for sm in SITEMAPS:
        old = lastmods(git("show", "%s:%s" % (before, sm)))
        new = lastmods(git("show", "%s:%s" % (after, sm)))
        urls |= {u for u, m in new.items() if old.get(u) != m}
    listed = sitemap_urls(after)
    live = [p for p in names if git("cat-file", "-e", "%s:%s" % (after, p)) is not None
            and (page_url(p) or p in SITEMAPS)]
    live.sort(key=lambda p: p.endswith(".html"))  # text files are served byte for byte; check those first
    return sorted(u for u in urls if u in listed), live[:3]


def wait_for(probes, rev, limit=600):
    """Wait until the key file and the probe files are live; give up after limit seconds."""
    start = time.time()
    while time.time() - start < limit:
        key_ok = fetch(KEY_URL) == (200, KEY.encode())
        pending = [p for p in probes if not served(p, rev)]
        if key_ok and not pending:
            print("live after %ds" % (time.time() - start))
            return True
        time.sleep(15)
    print("warning: after %ds the key file or %s still did not match the push" % (limit, pending or "-"))
    return False


def submit(urls):
    body = json.dumps({"host": HOST, "key": KEY, "keyLocation": KEY_URL, "urlList": urls}).encode()
    req = urllib.request.Request(ENDPOINT, data=body, method="POST",
                                 headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            status, text = r.status, r.read()[:300]
    except urllib.error.HTTPError as e:
        status, text = e.code, e.read()[:300]
    # 200 accepted; 202 accepted, key still being checked; 400 bad request; 403 key not found at
    # keyLocation; 422 URLs outside the host; 429 too many requests.
    print("IndexNow answered %d %s" % (status, text.decode("utf-8", "replace").strip()))
    return 0 if status in (200, 202) else 1


def main(argv):
    dry = "--dry-run" in argv
    args = [a for a in argv if a != "--dry-run"]
    if args == ["--all"]:
        rev = "HEAD"
        urls, probes = sorted(sitemap_urls(rev)), []
    elif len(args) == 2:
        before, rev = args
        if before == EMPTY or git("cat-file", "-e", before + "^{commit}") is None:
            before = rev + "~1"
        urls, probes = changed(before, rev)
    else:
        print(__doc__)
        return 2
    print("%d URL(s):" % len(urls))
    for u in urls:
        print("  " + u)
    if not urls or dry:
        return 0
    wait_for(probes, rev)
    return submit(urls)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
