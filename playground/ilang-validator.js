/*
 * ilang-validator.js: the I-Lang grammar and registry validator, in the browser.
 *
 * Port of ilang_grammar_validator.py of github.com/ilang-ai/ilang-spec at commit
 * 127ba56f4eb1f35c2951d4aec4b7bd22831119ff (file sha256 3c29df9089401fed742bb6448c6c7dc7
 * b72c811cdd90eca05696d7b6db62f4ad, the copy ilang-ai/iml-protocol pins in canon/): the class
 * Linter and everything it uses. ILV.lint(text) returns the findings Linter(path, text).run()
 * returns, in the same order, with the same level, line, code and message. The command line
 * (--canon, --selftest, --json, file walking) is not ported; like the Linter, lint() does
 * not remove a byte order mark (the command line reads files as utf-8-sig).
 *
 * Where JavaScript strings behave differently from Python's, the Python behaviour is
 * reproduced: str.splitlines() line boundaries, the whitespace of str.strip() and of the
 * regex classes \s and \S (CPython's str.isspace set), `.` (anything but \n), lengths and
 * slices in code points (a character outside the BMP is one character, a lone surrogate
 * too), and str.isdigit() and str.lower() through tables generated from CPython 3.13.
 * Method names follow the Python source, so each function can be read against it.
 *
 * Plain script, no dependencies: as a browser <script> it defines the global ILV; under
 * Node, require() returns the same object.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILV = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SOURCE = {
    repository: "https://github.com/ilang-ai/ilang-spec",
    commit: "127ba56f4eb1f35c2951d4aec4b7bd22831119ff",
    file: "ilang_grammar_validator.py",
    sha256: "3c29df9089401fed742bb6448c6c7dc7b72c811cdd90eca05696d7b6db62f4ad"
  };

  // ------------------------------------------------------ Python string semantics
  // CPython's str.isspace() set, which str.strip() removes and re's \s matches. JavaScript's
  // trim() and \s differ: they remove U+FEFF and keep U+001C..U+001F and U+0085.
  var WS = "\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029" +
           "\\u202f\\u205f\\u3000";

  function isSpace(c) {                      // c: a UTF-16 code unit; every space is in the BMP
    if (c <= 0x20) return c === 0x20 || (c >= 0x09 && c <= 0x0d) || (c >= 0x1c && c <= 0x1f);
    if (c < 0x85) return false;
    return c === 0x85 || c === 0xa0 || c === 0x1680 || (c >= 0x2000 && c <= 0x200a) ||
           c === 0x2028 || c === 0x2029 || c === 0x202f || c === 0x205f || c === 0x3000;
  }

  function strip(s) {                        // str.strip()
    var a = 0, b = s.length;
    while (a < b && isSpace(s.charCodeAt(a))) a++;
    while (b > a && isSpace(s.charCodeAt(b - 1))) b--;
    return a === 0 && b === s.length ? s : s.slice(a, b);
  }

  function rstrip(s) {                       // str.rstrip()
    var b = s.length;
    while (b > 0 && isSpace(s.charCodeAt(b - 1))) b--;
    return b === s.length ? s : s.slice(0, b);
  }

  function indentOf(s) {                     // len(s) - len(s.lstrip())
    var a = 0;
    while (a < s.length && isSpace(s.charCodeAt(a))) a++;
    return a;
  }

  function stripChars(s, chars) {            // str.strip(chars), chars all in the BMP
    var a = 0, b = s.length;
    while (a < b && chars.indexOf(s.charAt(a)) >= 0) a++;
    while (b > a && chars.indexOf(s.charAt(b - 1)) >= 0) b--;
    return s.slice(a, b);
  }

  // str.splitlines(): \n, \r, \r\n, \v, \f, \x1c, \x1d, \x1e, \x85, U+2028, U+2029; a final
  // line break opens no empty line, and "" has no line at all.
  var RE_LINE_BREAK = /\r\n|[\n\x0b\x0c\r\x1c\x1d\x1e\x85\u2028\u2029]/;

  function splitlines(text) {
    var lines = text.split(RE_LINE_BREAK);
    if (lines[lines.length - 1] === "") lines.pop();
    return lines;
  }

  // Code points. Python indexes a str by code point; a JavaScript string by UTF-16 unit.
  // A valid surrogate pair is one code point, a lone surrogate is one code point in both.
  var RE_SURROGATE = /[\ud800-\udfff]/;

  function cpWidth(s, i) {                   // code units of the code point at unit i
    var c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      var d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) return 2;
    }
    return 1;
  }

  function cpLen(s) {                        // len(s)
    if (!RE_SURROGATE.test(s)) return s.length;
    var n = 0;
    for (var i = 0; i < s.length; i += cpWidth(s, i)) n++;
    return n;
  }

  function cpAdvance(s, i, n) {              // the unit index n code points after unit i
    while (n > 0 && i < s.length) {
      i += cpWidth(s, i);
      n--;
    }
    return i;
  }

  function cpPrefix(s, n) {                  // s[:n]
    if (s.length <= n) return s;
    return s.slice(0, RE_SURROGATE.test(s) ? cpAdvance(s, 0, n) : n);
  }

  function codePoints(s) {
    var out = [], c;
    for (var i = 0; i < s.length; i += c > 0xffff ? 2 : 1) out.push(c = s.codePointAt(i));
    return out;
  }

  function fromCodePoints(cps) {
    var out = "";
    for (var i = 0; i < cps.length; i++) out += String.fromCodePoint(cps[i]);
    return out;
  }

  // BEGIN GENERATED TABLES
  // Generated by playground-tests/validator/gen_tables.py from CPython 3.13.15
  // (Unicode 15.1.0); do not edit by hand.
  // str.isdigit(): code point ranges, hex `a-b` or `a`
  var T_DIGIT =
    "30-39,b2-b3,b9,660-669,6f0-6f9,7c0-7c9,966-96f,9e6-9ef,a66-a6f,ae6-aef,b66-b6f,be6-bef,c66-c6f," +
    "ce6-cef,d66-d6f,de6-def,e50-e59,ed0-ed9,f20-f29,1040-1049,1090-1099,1369-1371,17e0-17e9," +
    "1810-1819,1946-194f,19d0-19da,1a80-1a89,1a90-1a99,1b50-1b59,1bb0-1bb9,1c40-1c49,1c50-1c59,2070," +
    "2074-2079,2080-2089,2460-2468,2474-247c,2488-2490,24ea,24f5-24fd,24ff,2776-277e,2780-2788," +
    "278a-2792,a620-a629,a8d0-a8d9,a900-a909,a9d0-a9d9,a9f0-a9f9,aa50-aa59,abf0-abf9,ff10-ff19," +
    "104a0-104a9,10a40-10a43,10d30-10d39,10e60-10e68,11052-1105a,11066-1106f,110f0-110f9,11136-1113f," +
    "111d0-111d9,112f0-112f9,11450-11459,114d0-114d9,11650-11659,116c0-116c9,11730-11739,118e0-118e9," +
    "11950-11959,11c50-11c59,11d50-11d59,11da0-11da9,11f50-11f59,16a60-16a69,16ac0-16ac9,16b50-16b59," +
    "1d7ce-1d7ff,1e140-1e149,1e2f0-1e2f9,1e4f0-1e4f9,1e950-1e959,1f100-1f10a,1fbf0-1fbf9";
  // str.lower(): runs `start:count:delta:step` in hex (U+0130, U+03A3 in code)
  var T_LOWER =
    "41:1a:20:1,c0:17:20:1,d8:7:20:1,100:18:1:2,132:3:1:2,139:8:1:2,14a:17:1:2,178:1:-79:1,179:3:1:2," +
    "181:1:d2:1,182:2:1:2,186:1:ce:1,187:1:1:1,189:2:cd:1,18b:1:1:1,18e:1:4f:1,18f:1:ca:1,190:1:cb:1," +
    "191:1:1:1,193:1:cd:1,194:1:cf:1,196:1:d3:1,197:1:d1:1,198:1:1:1,19c:1:d3:1,19d:1:d5:1," +
    "19f:1:d6:1,1a0:3:1:2,1a6:1:da:1,1a7:1:1:1,1a9:1:da:1,1ac:1:1:1,1ae:1:da:1,1af:1:1:1,1b1:2:d9:1," +
    "1b3:2:1:2,1b7:1:db:1,1b8:1:1:1,1bc:1:1:1,1c4:1:2:1,1c5:1:1:1,1c7:1:2:1,1c8:1:1:1,1ca:1:2:1," +
    "1cb:9:1:2,1de:9:1:2,1f1:1:2:1,1f2:2:1:2,1f6:1:-61:1,1f7:1:-38:1,1f8:14:1:2,220:1:-82:1," +
    "222:9:1:2,23a:1:2a2b:1,23b:1:1:1,23d:1:-a3:1,23e:1:2a28:1,241:1:1:1,243:1:-c3:1,244:1:45:1," +
    "245:1:47:1,246:5:1:2,370:2:1:2,376:1:1:1,37f:1:74:1,386:1:26:1,388:3:25:1,38c:1:40:1,38e:2:3f:1," +
    "391:11:20:1,3a4:8:20:1,3cf:1:8:1,3d8:c:1:2,3f4:1:-3c:1,3f7:1:1:1,3f9:1:-7:1,3fa:1:1:1," +
    "3fd:3:-82:1,400:10:50:1,410:20:20:1,460:11:1:2,48a:1b:1:2,4c0:1:f:1,4c1:7:1:2,4d0:30:1:2," +
    "531:26:30:1,10a0:26:1c60:1,10c7:1:1c60:1,10cd:1:1c60:1,13a0:50:97d0:1,13f0:6:8:1,1c90:2b:-bc0:1," +
    "1cbd:3:-bc0:1,1e00:4b:1:2,1e9e:1:-1dbf:1,1ea0:30:1:2,1f08:8:-8:1,1f18:6:-8:1,1f28:8:-8:1," +
    "1f38:8:-8:1,1f48:6:-8:1,1f59:4:-8:2,1f68:8:-8:1,1f88:8:-8:1,1f98:8:-8:1,1fa8:8:-8:1,1fb8:2:-8:1," +
    "1fba:2:-4a:1,1fbc:1:-9:1,1fc8:4:-56:1,1fcc:1:-9:1,1fd8:2:-8:1,1fda:2:-64:1,1fe8:2:-8:1," +
    "1fea:2:-70:1,1fec:1:-7:1,1ff8:2:-80:1,1ffa:2:-7e:1,1ffc:1:-9:1,2126:1:-1d5d:1,212a:1:-20bf:1," +
    "212b:1:-2046:1,2132:1:1c:1,2160:10:10:1,2183:1:1:1,24b6:1a:1a:1,2c00:30:30:1,2c60:1:1:1," +
    "2c62:1:-29f7:1,2c63:1:-ee6:1,2c64:1:-29e7:1,2c67:3:1:2,2c6d:1:-2a1c:1,2c6e:1:-29fd:1," +
    "2c6f:1:-2a1f:1,2c70:1:-2a1e:1,2c72:1:1:1,2c75:1:1:1,2c7e:2:-2a3f:1,2c80:32:1:2,2ceb:2:1:2," +
    "2cf2:1:1:1,a640:17:1:2,a680:e:1:2,a722:7:1:2,a732:1f:1:2,a779:2:1:2,a77d:1:-8a04:1,a77e:5:1:2," +
    "a78b:1:1:1,a78d:1:-a528:1,a790:2:1:2,a796:a:1:2,a7aa:1:-a544:1,a7ab:1:-a54f:1,a7ac:1:-a54b:1," +
    "a7ad:1:-a541:1,a7ae:1:-a544:1,a7b0:1:-a512:1,a7b1:1:-a52a:1,a7b2:1:-a515:1,a7b3:1:3a0:1," +
    "a7b4:8:1:2,a7c4:1:-30:1,a7c5:1:-a543:1,a7c6:1:-8a38:1,a7c7:2:1:2,a7d0:1:1:1,a7d6:2:1:2," +
    "a7f5:1:1:1,ff21:1a:20:1,10400:28:28:1,104b0:24:28:1,10570:b:27:1,1057c:f:27:1,1058c:7:27:1," +
    "10594:2:27:1,10c80:33:40:1,118a0:20:20:1,16e40:20:20:1,1e900:22:22:1";
  // Case_Ignorable, as handle_capital_sigma() reads it
  var T_CASE_IGNORABLE =
    "27,2e,3a,5e,60,a8,ad,af,b4,b7-b8,2b0-36f,374-375,37a,384-385,387,483-489,559,55f,591-5bd,5bf," +
    "5c1-5c2,5c4-5c5,5c7,5f4,600-605,610-61a,61c,640,64b-65f,670,6d6-6dd,6df-6e8,6ea-6ed,70f,711," +
    "730-74a,7a6-7b0,7eb-7f5,7fa,7fd,816-82d,859-85b,888,890-891,898-89f,8c9-902,93a,93c,941-948,94d," +
    "951-957,962-963,971,981,9bc,9c1-9c4,9cd,9e2-9e3,9fe,a01-a02,a3c,a41-a42,a47-a48,a4b-a4d,a51," +
    "a70-a71,a75,a81-a82,abc,ac1-ac5,ac7-ac8,acd,ae2-ae3,afa-aff,b01,b3c,b3f,b41-b44,b4d,b55-b56," +
    "b62-b63,b82,bc0,bcd,c00,c04,c3c,c3e-c40,c46-c48,c4a-c4d,c55-c56,c62-c63,c81,cbc,cbf,cc6,ccc-ccd," +
    "ce2-ce3,d00-d01,d3b-d3c,d41-d44,d4d,d62-d63,d81,dca,dd2-dd4,dd6,e31,e34-e3a,e46-e4e,eb1,eb4-ebc," +
    "ec6,ec8-ece,f18-f19,f35,f37,f39,f71-f7e,f80-f84,f86-f87,f8d-f97,f99-fbc,fc6,102d-1030,1032-1037," +
    "1039-103a,103d-103e,1058-1059,105e-1060,1071-1074,1082,1085-1086,108d,109d,10fc,135d-135f," +
    "1712-1714,1732-1733,1752-1753,1772-1773,17b4-17b5,17b7-17bd,17c6,17c9-17d3,17d7,17dd,180b-180f," +
    "1843,1885-1886,18a9,1920-1922,1927-1928,1932,1939-193b,1a17-1a18,1a1b,1a56,1a58-1a5e,1a60,1a62," +
    "1a65-1a6c,1a73-1a7c,1a7f,1aa7,1ab0-1ace,1b00-1b03,1b34,1b36-1b3a,1b3c,1b42,1b6b-1b73,1b80-1b81," +
    "1ba2-1ba5,1ba8-1ba9,1bab-1bad,1be6,1be8-1be9,1bed,1bef-1bf1,1c2c-1c33,1c36-1c37,1c78-1c7d," +
    "1cd0-1cd2,1cd4-1ce0,1ce2-1ce8,1ced,1cf4,1cf8-1cf9,1d2c-1d6a,1d78,1d9b-1dff,1fbd,1fbf-1fc1," +
    "1fcd-1fcf,1fdd-1fdf,1fed-1fef,1ffd-1ffe,200b-200f,2018-2019,2024,2027,202a-202e,2060-2064," +
    "2066-206f,2071,207f,2090-209c,20d0-20f0,2c7c-2c7d,2cef-2cf1,2d6f,2d7f,2de0-2dff,2e2f,3005," +
    "302a-302d,3031-3035,303b,3099-309e,30fc-30fe,a015,a4f8-a4fd,a60c,a66f-a672,a674-a67d,a67f," +
    "a69c-a69f,a6f0-a6f1,a700-a721,a770,a788-a78a,a7f2-a7f4,a7f8-a7f9,a802,a806,a80b,a825-a826,a82c," +
    "a8c4-a8c5,a8e0-a8f1,a8ff,a926-a92d,a947-a951,a980-a982,a9b3,a9b6-a9b9,a9bc-a9bd,a9cf,a9e5-a9e6," +
    "aa29-aa2e,aa31-aa32,aa35-aa36,aa43,aa4c,aa70,aa7c,aab0,aab2-aab4,aab7-aab8,aabe-aabf,aac1,aadd," +
    "aaec-aaed,aaf3-aaf4,aaf6,ab5b-ab5f,ab69-ab6b,abe5,abe8,abed,fb1e,fbb2-fbc2,fe00-fe0f,fe13," +
    "fe20-fe2f,fe52,fe55,feff,ff07,ff0e,ff1a,ff3e,ff40,ff70,ff9e-ff9f,ffe3,fff9-fffb,101fd,102e0," +
    "10376-1037a,10780-10785,10787-107b0,107b2-107ba,10a01-10a03,10a05-10a06,10a0c-10a0f,10a38-10a3a," +
    "10a3f,10ae5-10ae6,10d24-10d27,10eab-10eac,10efd-10eff,10f46-10f50,10f82-10f85,11001,11038-11046," +
    "11070,11073-11074,1107f-11081,110b3-110b6,110b9-110ba,110bd,110c2,110cd,11100-11102,11127-1112b," +
    "1112d-11134,11173,11180-11181,111b6-111be,111c9-111cc,111cf,1122f-11231,11234,11236-11237,1123e," +
    "11241,112df,112e3-112ea,11300-11301,1133b-1133c,11340,11366-1136c,11370-11374,11438-1143f," +
    "11442-11444,11446,1145e,114b3-114b8,114ba,114bf-114c0,114c2-114c3,115b2-115b5,115bc-115bd," +
    "115bf-115c0,115dc-115dd,11633-1163a,1163d,1163f-11640,116ab,116ad,116b0-116b5,116b7,1171d-1171f," +
    "11722-11725,11727-1172b,1182f-11837,11839-1183a,1193b-1193c,1193e,11943,119d4-119d7,119da-119db," +
    "119e0,11a01-11a0a,11a33-11a38,11a3b-11a3e,11a47,11a51-11a56,11a59-11a5b,11a8a-11a96,11a98-11a99," +
    "11c30-11c36,11c38-11c3d,11c3f,11c92-11ca7,11caa-11cb0,11cb2-11cb3,11cb5-11cb6,11d31-11d36,11d3a," +
    "11d3c-11d3d,11d3f-11d45,11d47,11d90-11d91,11d95,11d97,11ef3-11ef4,11f00-11f01,11f36-11f3a,11f40," +
    "11f42,13430-13440,13447-13455,16af0-16af4,16b30-16b36,16b40-16b43,16f4f,16f8f-16f9f,16fe0-16fe1," +
    "16fe3-16fe4,1aff0-1aff3,1aff5-1affb,1affd-1affe,1bc9d-1bc9e,1bca0-1bca3,1cf00-1cf2d,1cf30-1cf46," +
    "1d167-1d169,1d173-1d182,1d185-1d18b,1d1aa-1d1ad,1d242-1d244,1da00-1da36,1da3b-1da6c,1da75,1da84," +
    "1da9b-1da9f,1daa1-1daaf,1e000-1e006,1e008-1e018,1e01b-1e021,1e023-1e024,1e026-1e02a,1e030-1e06d," +
    "1e08f,1e130-1e13d,1e2ae,1e2ec-1e2ef,1e4eb-1e4ef,1e8d0-1e8d6,1e944-1e94b,1f3fb-1f3ff,e0001," +
    "e0020-e007f,e0100-e01ef";
  // Cased and not Case_Ignorable, as handle_capital_sigma() reads it
  var T_CASED =
    "41-5a,61-7a,aa,b5,ba,c0-d6,d8-f6,f8-1ba,1bc-1bf,1c4-293,295-2af,370-373,376-377,37b-37d,37f,386," +
    "388-38a,38c,38e-3a1,3a3-3f5,3f7-481,48a-52f,531-556,560-588,10a0-10c5,10c7,10cd,10d0-10fa," +
    "10fd-10ff,13a0-13f5,13f8-13fd,1c80-1c88,1c90-1cba,1cbd-1cbf,1d00-1d2b,1d6b-1d77,1d79-1d9a," +
    "1e00-1f15,1f18-1f1d,1f20-1f45,1f48-1f4d,1f50-1f57,1f59,1f5b,1f5d,1f5f-1f7d,1f80-1fb4,1fb6-1fbc," +
    "1fbe,1fc2-1fc4,1fc6-1fcc,1fd0-1fd3,1fd6-1fdb,1fe0-1fec,1ff2-1ff4,1ff6-1ffc,2102,2107,210a-2113," +
    "2115,2119-211d,2124,2126,2128,212a-212d,212f-2134,2139,213c-213f,2145-2149,214e,2160-217f," +
    "2183-2184,24b6-24e9,2c00-2c7b,2c7e-2ce4,2ceb-2cee,2cf2-2cf3,2d00-2d25,2d27,2d2d,a640-a66d," +
    "a680-a69b,a722-a76f,a771-a787,a78b-a78e,a790-a7ca,a7d0-a7d1,a7d3,a7d5-a7d9,a7f5-a7f6,a7fa," +
    "ab30-ab5a,ab60-ab68,ab70-abbf,fb00-fb06,fb13-fb17,ff21-ff3a,ff41-ff5a,10400-1044f,104b0-104d3," +
    "104d8-104fb,10570-1057a,1057c-1058a,1058c-10592,10594-10595,10597-105a1,105a3-105b1,105b3-105b9," +
    "105bb-105bc,10c80-10cb2,10cc0-10cf2,118a0-118df,16e40-16e7f,1d400-1d454,1d456-1d49c,1d49e-1d49f," +
    "1d4a2,1d4a5-1d4a6,1d4a9-1d4ac,1d4ae-1d4b9,1d4bb,1d4bd-1d4c3,1d4c5-1d505,1d507-1d50a,1d50d-1d514," +
    "1d516-1d51c,1d51e-1d539,1d53b-1d53e,1d540-1d544,1d546,1d54a-1d550,1d552-1d6a5,1d6a8-1d6c0," +
    "1d6c2-1d6da,1d6dc-1d6fa,1d6fc-1d714,1d716-1d734,1d736-1d74e,1d750-1d76e,1d770-1d788,1d78a-1d7a8," +
    "1d7aa-1d7c2,1d7c4-1d7cb,1df00-1df09,1df0b-1df1e,1df25-1df2a,1e900-1e943,1f130-1f149,1f150-1f169," +
    "1f170-1f189";
  // END GENERATED TABLES

  function decodeRanges(spec) {              // "a-b,c,..." (hex) -> [a, b, c, c, ...]
    var out = [];
    spec.split(",").forEach(function (r) {
      var p = r.split("-"), a = parseInt(p[0], 16);
      out.push(a, p.length > 1 ? parseInt(p[1], 16) : a);
    });
    return out;
  }

  function inRanges(t, c) {
    var lo = 0, hi = t.length / 2 - 1;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (c < t[2 * mid]) hi = mid - 1;
      else if (c > t[2 * mid + 1]) lo = mid + 1;
      else return true;
    }
    return false;
  }

  var DIGIT = decodeRanges(T_DIGIT);
  var CASE_IGNORABLE = decodeRanges(T_CASE_IGNORABLE);
  var CASED = decodeRanges(T_CASED);
  var LOWER = T_LOWER.split(",").map(function (r) {   // [start, count, delta, step]
    var p = r.split(":");
    return [parseInt(p[0], 16), parseInt(p[1], 16), parseInt(p[2], 16), parseInt(p[3], 16)];
  });

  function isdigit(s) {                      // str.isdigit()
    if (!s) return false;
    var cps = codePoints(s);
    for (var i = 0; i < cps.length; i++) if (!inRanges(DIGIT, cps[i])) return false;
    return true;
  }

  function lowerCodePoint(c) {               // the one-character mappings of str.lower()
    var lo = 0, hi = LOWER.length - 1, at = -1;
    while (lo <= hi) {                       // the last run starting at or before c
      var mid = (lo + hi) >> 1;
      if (LOWER[mid][0] <= c) {
        at = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    if (at < 0) return c;
    var r = LOWER[at], k = c - r[0];
    return k % r[3] === 0 && k / r[3] < r[1] ? c + r[2] : c;
  }

  function finalSigma(cps, i) {              // CPython's handle_capital_sigma()
    var j, c = 0;
    for (j = i - 1; j >= 0; j--) {
      c = cps[j];
      if (!inRanges(CASE_IGNORABLE, c)) break;
    }
    var fin = j >= 0 && inRanges(CASED, c);
    if (fin && i + 1 < cps.length) {
      for (j = i + 1; j < cps.length; j++) {
        c = cps[j];
        if (!inRanges(CASE_IGNORABLE, c)) break;
      }
      fin = j === cps.length || !inRanges(CASED, c);
    }
    return fin;
  }

  function lower(s) {                        // str.lower()
    if (!/[^\x00-\x7f]/.test(s)) return s.toLowerCase();   // ASCII: the same in both
    var cps = codePoints(s), out = [];
    for (var i = 0; i < cps.length; i++) {
      var c = cps[i];
      if (c === 0x3a3) out.push(finalSigma(cps, i) ? 0x3c2 : 0x3c3);
      else if (c === 0x130) out.push(0x69, 0x307);
      else out.push(lowerCodePoint(c));
    }
    return fromCodePoints(out);
  }

  function isascii(s) {                      // str.isascii()
    return !/[^\x00-\x7f]/.test(s);
  }

  // --------------------------------------------------------------- registries
  function words(s) {
    return s.split(" ").filter(Boolean);
  }

  function union() {
    var out = new Set();
    for (var i = 0; i < arguments.length; i++) arguments[i].forEach(function (x) { out.add(x); });
    return out;
  }

  var REGISTRY_V3 = words("STATE TRUST ALIVE MEMORY GENE GENE_MUTABLE RULE ACTIVATE " +
                          "FACT LESSON PROGRESS PRIORITY DECAY IMMUNE");
  var REGISTRY_V4 = words("UNTRUSTED BUDGET STATUS OBJECTIVE RUBRIC EVIDENCE PRIOR FALLBACK");
  var REGISTRY_V5 = words("JUDGE BOUNDARY DIM MODE FUNC SCHEMA CASE CLAUSE MODULE");
  var REGISTRY_AMEND = ["LIST"];
  var DECL_STRUCTURAL = new Set(REGISTRY_V3.concat(REGISTRY_V4, REGISTRY_V5, REGISTRY_AMEND));

  var DECL_NARRATIVE = new Set(words("SAY THINK ACT DECIDE DISCOVER CREATE EVENT SILENCE " +
                                     "META IRONY FORESHADOW CALLBACK EMOTION_FIELD"));
  var NARR_DOUBLE = new Set(words("SAY THINK ACT DECIDE DISCOVER CREATE"));
  var TERMINATORS = new Set(["END_UNTRUSTED"]);
  var META_DECLS = new Set(["GRAMMAR", "BODY", "REGISTRY"]);
  var TOLERATED_ANNOT = new Set(["LATENCY", "CONFIDENCE"]);
  var PROSE_BODY = new Set(["LESSON", "MODULE", "LIST", "RULE", "OBJECTIVE"]);

  var VERBS = new Set(words("READ WRIT GET DEL LIST COPY MOVE STRM CACH SYNC SEND RUN " +
                            "FMT CONV SPLIT MERGE MAP FILT SORT DEDU FLAT NEST CHNK REDU " +
                            "PIVT TRNS ENCD DECD HASH CMPR EXPN XLAT REWR DIFF " +
                            "SCAN MTCH CNT STAT EVAL SCOR RANK TRND CORR FRCS ANOM SENT " +
                            "CLST BNCH AUDT VALD CLSF " +
                            "CREA DRFT EXPD SHRT PARA STYL TMPL FILL EXTC GEN " +
                            "PLAN DECI CHEK FIX DPLO SAVE REVW LERN TEST PARS LOOP WAIT " +
                            "OUT DISP EXPT PRNT LOG LINK SET TAG GRP EMBD " +
                            "HELP DESC INTR NOOP BATC"));
  // the 13 Greek aliases, in the order of the source: Sigma Delta phi nabla lambda partial mu psi xi zeta theta Omega Pi
  var GREEKISH = "\u03a3\u0394\u03c6\u2207\u03bb\u2202\u03bc\u03c8\u03be\u03b6\u03b8\u03a9\u03a0";
  var ALIASES = new Set(GREEKISH.split(""));
  var SIGMA = "\u03a3", PI = "\u03a0";
  var MODIFIERS = new Set(words("src dst path fmt lng sty ton len lim off top bot srt grp " +
                                "whr mch exc dep rng typ enc cap pri col row frm to scp op"));
  // v4.1 4.4 media profile: in force only where the operation target is a media entity
  var MEDIA_PROFILE = new Set(words("sbj act plc txt pov fcl mvt lgt pal mdm " +
                                    "asp rsl qly dur fps sed adh ref dlg sfx"));
  // v4.2 4.5.3 region body keys: ::STATE body lines, never operation modifiers
  var REGION_KEYS = new Set(words("pts bnd vtx msk"));
  // v4.2 4.6.3: verbs that fix a frame of their own through asp / rsl
  var FRAME_SETTING_VERBS = new Set(["CREA", "GEN", "EXPD"]);
  var PLACEHOLDER_HEADS = new Set(["VERB", "VERB1", "VERB2", "VERB3", "DECL"]);

  var TIER1 = new Set(words("@SRC @DST @PREV @LOCAL @SCREEN @LOG @NULL @STDIN"));
  var TIER2 = new Set(words("@GH @R2 @COS @DRIVE @WORKER @CF"));
  var TIER3 = new Set(words("@SYSTEM @RUNTIME @GRADER @USER @SELF @AGENT @TASK @TOOL"));
  var TIER4 = new Set(words("@IMG @VID @AUD"));
  var REGISTERED_ENTITIES = union(TIER1, TIER2, TIER3, TIER4);
  var PLACEHOLDER_ENTITIES = new Set(words("A B ENTITY FROM TO TARGET NAME SOURCE"));

  var OPS = union(VERBS, ALIASES);                    // VERBS | ALIASES
  var MEDIA_MODIFIERS = union(MODIFIERS, MEDIA_PROFILE);
  var TIER12 = union(TIER1, TIER2);

  // ------------------------------------------------------------------ regexes
  // \s, \S and . as Python's re reads them on a str. No line holds a \n (splitlines() cut
  // there), so Python's $ (end, or before a final \n) is JavaScript's $.
  var S = "[" + WS + "]", NS = "[^" + WS + "]", DOT = "[^\\n]";
  var RE_DOC_MARKER = new RegExp("^::ILANG::" + NS + "+$");
  var RE_DECL_HEAD = new RegExp("^::([A-Z][A-Z0-9_]*)(?:::([A-Z][A-Z0-9_]*))?(" + DOT + "*)$");
  var RE_BAD_DECL_HEAD = new RegExp("^::(" + NS + "*)");
  var RE_TEMPORAL_PREFIX = new RegExp("^(T\\[[^\\]]+\\])" + S + "+(::" + DOT + "*)$");
  var RE_TEMPORAL_BIND = new RegExp("^T\\[[^\\]]+\\]=" + NS + "+");
  var RE_TEMPORAL_NOTE = new RegExp("^(T\\[[^\\]]+\\](\u2192T\\[[^\\]]+\\])?|PARALLEL\\{[^}]*\\})" +
                                    "(" + S + DOT + "*)?$");
  var RE_TAG_LINE = /^(\[[A-Z][A-Z0-9_\-]*(?::[^\[\]]*)?\])+$/;
  var RE_TAG_TEXT = new RegExp("^\\[[A-Z][A-Z0-9_\\-]*(?::[^\\[\\]]*)?\\](" + S + "+" + NS + DOT +
                               "*)?$");
  var RE_KEY = new RegExp("^([A-Za-z_][A-Za-z0-9_]*):(" + DOT + "*)$");
  var RE_ENTITY_TOKEN = /(?<=[{:|,\u2192=])@([A-Za-z][A-Za-z0-9_\-]*)/g;
  var RE_ENTITY_OK = /^@[A-Z][A-Z0-9_]*$/;
  var RE_BRACKET_GROUPS = /\[([^\[\]]*)\]/g;
  var RE_FENCE = new RegExp("^" + S + "*```");
  var RE_STATE_INTRO = new RegExp("^::STATE\\{(@[A-Z][A-Z0-9_]*)[,|}" + WS + "]");
  var RE_LIST_INTRO = new RegExp("^::LIST\\{(@[A-Z][A-Z0-9_]*)[,|}" + WS + "]");
  var RE_LIST_ITEM = /^(@[A-Z][A-Z0-9_]*)(?![A-Za-z0-9_])/;
  var RE_HEADER_KEY = new RegExp("(?:^|[,|])" + S + "*([A-Za-z_][A-Za-z0-9_]*):", "g");
  var RE_NORM_ITEM = /^(?:0\.[0-9]{2,4}|1\.0{2,4})$/;
  var RE_PX_ITEM = /^[0-9]+px$/;
  // patterns written inline in the Python methods
  var RE_DELIMITER = new RegExp("delimiter:([^|}" + WS + "]+)");        // re.search
  var RE_NARR_FULL = new RegExp("^\\{[^{}]*\\}\\{" + DOT + "*\\}" + S + "*$");
  var RE_NARR_OPEN = /^\{[^{}]*\}\{[^}]*$/;
  var RE_ILANG_BRACKET = new RegExp("^\\[[A-Z" + GREEKISH + "]");     // re.match anchors

  // ------------------------------------------------------------ quoted values
  // mask_quoted(s), v3.0 2.4: the inside of a quoted value is blanked to `_`, so that its
  // commas, pipes, equals signs and brackets are not structure. One difference stays inside
  // this file: a character outside the BMP becomes one `_` per UTF-16 unit, so that every
  // index of the mask is an index of s; maskedText() returns a slice as Python's mask has it.
  function mask_quoted(s) {
    if (s.indexOf('"') < 0) return s;
    var out = [], quoted = false, escaped = false;
    for (var k = 0; k < s.length; k++) {
      var ch = s.charAt(k);
      if (quoted) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === '"') {
          quoted = false;
          out.push(ch);
          continue;
        }
        out.push("_");
        continue;
      }
      if (ch === '"' && k > 0 && "=:,".indexOf(s.charAt(k - 1)) >= 0) quoted = true;
      out.push(ch);
    }
    return quoted ? s : out.join("");
  }

  function maskedText(s, ms, a, b) {         // mask_quoted(s)[a:b], one `_` per character
    if (ms === s || !RE_SURROGATE.test(s.slice(a, b))) return ms.slice(a, b);
    var out = "";
    for (var k = a; k < b;) {
      var w = cpWidth(s, k);
      out += w === 2 && ms.charCodeAt(k) === 95 ? "_" : ms.slice(k, k + w);
      k += w;
    }
    return out;
  }

  function bracketGroups(ms) {               // RE_BRACKET_GROUPS.finditer(ms) as [start, end]
    var out = [], m;
    RE_BRACKET_GROUPS.lastIndex = 0;
    while ((m = RE_BRACKET_GROUPS.exec(ms)) !== null) {
      out.push([m.index + 1, m.index + m[0].length - 1]);
    }
    return out;
  }

  // One bracket group of s at units [gs, ge) of its mask ms, read as the Python reads it:
  // head = re.split(r"[:|]", grp, maxsplit=1)[0].strip() and rest = grp[len(head):], where
  // len() counts code points from the start of the group. Returns head and rest's unit index.
  function readGroup(s, ms, gs, ge) {
    var p = gs;
    while (p < ge && ms.charCodeAt(p) !== 58 && ms.charCodeAt(p) !== 124) p++;   // : |
    var hs = gs, he = p;
    while (hs < he && isSpace(ms.charCodeAt(hs))) hs++;
    while (he > hs && isSpace(ms.charCodeAt(he - 1))) he--;
    var head = maskedText(s, ms, hs, he);
    return { head: head, rest: cpAdvance(s, gs, cpLen(head)) };
  }

  // ogrp[len(head) + 1:cut].strip() when rest.startswith(":"), else null
  function groupTarget(s, ms, rest, ge) {
    if (rest >= ge || ms.charCodeAt(rest) !== 58) return null;
    var q = rest + 1;
    while (q < ge && ms.charCodeAt(q) !== 124) q++;
    return strip(s.slice(rest + 1, q));
  }

  // Linter.mod_pairs(grp, ogrp) for the group at units [gs, ge): (key, value) pairs after its
  // first `|`, cut on the mask; keys from the mask, values from s without enclosing quotes.
  function mod_pairs(s, ms, gs, ge) {
    var bar = gs;
    while (bar < ge && ms.charCodeAt(bar) !== 124) bar++;
    if (bar >= ge) return [];
    var out = [], start = bar + 1;
    for (var k = bar + 1; k <= ge; k++) {
      if (k < ge && ms.charCodeAt(k) !== 124 && ms.charCodeAt(k) !== 44) continue;   // | ,
      var eq = start;
      while (eq < k && ms.charCodeAt(eq) !== 61) eq++;                            // =
      if (eq < k) {                          // a piece without `=` continues the last value
        out.push([strip(maskedText(s, ms, start, eq)),
                  stripChars(strip(s.slice(eq + 1, k)), '"')]);
      }
      start = k + 1;
    }
    return out;
  }

  function head_of(s) {                      // Linter.head_of
    var ms = mask_quoted(s);
    RE_BRACKET_GROUPS.lastIndex = 0;
    var m = RE_BRACKET_GROUPS.exec(ms);
    if (!m) return "";
    return readGroup(s, ms, m.index + 1, m.index + m[0].length - 1).head;
  }

  function is_ilang_start(s) {               // Linter.is_ilang_start
    if (s.startsWith("::") || s.startsWith("T[")) return true;
    if (s.startsWith("[") && s.indexOf("](") < 0 && !s.startsWith("[!")) {
      return RE_ILANG_BRACKET.test(s);
    }
    return false;
  }

  // ------------------------------------------------------------ small helpers
  function isBlank(line) {                   // not line.strip()
    return indentOf(line) === line.length;
  }

  function count(s, ch) {                    // s.count(ch), ch one character
    var n = 0;
    for (var k = s.indexOf(ch); k >= 0; k = s.indexOf(ch, k + 1)) n++;
    return n;
  }

  function setdefault(map, key, value) {     // dict.setdefault
    if (!map.has(key)) map.set(key, value);
    return map.get(key);
  }

  function find_close(rest) {                // Linter.find_close
    var depth = 0;
    for (var k = 0; k < rest.length; k++) {
      var ch = rest.charCodeAt(k);
      if (ch === 123) depth++;
      else if (ch === 125) {
        depth--;
        if (depth === 0) return k;
      }
    }
    return -1;
  }

  function frame_value(v) {                  // Linter.frame_value: without spaces and case
    return lower(v.split(" ").join(""));
  }

  var STRUCTURAL_CHARS = ["::", "[", "{", "}", "|", "\u21d2", "=>"];

  // -------------------------------------------------------------------- Linter
  var ERROR = "ERROR", WARN = "WARN", INFO = "INFO";

  function Linter(path, text) {
    this.path = path;
    this.findings = [];                      // [level, lineno, code, message]
    this.lines = splitlines(text);
    this.skipped_fences = 0;
    this.linted_fences = 0;
    this.annotations = 0;
    this.custom_entities = new Map();        // name -> first lineno (used w/o ::STATE intro)
    this.introduced = new Set();             // entities introduced via ::STATE
    this.mixed_last_op = false;
    this.body_last_op = false;
    // v4.2 document-scoped facts (4.5 regions, 4.6 image layers and frames)
    this.lists = new Map();                  // ::LIST entity -> [[lineno, [entities]]]
    this.merges = [];                        // [lineno, @TARGET, Map key -> value]
    this.layer_ops = new Map();              // @TARGET -> [[lineno, verb, Map]]
    this.image_layers = new Set();
    this.regions = new Map();                // region entity -> line of its ::STATE
    this.state_keys = new Map();             // ::STATE entity -> Set of keys written for it
    this.state_ctx = null;
    // counted for the page only; the Python has no such counters
    this.stat_declarations = 0;
    this.stat_operations = 0;
    this.stat_entities = new Set();
    var raw = "";
    for (var i = 0; i < this.lines.length; i++) {
      if (!isBlank(this.lines[i])) {
        raw = this.lines[i];
        break;
      }
    }
    this.raw_mode = strip(raw).startsWith("::ILANG::");
  }

  Linter.prototype.add = function (level, lineno, code, msg) {
    this.findings.push([level, lineno, code, msg]);
  };

  // ------------------------------------------------------------ entry points
  Linter.prototype.run = function () {
    this.prescan();
    if (this.raw_mode) this.lint_region(0, this.lines.length, true);
    else this.scan_mixed();
    this.report_frames();
    // SHOULD-level summary: custom entities used without ::STATE introduction
    var pending = [], self = this;
    this.custom_entities.forEach(function (lineno, n) {
      if (!self.introduced.has(n) && !PLACEHOLDER_ENTITIES.has(n)) pending.push(n);
    });
    pending.sort();                          // ASCII names: code unit order is code point order
    if (pending.length) {
      var first = Infinity;
      for (var k = 0; k < pending.length; k++) {
        first = Math.min(first, this.custom_entities.get(pending[k]));
      }
      this.add(INFO, first, "SHOULD",
               "custom entities used without ::STATE introduction (PATCH-2 \u00a72.2 SHOULD): " +
               pending.join(", "));
    }
    return this.findings;
  };

  // ------------------------------------------------------------ v4.2 pre-scan
  Linter.prototype.prescan = function () {
    var skip_until = null, lines = this.lines, i, s;
    for (i = 0; i < lines.length; i++) {
      s = strip(lines[i]);
      if (skip_until !== null) {
        if (s === skip_until) skip_until = null;
        continue;
      }
      if (s.startsWith("::UNTRUSTED{")) {
        var dm = RE_DELIMITER.exec(s);
        if (dm) skip_until = dm[1];
        continue;
      }
      var lm = RE_LIST_INTRO.exec(s);
      if (lm) {
        setdefault(this.lists, lm[1], []).push([i + 1, this.list_items(i)]);
        continue;
      }
      if (s.startsWith("=>")) s = strip(s.slice(2));
      if (!s.startsWith("[")) continue;
      var ms = mask_quoted(s), groups = bracketGroups(ms);
      for (var g = 0; g < groups.length; g++) {
        var gs = groups[g][0], ge = groups[g][1];
        var rg = readGroup(s, ms, gs, ge);
        var target = groupTarget(s, ms, rg.rest, ge);
        if (target === null || !RE_ENTITY_OK.test(target)) continue;
        var mods = new Map(mod_pairs(s, ms, gs, ge));
        if (rg.head === "MERGE" || rg.head === SIGMA) this.merges.push([i + 1, target, mods]);
        else setdefault(this.layer_ops, target, []).push([i + 1, rg.head, mods]);
      }
    }
    // 4.6.1: a MERGE on @IMG / @VID / @AUD, or on an image layer (itself a media target),
    // makes every entity on the ::LIST its src= names an image layer.
    var media = new Set(TIER4), changed = true;
    while (changed) {
      changed = false;
      for (var m = 0; m < this.merges.length; m++) {
        var mtarget = this.merges[m][1], mmods = this.merges[m][2];
        if (!media.has(mtarget)) continue;
        var defs = this.lists.get(mmods.has("src") ? mmods.get("src") : "") || [];
        for (var d = 0; d < defs.length; d++) {
          var items = defs[d][1];
          for (var t = 0; t < items.length; t++) {
            if (!media.has(items[t]) && !REGISTERED_ENTITIES.has(items[t])) {
              media.add(items[t]);
              changed = true;
            }
          }
        }
      }
    }
    TIER4.forEach(function (x) { media.delete(x); });
    this.image_layers = media;
  };

  Linter.prototype.list_items = function (i) {
    var lines = this.lines, n = lines.length;
    var header_indent = indentOf(lines[i]);
    var items = [], bound = false, j = i + 1;
    while (j < n) {
      if (isBlank(lines[j])) {
        var k = j + 1;
        while (k < n && isBlank(lines[k])) k++;
        if (bound && k < n && indentOf(lines[k]) > header_indent) {
          j = k;
          continue;
        }
        break;
      }
      if (indentOf(lines[j]) <= header_indent) break;
      bound = true;
      var im = RE_LIST_ITEM.exec(strip(lines[j]));
      if (im) items.push(im[1]);
      j++;
    }
    return items;
  };

  Linter.prototype.scan_mixed = function () {
    var i = 0, lines = this.lines, n = lines.length;
    while (i < n) {
      var line = lines[i];
      if (RE_FENCE.test(line)) {
        var start = i + 1;
        i++;
        while (i < n && !RE_FENCE.test(lines[i])) i++;
        var end = i;                         // fence body is [start, end)
        i++;                                 // skip closing fence
        var first = "";
        for (var j = start; j < end; j++) {
          if (!isBlank(lines[j])) {
            first = strip(lines[j]);
            break;
          }
        }
        if (is_ilang_start(first)) {
          this.linted_fences++;
          this.lint_region(start, end, true);
        } else this.skipped_fences++;
        continue;
      }
      var s = strip(line);
      if (s.startsWith("::") || RE_TEMPORAL_PREFIX.test(s)) {
        this.mixed_last_op = false;
        i = this.parse_construct(i, true);
        continue;
      }
      // a `=>` line in mixed mode is linted only as the continuation of a bare operation line
      if (!s) this.mixed_last_op = false;
      else if (s.startsWith("=>")) {
        if (this.mixed_last_op) this.check_operation(i, strip(s.slice(2)), true);
      } else if (s.startsWith("[") && s.indexOf("](") < 0 && !s.startsWith("[!")) {
        var ms = mask_quoted(s);
        if (ms.indexOf("]=>") >= 0 || RE_TAG_LINE.test(ms)) {
          this.check_bracket_line(i, s);
          this.mixed_last_op = ms.indexOf("]=>") >= 0 || OPS.has(head_of(s));
        }
      } else this.mixed_last_op = false;
      i++;
    }
  };

  // -------------------------------------------------------------- region walk
  Linter.prototype.lint_region = function (start, end, raw) {
    var lines = this.lines, i = start, j;
    var last_op = false;                     // whether `=>` may continue a chain
    var seen_construct = false;              // colophon tolerance: prose ok in tag-only regions
    var in_preamble = false;                 // 1.7: tag lines right after a ::ILANG header
    var first_nb = -1, last_nb = -1;
    for (j = start; j < end; j++) {
      if (!isBlank(lines[j])) {
        if (first_nb < 0) first_nb = j;
        last_nb = j;
      }
    }
    while (i < end) {
      var s = strip(lines[i]);
      if (!s || s === "---") {
        last_op = false;
        i++;
        continue;
      }
      if (RE_DOC_MARKER.test(s)) {
        if (i === first_nb) in_preamble = true;
        else if (i !== last_nb) {
          this.add(ERROR, i + 1, "E300",
                   "::ILANG document marker may only open or close a document (\u00a71.7)");
        }
        last_op = false;
        i++;
        continue;
      }
      if (RE_TEMPORAL_BIND.test(s)) {
        last_op = false;
        i++;
        continue;
      }
      var in_preamble_here = in_preamble;
      in_preamble = false;
      if (s.startsWith("::") || RE_TEMPORAL_PREFIX.test(s)) {
        seen_construct = true;
        last_op = false;
        i = this.parse_construct(i, false, end);
        continue;
      }
      if (s.startsWith("=>")) {
        if (last_op) this.check_operation(i, strip(s.slice(2)), true);
        else this.add(ERROR, i + 1, "E300", "orphan `=>` continuation: no preceding operation line");
        i++;
        continue;
      }
      if (s.startsWith("[")) {
        // preamble position (1.7): tag lines right after a ::ILANG header are document
        // metadata even when TAG collides with a verb name; never operations, no E304
        var ms = mask_quoted(s);
        if (in_preamble_here && RE_TAG_LINE.test(ms) && ms.indexOf("]=>") < 0) {
          in_preamble = true;
          last_op = false;
          i++;
          continue;
        }
        this.check_bracket_line(i, s);
        last_op = ms.indexOf("]=>") >= 0 || OPS.has(head_of(s));
        if (last_op) seen_construct = true;  // tag metadata lines are not constructs
        i++;
        continue;
      }
      last_op = false;
      if (RE_TEMPORAL_NOTE.test(s)) {
        i++;
        continue;
      }
      if (s.startsWith("\u2192") || s.startsWith("<<<")) {
        this.annotations++;
        i++;
        continue;
      }
      if (!seen_construct && !STRUCTURAL_CHARS.some(function (c) { return s.indexOf(c) >= 0; })) {
        this.annotations++;                  // colophon prose in a tag-only region
        i++;
        continue;
      }
      this.add(ERROR, i + 1, "E300", "line matches no I-Lang production: " + cpPrefix(s, 60));
      i++;
    }
  };

  // --------------------------------------------------------- construct parser
  // Parse one ::DECL construct starting at line i; return the next index.
  Linter.prototype.parse_construct = function (i, mixed, limit) {
    var end = limit !== undefined && limit !== null ? limit : this.lines.length;
    var line = this.lines[i];
    var stripped = strip(line);
    var prefix_m = RE_TEMPORAL_PREFIX.exec(stripped);
    var decl_text = prefix_m ? prefix_m[2] : stripped;
    var header_indent = indentOf(line);

    var m = RE_DECL_HEAD.exec(decl_text);
    if (!m) {
      var bad = RE_BAD_DECL_HEAD.exec(decl_text);
      this.add(ERROR, i + 1, "E300",
               "malformed declaration header: " + cpPrefix(bad ? bad[0] : decl_text, 60));
      return i + 1;
    }
    var name = m[1], subname = m[2], rest = m[3];

    if (name === "ILANG") {
      if (!RE_DOC_MARKER.test(decl_text)) {
        this.add(ERROR, i + 1, "E300", "malformed ::ILANG document marker: " + cpPrefix(decl_text, 60));
      }
      return i + 1;
    }
    if (subname && name !== "MODULE") {
      this.add(ERROR, i + 1, "E300",
               "::" + name + "::" + subname + " \u2014 only ::MODULE takes a two-segment name (\u00a71.7)");
    }
    var registered = DECL_STRUCTURAL.has(name) || DECL_NARRATIVE.has(name) ||
                     TERMINATORS.has(name) || META_DECLS.has(name);
    if (!registered) {
      if (TOLERATED_ANNOT.has(name)) {
        this.annotations++;
        return i + 1;
      }
      this.add(ERROR, i + 1, "E300", "::" + name + " is not in the declaration registry " +
               "(32 structural + 13 narrative, PATCH-2 \u00a71.5/\u00a71.6)");
    }
    this.stat_declarations++;

    this.scan_entities(i, decl_text);

    rest = rest ? strip(rest) : "";
    if (!rest.startsWith("{")) {
      this.add(ERROR, i + 1, "E300", "::" + name + " header lacks `{`");
      return i + 1;
    }

    // 1.3: full-width U+FF5C / U+FF1A as structural separators. Full-width punctuation is legal inside
    // values, so U+FF1A is flagged only when a pipe-delimited field has no ASCII colon at all.
    if (rest.indexOf("\uff5c") >= 0) {
      this.add(ERROR, i + 1, "E300",
               "full-width \uff5c as structural separator (\u00a71.3) \u2014 use ASCII `|`");
    } else if (rest.indexOf("\uff1a") >= 0) {
      var segs = stripChars(rest, "{}").split("|");
      for (var k = 0; k < segs.length; k++) {
        if (segs[k].indexOf("\uff1a") >= 0 && segs[k].indexOf(":") < 0) {
          this.add(ERROR, i + 1, "E300",
                   "full-width \uff1a as structural separator (\u00a71.3) \u2014 use ASCII `:`");
          break;
        }
      }
    }

    // narrative double-brace requirement; the content brace may span lines
    if (NARR_DOUBLE.has(name)) {
      if (RE_NARR_FULL.test(rest)) return this.consume_body(i, name, header_indent, end);
      if (RE_NARR_OPEN.test(rest)) return this.consume_brace_span(i, name, rest, end);
      this.add(ERROR, i + 1, "E300", "::" + name +
               " requires double-brace form ::VERB{addressing}{content} (v3.0 \u00a77)");
      return i + 1;
    }

    // brace balance on the header line decides the shape
    if (count(rest, "{") - count(rest, "}") > 0) return this.consume_brace_span(i, name, rest, end);

    // inline / header_body; a same-line trailing body token is permitted
    var close = find_close(rest);
    var trailing = close >= 0 ? strip(rest.slice(close + 1)) : "";

    var im = RE_STATE_INTRO.exec(decl_text);
    if (im) {
      var ent = im[1];
      this.introduced.add(ent.slice(1));    // ent.lstrip("@"): the pattern holds one `@`
      if (TIER12.has(ent)) {
        this.add(WARN, i + 1, "E202", "::STATE re-introduces registered name " + ent +
                 " \u2014 possible rebinding (\u00a72.2)");
      }
      // v4.2: the body lines that follow (trailing token included) may declare a region
      this.begin_state(i, ent, close > 0 ? rest.slice(1, close) : rest.slice(1));
    }
    if (trailing) this.classify_body_line(i, name, trailing, false);

    if (name === "UNTRUSTED") {
      var dm = RE_DELIMITER.exec(rest);
      if (dm) return this.consume_opaque(i + 1, dm[1], end);
    }

    var j = this.consume_body(i, name, header_indent, end);
    if (im) this.end_state();
    return j;
  };

  Linter.prototype.consume_brace_span = function (i, name, rest, end) {
    // 1.1: a set-span (header ends with `{`) ends at the bare `}` line; a wrapped field
    // header (content after the opening brace) ends at the first line ending with `}`.
    var wrapped = !rstrip(rest).endsWith("{");
    for (var j = i + 1; j < end; j++) {
      var t = strip(this.lines[j]);
      if (t === "}" || (wrapped && t.endsWith("}"))) return j + 1;
    }
    this.add(ERROR, i + 1, "E300", "::" + name + " brace span never closes");
    return end;
  };

  Linter.prototype.consume_opaque = function (j, delimiter, end) {
    while (j < end) {
      if (strip(this.lines[j]) === delimiter) return j + 1;
      j++;
    }
    return j;
  };

  // Collect header_body lines: indented, or flush-left per FLUSH-LEFT-BODY.
  Linter.prototype.consume_body = function (i, name, header_indent, end) {
    var lines = this.lines, j = i + 1;
    var regime = null;                       // "indent" | "flush" once the first body line binds
    this.body_last_op = false;
    while (j < end) {
      var line = lines[j];
      if (isBlank(line)) {
        if (regime !== "indent") return j;   // flush-left bodies end at the first blank
        // a blank is permitted inside an indented body if the next nonblank is still indented
        var k = j + 1;
        while (k < end && isBlank(lines[k])) k++;
        if (k < end && indentOf(lines[k]) > header_indent) {
          j = k;
          continue;
        }
        return j;
      }
      var s = strip(line);
      var indent = indentOf(line);
      if (indent > header_indent) {
        if (regime === "flush") return j;
        regime = "indent";
        j = this.body_line(j, name, s, indent, end);
        continue;
      }
      if (regime === "indent") return j;     // dedent ends the indented body (1.1)
      if (indent !== header_indent) return j;   // FLUSH-LEFT binds at the same indent only
      // flush-left: a body-form line binds; the next `::` / `T[` header ends the body
      if (s.startsWith("::") || RE_TEMPORAL_PREFIX.test(s) || RE_DOC_MARKER.test(s)) return j;
      if (this.is_body_form(s)) {
        regime = "flush";
        this.classify_body_line(j, name, s, false);
        j++;
        continue;
      }
      return j;
    }
    return j;
  };

  // One indented body line; B7 nesting may consume extra lines.
  Linter.prototype.body_line = function (j, name, s, indent, end) {
    if (s.startsWith("::")) {
      var nm = RE_DECL_HEAD.exec(s);
      var nested_name = nm ? nm[1] : "?";
      if (nm && TOLERATED_ANNOT.has(nested_name)) {
        this.annotations++;
        return j + 1;
      }
      if (nm) this.stat_declarations++;
      if (!nm || (!DECL_STRUCTURAL.has(nested_name) && !DECL_NARRATIVE.has(nested_name))) {
        this.add(ERROR, j + 1, "E300", "nested ::" + nested_name + " is not a registered declaration");
        return j + 1;
      }
      var nrest = strip(s.slice(2 + nested_name.length));   // nested_name is ASCII
      if (NARR_DOUBLE.has(nested_name) && !RE_NARR_FULL.test(nrest)) {
        this.add(ERROR, j + 1, "E300", "::" + nested_name +
                 " requires double-brace form ::VERB{addressing}{content} (v3.0 \u00a77)");
      }
      this.scan_entities(j, s);
      var im = RE_STATE_INTRO.exec(s);
      if (im) {                              // v4.2: a nested ::STATE body may declare a region
        var nclose = find_close(nrest);
        this.begin_state(j, im[1], nclose > 0 ? nrest.slice(1, nclose) : nrest.slice(1));
      }
      // a nested declaration may carry its own deeper body (B1-B6); a declaration nested
      // deeper still exceeds one level -> E300
      var k = j + 1;
      while (k < end) {
        var ln = this.lines[k];
        if (isBlank(ln)) break;
        if (indentOf(ln) <= indent) break;
        var t = strip(ln);
        if (t.startsWith("::")) {
          this.add(ERROR, k + 1, "E300", "declaration nesting exceeds one level (\u00a71.2 B7)");
        } else this.classify_body_line(k, nested_name, t, true);
        k++;
      }
      if (im) this.end_state();
      return k;
    }
    this.classify_body_line(j, name, s, false);
    return j + 1;
  };

  // B1-B5 / reserved-key shapes eligible for flush-left binding; B8 (`[VERB...]`
  // operations, `=>` continuations) is excluded: FLUSH-LEFT-BODY binds B1-B5 only.
  Linter.prototype.is_body_form = function (s) {
    if (s.startsWith("T:") || s.startsWith("A:")) return true;
    if (s.startsWith("[")) {
      var ms = mask_quoted(s);
      return (RE_TAG_LINE.test(ms) || RE_TAG_TEXT.test(ms)) && !OPS.has(head_of(s));
    }
    return RE_KEY.test(s) || RE_TEMPORAL_BIND.test(s);
  };

  Linter.prototype.classify_body_line = function (j, parent, s, nested) {
    var lineno = j + 1;
    if (RE_TEMPORAL_BIND.test(s) || RE_TEMPORAL_NOTE.test(s)) return;
    if (s.startsWith("\u2192")) {
      this.annotations++;
      return;
    }
    if (s.startsWith("T:") || s.startsWith("A:")) {          // B1
      this.scan_entities(j, s);
      return;
    }
    if (s.startsWith("=>")) {                                 // B8 continuation
      if (this.body_last_op) this.check_operation(j, strip(s.slice(2)), true);
      else if (!PROSE_BODY.has(parent)) {
        this.add(ERROR, lineno, "E300", "orphan `=>` continuation in ::" + parent +
                 " body: no preceding operation line (\u00a71.7)");
      }
      return;
    }
    if (s.startsWith("[")) {                                  // B5 or B8
      var ms = mask_quoted(s);
      if (ms.indexOf("]=>") >= 0 || OPS.has(head_of(s))) {
        this.check_operation(j, s, true);
        this.body_last_op = true;
      } else if (RE_TAG_LINE.test(ms) || RE_TAG_TEXT.test(ms)) {
        // B5 tag line
      } else if (PROSE_BODY.has(parent)) {
        // bracket-initial prose
      } else {
        this.add(ERROR, lineno, "E300",
                 "bracket body line is neither B5 tag nor B8 operation: " + cpPrefix(s, 60));
      }
      return;
    }
    var km = RE_KEY.exec(s);
    if (km) {                                                 // B2 / B3 / B4
      this.scan_entities(j, s);
      if (parent === "STATE" && this.state_ctx !== null) this.note_state_key(lineno, km[1], km[2]);
      return;
    }
    if (!PROSE_BODY.has(parent)) {                            // else B6 prose
      this.add(ERROR, lineno, "E300", "B6 prose body line inside non-prose ::" + parent +
               " (\u00a71.2 B6): " + cpPrefix(s, 50));
    }
  };

  // ---------------------------------------------------------- bracket lines
  Linter.prototype.check_bracket_line = function (i, s) {
    var ms = mask_quoted(s);
    if (ms.indexOf("]=>") >= 0) {
      this.check_operation(i, s, true);
      return;
    }
    if (OPS.has(head_of(s))) this.check_operation(i, s, false);
    else if (!RE_TAG_LINE.test(ms)) {       // a tag line is metadata
      this.add(ERROR, i + 1, "E300", "bracket line is neither tag nor operation: " + cpPrefix(s, 60));
    }
  };

  // Groups and modifiers are read on the mask, which keeps the offsets of s: separators inside
  // a quoted value never split it and brackets inside it never open a group. The target is
  // read back from s, so messages quote it as written.
  Linter.prototype.check_operation = function (i, s, chain) {
    var lineno = i + 1, ms = mask_quoted(s), groups = bracketGroups(ms);
    this.stat_operations++;
    for (var g = 0; g < groups.length; g++) {
      var gs = groups[g][0], ge = groups[g][1];
      var rg = readGroup(s, ms, gs, ge), head = rg.head;
      if (PLACEHOLDER_HEADS.has(head)) continue;
      if (!VERBS.has(head) && !ALIASES.has(head)) {
        if (chain) {
          var code = cpLen(head) === 1 && !isascii(head) ? "E305" : "E304";
          this.add(ERROR, lineno, code, "unknown " + (code === "E305" ? "alias" : "verb") +
                   " `" + head + "` in operation chain");
        }
        continue;
      }
      var target = groupTarget(s, ms, rg.rest, ge);
      if (target === null) target = "";
      if (target) {
        if (target.startsWith("@")) {
          if (!RE_ENTITY_OK.test(target)) {
            this.add(ERROR, lineno, "E300", "entity `" + target + "` violates @[A-Z][A-Z0-9_]* (\u00a72.2)");
          } else this.note_entity(i, target);
        } else if (head === "BATC" || head === PI) {
          if (!VERBS.has(target) && !ALIASES.has(target)) {
            this.add(ERROR, lineno, "E304", "BATC verb reference `" + target +
                     "` is not a registered verb or alias");
          }
        } else {
          this.add(ERROR, lineno, "E300", "operation target `" + target +
                   "` is not an @ENTITY (v3.0 \u00a72.2; BATC/\u03a0 excepted)");
        }
      }
      var bar = rg.rest;                     // "|" in rest
      while (bar < ge && ms.charCodeAt(bar) !== 124) bar++;
      if (bar >= ge) continue;
      // v4.1 4.4.1: the media profile is in force only when the target is a media entity;
      // v4.2 4.6.1: an image layer is a media target, in force as @IMG.
      var media = TIER4.has(target) || this.image_layers.has(target);
      var allowed = media ? MEDIA_MODIFIERS : MODIFIERS;
      var where = media ? "the 29-key core registry or the 20-key media profile" : "the 29-key registry";
      // mods = rest.split("|", 1)[1], cut on `|` and `,`; a piece without `=` continues a value
      for (var start = bar + 1, k = bar + 1; k <= ge; k++) {
        if (k < ge && ms.charCodeAt(k) !== 124 && ms.charCodeAt(k) !== 44) continue;
        var eq = start;
        while (eq < k && ms.charCodeAt(eq) !== 61) eq++;
        if (eq < k) {
          var key = strip(maskedText(s, ms, start, eq));
          if (key && !allowed.has(key)) {
            var hint = "";
            if (!media && MEDIA_PROFILE.has(key)) {
              hint = " (media profile key used on a non-media target; \u00a74.4.1 gates it to @IMG," +
                     " @VID and @AUD, v4.2 \u00a74.6.1 to an image layer)";
            } else if (REGION_KEYS.has(key)) {
              hint = " (region body key; v4.2 \u00a74.5.3 writes it on a ::STATE body line, never" +
                     " as a modifier)";
            }
            this.add(ERROR, lineno, "E302", "modifier `" + key + "` not in " + where + hint);
          }
        }
        start = k + 1;
      }
    }
  };

  // -------------------------------------------------------------- entities
  Linter.prototype.scan_entities = function (i, s) {
    var m;
    RE_ENTITY_TOKEN.lastIndex = 0;
    while ((m = RE_ENTITY_TOKEN.exec(s)) !== null) {
      var name = "@" + m[1], c0 = m[1].charCodeAt(0);
      if (c0 >= 97 && c0 <= 122) {           // group(1)[0].islower(): [A-Za-z] opens it
        this.add(ERROR, i + 1, "E300", "entity `" + name + "` violates @[A-Z][A-Z0-9_]* (\u00a72.2)");
      } else if (RE_ENTITY_OK.test(name)) {
        this.stat_entities.add(name);
        if (!REGISTERED_ENTITIES.has(name)) setdefault(this.custom_entities, m[1], i + 1);
      }
    }
  };

  Linter.prototype.note_entity = function (i, name) {
    this.stat_entities.add(name);
    if (!REGISTERED_ENTITIES.has(name)) setdefault(this.custom_entities, name.slice(1), i + 1);
  };

  // --------------------------------------------- v4.2 regions and image layers
  // Open the context of ::STATE{@ENT ...} at line i for the body lines that follow; header
  // keys are recorded for 4.6.3, and a region body key among them is misplaced (4.5.2).
  Linter.prototype.begin_state = function (i, ent, header) {
    var keys = [], m, mh = mask_quoted(header);
    RE_HEADER_KEY.lastIndex = 0;
    while ((m = RE_HEADER_KEY.exec(mh)) !== null) keys.push(m[1]);
    var known = setdefault(this.state_keys, ent, new Set());
    keys.forEach(function (k) { known.add(k); });
    var ctx = { ent: ent, lineno: i + 1, region: false, found: [], outer: this.state_ctx };
    var misplaced = keys.filter(function (k) { return REGION_KEYS.has(k); });
    if (misplaced.length) {
      ctx.region = true;
      this.add(WARN, i + 1, "E300", "region geometry `" + misplaced[0] + ":` is written in the " +
               "::STATE header; a region body key is a body line (v4.2 \u00a74.5.2)");
    }
    this.state_ctx = ctx;
  };

  Linter.prototype.note_state_key = function (lineno, key, value) {
    var ctx = this.state_ctx;
    setdefault(this.state_keys, ctx.ent, new Set()).add(key);
    if (REGION_KEYS.has(key)) ctx.found.push([lineno, key, strip(value)]);
  };

  // Close the open ::STATE context: one region body key per region (4.5.2), the value checks
  // of 4.5.3 / 4.5.4, and no entity is both a region and an image layer (4.6.1). All WARN.
  Linter.prototype.end_state = function () {
    var ctx = this.state_ctx;
    this.state_ctx = ctx.outer;
    var ent = ctx.ent, found = ctx.found;
    if (found.length) {
      ctx.region = true;
      if (found.length > 1) {
        this.add(WARN, found[1][0], "E300", "a region body carries exactly one region body key; `" +
                 found[1][1] + ":` follows `" + found[0][1] + ":` (v4.2 \u00a74.5.2)");
      }
      for (var k = 0; k < found.length; k++) this.check_region_value(found[k][0], found[k][1], found[k][2]);
    }
    if (ctx.region) {
      setdefault(this.regions, ent, ctx.lineno);
      if (this.image_layers.has(ent)) {
        this.add(WARN, ctx.lineno, "E300", ent + " is declared as a region and named as an image " +
                 "layer; one entity is never both (v4.2 \u00a74.6.1)");
      }
    }
  };

  var REGION_COUNTS = {                      // least, exact, wants
    pts: [2, null, "an even count of at least 2"],
    bnd: [4, 4, "exactly 4"],
    vtx: [6, null, "an even count of at least 6"]
  };

  // 4.5.3 line form and item count, 4.5.4 units and corner order, on one region body line
  Linter.prototype.check_region_value = function (lineno, key, val) {
    if (key === "msk") {
      if (val.startsWith("[")) {
        this.add(WARN, lineno, "E300", "msk is a B2 field line `msk:value` naming a path, URI or " +
                 "entity, not a vector (v4.2 \u00a74.5.3)");
      } else if (!val) {
        this.add(WARN, lineno, "E303", "msk names a path, URI or entity holding a mask; the value " +
                 "is empty (v4.2 \u00a74.5.3)");
      }
      return;
    }
    if (!(val.startsWith("[") && val.endsWith("]"))) {
      this.add(WARN, lineno, "E300", key + " is a B4 vector line `" + key + ":[x,y,...]` (v4.2 " +
               "\u00a74.5.3; SPEC-v5.0-PRE Part III \u00a71.2)");
      return;
    }
    var items = val.slice(1, -1).split(",").map(strip);
    var norm = items.filter(function (x) { return RE_NORM_ITEM.test(x); });
    var px = items.filter(function (x) { return RE_PX_ITEM.test(x); });
    var units_ok = true;
    if (norm.length + px.length < items.length) {
      units_ok = false;
      var bad = items.filter(function (x) { return !RE_NORM_ITEM.test(x) && !RE_PX_ITEM.test(x); })[0];
      var what = isdigit(bad) ? "a bare integer; write `" + bad + "px` or a normalised decimal"
        : "neither a normalised decimal 0.00-1.00 with two to four places nor a non-negative integer with px";
      this.add(WARN, lineno, "E303", key + " item `" + bad + "` is " + what + " (v4.2 \u00a74.5.4)");
    } else if (norm.length && px.length) {
      units_ok = false;
      this.add(WARN, lineno, "E303", key + " mixes normalised and px items; one geometry line uses " +
               "one unit (v4.2 \u00a74.5.4)");
    }
    var spec = REGION_COUNTS[key], cnt = items.length;
    if (cnt % 2 || cnt < spec[0] || (spec[1] !== null && cnt !== spec[1])) {
      this.add(WARN, lineno, "E303", key + " has " + cnt + " items; it takes " + spec[2] +
               " (v4.2 \u00a74.5.3)");
    } else if (key === "bnd" && units_ok) {
      var v = items.map(function (x) { return parseFloat(px.length ? x.slice(0, -2) : x); });
      if (!(v[0] < v[2] && v[1] < v[3])) {
        this.add(WARN, lineno, "E303", "bnd corners are out of order; it takes x1 < x2 and y1 < y2" +
                 " (v4.2 \u00a74.5.3)");
      }
    }
  };

  // 4.6.3 frame rules, WARN only: a MERGE's own asp / rsl against those an operation on an
  // image layer of its list writes, and against another MERGE whose list names that layer.
  Linter.prototype.report_frames = function () {
    var fixed = new Map(), seen = new Set();
    for (var n = 0; n < this.merges.length; n++) {
      var lineno = this.merges[n][0], target = this.merges[n][1], mods = this.merges[n][2];
      if (!TIER4.has(target) && !this.image_layers.has(target)) continue;
      var defs = this.lists.get(mods.has("src") ? mods.get("src") : "") || [];
      if (!defs.length) continue;
      var asp = mods.get("asp"), rsl = mods.get("rsl");     // undefined where Python has None
      if (asp === undefined && rsl === undefined) {
        this.report_unfixed_frame(lineno, defs);
        continue;
      }
      var conflicts = [], items = new Set();                  // dict.fromkeys: first-seen order
      defs.forEach(function (d) { d[1].forEach(function (it) { items.add(it); }); });
      var ordered = Array.from(items);
      for (var t = 0; t < ordered.length; t++) {
        var item = ordered[t], ops = this.layer_ops.get(item) || [];
        for (var o = 0; o < ops.length; o++) {
          var op_ln = ops[o][0], omods = ops[o][2];
          var pairs = [["asp", asp], ["rsl", rsl]];
          for (var p = 0; p < 2; p++) {
            var key = pairs[p][0], val = pairs[p][1], own = omods.get(key);
            if (val === undefined || own === undefined || seen.has(op_ln + " " + key) ||
                frame_value(own) === frame_value(val)) continue;
            seen.add(op_ln + " " + key);
            this.add(WARN, op_ln, "E303", key + "=" + own + " on image layer " + item + " differs from " +
                     key + "=" + val + " of the MERGE at line " + lineno +
                     " that composes it (v4.2 \u00a74.6.3: reported, not rescaled)");
          }
        }
        var prev = setdefault(fixed, item, [lineno, asp, rsl]);
        var cmp = [["asp", prev[1], asp], ["rsl", prev[2], rsl]];
        for (var c = 0; c < 2; c++) {
          var a = cmp[c][1], b = cmp[c][2];
          if (a !== undefined && b !== undefined && frame_value(a) !== frame_value(b)) {
            conflicts.push(item + ": " + cmp[c][0] + "=" + b + " here, " + cmp[c][0] + "=" + a +
                           " at line " + prev[0]);
            break;
          }
        }
      }
      if (conflicts.length) {
        this.add(WARN, lineno, "E303", "one image layer has one frame; this MERGE fixes a different " +
                 "frame from an earlier composite naming it (v4.2 \u00a74.6.3): " + conflicts.join("; "));
      }
    }
  };

  // 4.6.3: a MERGE stating neither asp nor rsl takes the frame of the operation making its
  // bottom image layer; reported only where the text decides it.
  Linter.prototype.report_unfixed_frame = function (lineno, defs) {
    var bottoms = new Set();
    defs.forEach(function (d) { if (d[1].length) bottoms.add(d[1][0]); });
    if (bottoms.size !== 1) return;
    var bottom = bottoms.values().next().value;
    var ops = this.layer_ops.get(bottom) || [];
    if (!ops.length || ops.some(function (op) { return !FRAME_SETTING_VERBS.has(op[1]); })) return;
    var hints = ["asp", "rsl", "ref"], known = this.state_keys.get(bottom) || new Set();
    if (ops.some(function (op) { return hints.some(function (h) { return op[2].has(h); }); }) ||
        hints.some(function (h) { return known.has(h); })) return;
    this.add(WARN, lineno, "E303", "composite frame cannot be fixed: this MERGE states neither asp " +
             "nor rsl and the operation making its bottom image layer " + bottom + " states neither " +
             "(v4.2 \u00a74.6.3: incomplete composite)");
  };

  // ---------------------------------------------------------------------- API
  // lint(text, opts) -> {mode, findings, counts, stats}. findings is Linter(path, text).run();
  // stats are counted for the page and have no counterpart in the Python.
  function lint(text, opts) {
    var path = opts && opts.path !== undefined ? opts.path : "<input>";
    var lt = new Linter(path, typeof text === "string" ? text : text == null ? "" : String(text));
    var raw = lt.run(), findings = [], counts = { errors: 0, warnings: 0, infos: 0 };
    for (var k = 0; k < raw.length; k++) {
      var f = raw[k];
      findings.push({ level: f[0], line: f[1], code: f[2], message: f[3] });
      if (f[0] === ERROR) counts.errors++;
      else if (f[0] === WARN) counts.warnings++;
      else counts.infos++;
    }
    return {
      mode: lt.raw_mode ? "raw" : "mixed",
      findings: findings,
      counts: counts,
      stats: {
        lines: lt.lines.length,
        declarations: lt.stat_declarations,
        operations: lt.stat_operations,
        entities: lt.stat_entities.size,
        fences_linted: lt.linted_fences,
        fences_skipped: lt.skipped_fences,
        annotations: lt.annotations
      }
    };
  }

  function sorted(set) {
    return Array.from(set).sort();
  }

  return {
    lint: lint,
    Linter: Linter,
    SOURCE: SOURCE,
    registries: {
      declarations_structural: sorted(DECL_STRUCTURAL),
      declarations_narrative: sorted(DECL_NARRATIVE),
      verbs: sorted(VERBS),
      aliases: GREEKISH.split(""),
      modifiers: sorted(MODIFIERS),
      media_profile: sorted(MEDIA_PROFILE),
      region_keys: sorted(REGION_KEYS),
      entities: sorted(REGISTERED_ENTITIES)
    },
    // Python string semantics, exposed for the tests
    _py: {
      splitlines: splitlines, strip: strip, rstrip: rstrip, indent: indentOf,
      isspace: function (s) { return s.length > 0 && isBlank(s); },
      isdigit: isdigit, lower: lower, len: cpLen, prefix: cpPrefix,
      mask_quoted: function (s) { var ms = mask_quoted(s); return maskedText(s, ms, 0, s.length); }
    }
  };
});
