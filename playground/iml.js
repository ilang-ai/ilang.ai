/*
 * iml.js: the IML 0.5.1 codec for I-Lang operation chains, in the browser. Global IML.
 *
 * A port of github.com/ilang-ai/iml-protocol at commit 6d696d0 (v0.5.1), chains only:
 * iml/codec.py (compile, decompile, the 0.5, 0.4 and 0.3 chain surface), iml/l2.py
 * (parse_L2, print_L2, the continuation join), iml/__main__.py (what `python -m iml
 * compile [--document]` and `python -m iml decompile` do with their input: leading byte
 * order marks, CRLF, blank lines, the line an error is reported at), the chain part of
 * iml/doc_parse.py and iml/doc_read.py (how a document's lines are told apart), and
 * registry/iml-registry-0.5.json (embedded below). Outputs and errors (code, message,
 * line, offset, operation) are the reference codec's for every chain input.
 *
 * Not ported: declarations and text lines (the document layer of 0.5) and the 0.2 surface.
 * A line that is not an operation chain is E502 with PLAYGROUND_DOC below; the reference
 * codec converts it (github.com/ilang-ai/iml-protocol).
 *
 * Offsets are 0-based code point offsets, as the Python codec counts them: into the
 * joined chain text for a message compile, into the input for a document compile or
 * decompile, into the line for a decompiled message.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IML = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---------------------------------------------------------------- registry
  // registry/iml-registry-0.5.json at 6d696d0 (canon 127ba56), digest 7e29fae7f5eab384fd1588c23ac9860dbb387e5d66bd1be71343d0bc728d61ba;
  // 0.4, 0.3 and 0.2 headers carry the chain registry's digest 88d05d0839c1a2002abdb6f6be3c9846c2990496ce655b738d874217cc78c03f.
  var DIGEST_05 = "7e29fae7f5eab384fd1588c23ac9860dbb387e5d66bd1be71343d0bc728d61ba";
  var DIGEST_CHAIN = "88d05d0839c1a2002abdb6f6be3c9846c2990496ce655b738d874217cc78c03f";
  // the 88 verbs in registry order, NAME:ROOT (OUT has no root)
  var VERBS = [
    "READ:RD WRIT:WR GET:GT DEL:DL LIST:LS COPY:CP MOVE:MV STRM:ST CACH:CC SYNC:SY SEND:SN RUN:RN FMT:FM",
    "CONV:CN SPLIT:SP MERGE:MR MAP:MP FILT:FL SORT:SR DEDU:DD FLAT:FT NEST:NS CHNK:CH REDU:RE PIVT:PV",
    "TRNS:TR ENCD:EN DECD:DC HASH:HS CMPR:CM EXPN:EX XLAT:XL REWR:RW DIFF:DF SCAN:SC MTCH:MT CNT:CT",
    "STAT:SA EVAL:EV SCOR:SO RANK:RK TRND:TN CORR:CR FRCS:FR ANOM:AN SENT:SE CLST:CL BNCH:BN AUDT:AD",
    "VALD:VL CLSF:CS CREA:CE DRFT:DR EXPD:EP SHRT:SH PARA:PR STYL:SL TMPL:TM FILL:FI EXTC:ET GEN:GN",
    "PLAN:PL DECI:DE CHEK:CK FIX:FX DPLO:DP SAVE:SV REVW:RV LERN:LR TEST:TS PARS:PS LOOP:LP WAIT:WT OUT",
    "DISP:DS EXPT:EA PRNT:PN LOG:LG LINK:LN SET:SB TAG:TG GRP:GR EMBD:EM HELP:HL DESC:DA INTR:IN NOOP:NP",
    "BATC:BT"
  ].join(" ");
  var ALIASES = {
    "\u0394": "DIFF",
    "\u03a0": "BATC",
    "\u03a3": "MERGE",
    "\u03a9": "OUT",
    "\u03b6": "CMPR",
    "\u03b8": "XLAT",
    "\u03bb": "MAP",
    "\u03bc": "STAT",
    "\u03be": "HASH",
    "\u03c6": "FILT",
    "\u03c8": "SENT",
    "\u2202": "SPLIT",
    "\u2207": "SORT"
  };
  // the 49 modifier keys, name:code
  var KEYS = [
    "src:sr dst:ds path:pt fmt:fm lng:ln sty:st ton:tn len:le lim:lm off:of top:tp bot:bt srt:sa grp:gr",
    "whr:wh mch:mc exc:ex dep:dp rng:rn typ:ty enc:en cap:cp pri:pr col:cl row:rw frm:fr to:to scp:sc",
    "op:op sbj:sb act:ac plc:pl txt:tx pov:pv fcl:fc mvt:mv lgt:lg pal:pa mdm:md asp:as rsl:rs qly:ql",
    "dur:dr fps:fp sed:sd adh:ad ref:rf dlg:dl sfx:sf"
  ].join(" ");
  // the 25 registered entities, NAME:MARK
  var ENTITIES = [
    "SRC:SR DST:DS PREV:PR LOCAL:LC SCREEN:SC LOG:LG NULL:NL STDIN:ST GH:GH R2:R2 COS:CS DRIVE:DR",
    "WORKER:WR CF:CF SYSTEM:SY RUNTIME:RN GRADER:GR USER:US SELF:SL AGENT:AG TASK:TS TOOL:TL IMG:IM",
    "VID:VD AUD:AD"
  ].join(" ");
  // value_codes: every key's table is empty in 0.5 (a `~code` value is E303)

  // ------------------------------------------------------ Python 3.13 tables
  // str.isspace() (also `\s` of Python re): 9-d 1c-20 85 a0 1680 2000-200a 2028-2029 202f 205f 3000
  // str.isprintable() for code points >= U+0080 (Unicode 15.1.0, as Python 3.13), for repr()
  var PY_PRINTABLE = [
    "a1-ac ae-377 37a-37f 384-38a 38c 38e-3a1 3a3-52f 531-556 559-58a 58d-58f 591-5c7 5d0-5ea 5ef-5f4",
    "606-61b 61d-6dc 6de-70d 710-74a 74d-7b1 7c0-7fa 7fd-82d 830-83e 840-85b 85e 860-86a 870-88e 898-8e1",
    "8e3-983 985-98c 98f-990 993-9a8 9aa-9b0 9b2 9b6-9b9 9bc-9c4 9c7-9c8 9cb-9ce 9d7 9dc-9dd 9df-9e3",
    "9e6-9fe a01-a03 a05-a0a a0f-a10 a13-a28 a2a-a30 a32-a33 a35-a36 a38-a39 a3c a3e-a42 a47-a48 a4b-a4d",
    "a51 a59-a5c a5e a66-a76 a81-a83 a85-a8d a8f-a91 a93-aa8 aaa-ab0 ab2-ab3 ab5-ab9 abc-ac5 ac7-ac9",
    "acb-acd ad0 ae0-ae3 ae6-af1 af9-aff b01-b03 b05-b0c b0f-b10 b13-b28 b2a-b30 b32-b33 b35-b39 b3c-b44",
    "b47-b48 b4b-b4d b55-b57 b5c-b5d b5f-b63 b66-b77 b82-b83 b85-b8a b8e-b90 b92-b95 b99-b9a b9c b9e-b9f",
    "ba3-ba4 ba8-baa bae-bb9 bbe-bc2 bc6-bc8 bca-bcd bd0 bd7 be6-bfa c00-c0c c0e-c10 c12-c28 c2a-c39",
    "c3c-c44 c46-c48 c4a-c4d c55-c56 c58-c5a c5d c60-c63 c66-c6f c77-c8c c8e-c90 c92-ca8 caa-cb3 cb5-cb9",
    "cbc-cc4 cc6-cc8 cca-ccd cd5-cd6 cdd-cde ce0-ce3 ce6-cef cf1-cf3 d00-d0c d0e-d10 d12-d44 d46-d48",
    "d4a-d4f d54-d63 d66-d7f d81-d83 d85-d96 d9a-db1 db3-dbb dbd dc0-dc6 dca dcf-dd4 dd6 dd8-ddf de6-def",
    "df2-df4 e01-e3a e3f-e5b e81-e82 e84 e86-e8a e8c-ea3 ea5 ea7-ebd ec0-ec4 ec6 ec8-ece ed0-ed9 edc-edf",
    "f00-f47 f49-f6c f71-f97 f99-fbc fbe-fcc fce-fda 1000-10c5 10c7 10cd 10d0-1248 124a-124d 1250-1256",
    "1258 125a-125d 1260-1288 128a-128d 1290-12b0 12b2-12b5 12b8-12be 12c0 12c2-12c5 12c8-12d6 12d8-1310",
    "1312-1315 1318-135a 135d-137c 1380-1399 13a0-13f5 13f8-13fd 1400-167f 1681-169c 16a0-16f8 1700-1715",
    "171f-1736 1740-1753 1760-176c 176e-1770 1772-1773 1780-17dd 17e0-17e9 17f0-17f9 1800-180d 180f-1819",
    "1820-1878 1880-18aa 18b0-18f5 1900-191e 1920-192b 1930-193b 1940 1944-196d 1970-1974 1980-19ab",
    "19b0-19c9 19d0-19da 19de-1a1b 1a1e-1a5e 1a60-1a7c 1a7f-1a89 1a90-1a99 1aa0-1aad 1ab0-1ace 1b00-1b4c",
    "1b50-1b7e 1b80-1bf3 1bfc-1c37 1c3b-1c49 1c4d-1c88 1c90-1cba 1cbd-1cc7 1cd0-1cfa 1d00-1f15 1f18-1f1d",
    "1f20-1f45 1f48-1f4d 1f50-1f57 1f59 1f5b 1f5d 1f5f-1f7d 1f80-1fb4 1fb6-1fc4 1fc6-1fd3 1fd6-1fdb",
    "1fdd-1fef 1ff2-1ff4 1ff6-1ffe 2010-2027 2030-205e 2070-2071 2074-208e 2090-209c 20a0-20c0 20d0-20f0",
    "2100-218b 2190-2426 2440-244a 2460-2b73 2b76-2b95 2b97-2cf3 2cf9-2d25 2d27 2d2d 2d30-2d67 2d6f-2d70",
    "2d7f-2d96 2da0-2da6 2da8-2dae 2db0-2db6 2db8-2dbe 2dc0-2dc6 2dc8-2dce 2dd0-2dd6 2dd8-2dde 2de0-2e5d",
    "2e80-2e99 2e9b-2ef3 2f00-2fd5 2ff0-2fff 3001-303f 3041-3096 3099-30ff 3105-312f 3131-318e 3190-31e3",
    "31ef-321e 3220-a48c a490-a4c6 a4d0-a62b a640-a6f7 a700-a7ca a7d0-a7d1 a7d3 a7d5-a7d9 a7f2-a82c",
    "a830-a839 a840-a877 a880-a8c5 a8ce-a8d9 a8e0-a953 a95f-a97c a980-a9cd a9cf-a9d9 a9de-a9fe aa00-aa36",
    "aa40-aa4d aa50-aa59 aa5c-aac2 aadb-aaf6 ab01-ab06 ab09-ab0e ab11-ab16 ab20-ab26 ab28-ab2e ab30-ab6b",
    "ab70-abed abf0-abf9 ac00-d7a3 d7b0-d7c6 d7cb-d7fb f900-fa6d fa70-fad9 fb00-fb06 fb13-fb17 fb1d-fb36",
    "fb38-fb3c fb3e fb40-fb41 fb43-fb44 fb46-fbc2 fbd3-fd8f fd92-fdc7 fdcf fdf0-fe19 fe20-fe52 fe54-fe66",
    "fe68-fe6b fe70-fe74 fe76-fefc ff01-ffbe ffc2-ffc7 ffca-ffcf ffd2-ffd7 ffda-ffdc ffe0-ffe6 ffe8-ffee",
    "fffc-fffd 10000-1000b 1000d-10026 10028-1003a 1003c-1003d 1003f-1004d 10050-1005d 10080-100fa",
    "10100-10102 10107-10133 10137-1018e 10190-1019c 101a0 101d0-101fd 10280-1029c 102a0-102d0",
    "102e0-102fb 10300-10323 1032d-1034a 10350-1037a 10380-1039d 1039f-103c3 103c8-103d5 10400-1049d",
    "104a0-104a9 104b0-104d3 104d8-104fb 10500-10527 10530-10563 1056f-1057a 1057c-1058a 1058c-10592",
    "10594-10595 10597-105a1 105a3-105b1 105b3-105b9 105bb-105bc 10600-10736 10740-10755 10760-10767",
    "10780-10785 10787-107b0 107b2-107ba 10800-10805 10808 1080a-10835 10837-10838 1083c 1083f-10855",
    "10857-1089e 108a7-108af 108e0-108f2 108f4-108f5 108fb-1091b 1091f-10939 1093f 10980-109b7",
    "109bc-109cf 109d2-10a03 10a05-10a06 10a0c-10a13 10a15-10a17 10a19-10a35 10a38-10a3a 10a3f-10a48",
    "10a50-10a58 10a60-10a9f 10ac0-10ae6 10aeb-10af6 10b00-10b35 10b39-10b55 10b58-10b72 10b78-10b91",
    "10b99-10b9c 10ba9-10baf 10c00-10c48 10c80-10cb2 10cc0-10cf2 10cfa-10d27 10d30-10d39 10e60-10e7e",
    "10e80-10ea9 10eab-10ead 10eb0-10eb1 10efd-10f27 10f30-10f59 10f70-10f89 10fb0-10fcb 10fe0-10ff6",
    "11000-1104d 11052-11075 1107f-110bc 110be-110c2 110d0-110e8 110f0-110f9 11100-11134 11136-11147",
    "11150-11176 11180-111df 111e1-111f4 11200-11211 11213-11241 11280-11286 11288 1128a-1128d",
    "1128f-1129d 1129f-112a9 112b0-112ea 112f0-112f9 11300-11303 11305-1130c 1130f-11310 11313-11328",
    "1132a-11330 11332-11333 11335-11339 1133b-11344 11347-11348 1134b-1134d 11350 11357 1135d-11363",
    "11366-1136c 11370-11374 11400-1145b 1145d-11461 11480-114c7 114d0-114d9 11580-115b5 115b8-115dd",
    "11600-11644 11650-11659 11660-1166c 11680-116b9 116c0-116c9 11700-1171a 1171d-1172b 11730-11746",
    "11800-1183b 118a0-118f2 118ff-11906 11909 1190c-11913 11915-11916 11918-11935 11937-11938",
    "1193b-11946 11950-11959 119a0-119a7 119aa-119d7 119da-119e4 11a00-11a47 11a50-11aa2 11ab0-11af8",
    "11b00-11b09 11c00-11c08 11c0a-11c36 11c38-11c45 11c50-11c6c 11c70-11c8f 11c92-11ca7 11ca9-11cb6",
    "11d00-11d06 11d08-11d09 11d0b-11d36 11d3a 11d3c-11d3d 11d3f-11d47 11d50-11d59 11d60-11d65",
    "11d67-11d68 11d6a-11d8e 11d90-11d91 11d93-11d98 11da0-11da9 11ee0-11ef8 11f00-11f10 11f12-11f3a",
    "11f3e-11f59 11fb0 11fc0-11ff1 11fff-12399 12400-1246e 12470-12474 12480-12543 12f90-12ff2",
    "13000-1342f 13440-13455 14400-14646 16800-16a38 16a40-16a5e 16a60-16a69 16a6e-16abe 16ac0-16ac9",
    "16ad0-16aed 16af0-16af5 16b00-16b45 16b50-16b59 16b5b-16b61 16b63-16b77 16b7d-16b8f 16e40-16e9a",
    "16f00-16f4a 16f4f-16f87 16f8f-16f9f 16fe0-16fe4 16ff0-16ff1 17000-187f7 18800-18cd5 18d00-18d08",
    "1aff0-1aff3 1aff5-1affb 1affd-1affe 1b000-1b122 1b132 1b150-1b152 1b155 1b164-1b167 1b170-1b2fb",
    "1bc00-1bc6a 1bc70-1bc7c 1bc80-1bc88 1bc90-1bc99 1bc9c-1bc9f 1cf00-1cf2d 1cf30-1cf46 1cf50-1cfc3",
    "1d000-1d0f5 1d100-1d126 1d129-1d172 1d17b-1d1ea 1d200-1d245 1d2c0-1d2d3 1d2e0-1d2f3 1d300-1d356",
    "1d360-1d378 1d400-1d454 1d456-1d49c 1d49e-1d49f 1d4a2 1d4a5-1d4a6 1d4a9-1d4ac 1d4ae-1d4b9 1d4bb",
    "1d4bd-1d4c3 1d4c5-1d505 1d507-1d50a 1d50d-1d514 1d516-1d51c 1d51e-1d539 1d53b-1d53e 1d540-1d544",
    "1d546 1d54a-1d550 1d552-1d6a5 1d6a8-1d7cb 1d7ce-1da8b 1da9b-1da9f 1daa1-1daaf 1df00-1df1e",
    "1df25-1df2a 1e000-1e006 1e008-1e018 1e01b-1e021 1e023-1e024 1e026-1e02a 1e030-1e06d 1e08f",
    "1e100-1e12c 1e130-1e13d 1e140-1e149 1e14e-1e14f 1e290-1e2ae 1e2c0-1e2f9 1e2ff 1e4d0-1e4f9",
    "1e7e0-1e7e6 1e7e8-1e7eb 1e7ed-1e7ee 1e7f0-1e7fe 1e800-1e8c4 1e8c7-1e8d6 1e900-1e94b 1e950-1e959",
    "1e95e-1e95f 1ec71-1ecb4 1ed01-1ed3d 1ee00-1ee03 1ee05-1ee1f 1ee21-1ee22 1ee24 1ee27 1ee29-1ee32",
    "1ee34-1ee37 1ee39 1ee3b 1ee42 1ee47 1ee49 1ee4b 1ee4d-1ee4f 1ee51-1ee52 1ee54 1ee57 1ee59 1ee5b",
    "1ee5d 1ee5f 1ee61-1ee62 1ee64 1ee67-1ee6a 1ee6c-1ee72 1ee74-1ee77 1ee79-1ee7c 1ee7e 1ee80-1ee89",
    "1ee8b-1ee9b 1eea1-1eea3 1eea5-1eea9 1eeab-1eebb 1eef0-1eef1 1f000-1f02b 1f030-1f093 1f0a0-1f0ae",
    "1f0b1-1f0bf 1f0c1-1f0cf 1f0d1-1f0f5 1f100-1f1ad 1f1e6-1f202 1f210-1f23b 1f240-1f248 1f250-1f251",
    "1f260-1f265 1f300-1f6d7 1f6dc-1f6ec 1f6f0-1f6fc 1f700-1f776 1f77b-1f7d9 1f7e0-1f7eb 1f7f0",
    "1f800-1f80b 1f810-1f847 1f850-1f859 1f860-1f887 1f890-1f8ad 1f8b0-1f8b1 1f900-1fa53 1fa60-1fa6d",
    "1fa70-1fa7c 1fa80-1fa88 1fa90-1fabd 1fabf-1fac5 1face-1fadb 1fae0-1fae8 1faf0-1faf8 1fb00-1fb92",
    "1fb94-1fbca 1fbf0-1fbf9 20000-2a6df 2a700-2b739 2b740-2b81d 2b820-2cea1 2ceb0-2ebe0 2ebf0-2ee5d",
    "2f800-2fa1d 30000-3134a 31350-323af e0100-e01ef"
  ].join(" ");

  var HEADER = "#iml/0.5/" + DIGEST_05.slice(0, 12);
  var PLAYGROUND_DOC = "the playground converts operation chains; documents with declarations need the reference" +
    " codec (github.com/ilang-ai/iml-protocol)";
  var PLAYGROUND_02 = "the 0.2 surface is read by the reference codec (--version 0.2)";

  var verbSet = new Map(), verbRoot = new Map(), rootVerb = new Map(), aliasMap = new Map();
  var keyCode = new Map(), codeKey = new Map(), entityMark = new Map(), markEntity = new Map();
  var verbsAndAliases = new Map();   // iml.doc_parse: frozenset(reg.verbs) | frozenset(reg.aliases)
  VERBS.split(" ").forEach(function (e) {
    var p = e.split(":");
    verbSet.set(p[0], true);
    verbsAndAliases.set(p[0], true);
    if (p[1]) { verbRoot.set(p[0], p[1]); rootVerb.set(p[1], p[0]); }
  });
  Object.keys(ALIASES).forEach(function (a) { aliasMap.set(a, ALIASES[a]); verbsAndAliases.set(a, true); });
  KEYS.split(" ").forEach(function (e) { var p = e.split(":"); keyCode.set(p[0], p[1]); codeKey.set(p[1], p[0]); });
  ENTITIES.split(" ").forEach(function (e) { var p = e.split(":"); entityMark.set(p[0], p[1]); markEntity.set(p[1], p[0]); });

  function resolveVerb(spelling) { // Registry.resolve_verb
    var name = aliasMap.has(spelling) ? aliasMap.get(spelling) : spelling;
    return verbSet.has(name) ? name : null;
  }
  function digestFor(version) { return version === "0.5" ? DIGEST_05 : DIGEST_CHAIN; }

  // ------------------------------------------------------------ Python behaviour
  // str.isspace() of one UTF-16 code unit (no astral character is whitespace)
  function isSpace(c) {
    return (c >= 9 && c <= 13) || (c >= 0x1c && c <= 0x20) || c === 0x85 || c === 0xa0 || c === 0x1680 ||
      (c >= 0x2000 && c <= 0x200a) || c === 0x2028 || c === 0x2029 || c === 0x202f || c === 0x205f || c === 0x3000;
  }
  // iml.codec.is_control: U+0000 to U+001F, U+007F, U+0085, U+2028, U+2029
  function isControl(c) { return c < 0x20 || c === 0x7f || c === 0x85 || c === 0x2028 || c === 0x2029; }
  function lstrip(s) { var i = 0; while (i < s.length && isSpace(s.charCodeAt(i))) i++; return s.slice(i); }
  function rstrip(s) { var j = s.length; while (j > 0 && isSpace(s.charCodeAt(j - 1))) j--; return s.slice(0, j); }
  function strip(s) { return rstrip(lstrip(s)); }
  function indentOf(line) { return line.length - lstrip(line).length; }

  var PR_LO = [], PR_HI = [];
  PY_PRINTABLE.split(" ").forEach(function (r) {
    var p = r.split("-");
    PR_LO.push(parseInt(p[0], 16));
    PR_HI.push(parseInt(p.length > 1 ? p[1] : p[0], 16));
  });
  function isPrintable(cp) { // str.isprintable() for cp >= 0x80
    var lo = 0, hi = PR_LO.length - 1, mid;
    while (lo <= hi) {
      mid = (lo + hi) >> 1;
      if (cp < PR_LO[mid]) hi = mid - 1;
      else if (cp > PR_HI[mid]) lo = mid + 1;
      else return true;
    }
    return false;
  }
  function hex(n, width) { var h = n.toString(16); while (h.length < width) h = "0" + h; return h; }
  function X04(n) { return hex(n, 4).toUpperCase(); }   // "%04X"

  // repr() of a Python str: the quote choice and the escapes of CPython's unicode_repr
  function repr(s) {
    var q = s.indexOf("'") >= 0 && s.indexOf('"') < 0 ? '"' : "'";
    var out = q, i, c, ch;
    for (i = 0; i < s.length; i++) {
      c = s.codePointAt(i);
      ch = String.fromCodePoint(c);
      if (c > 0xffff) i++;
      if (ch === q || ch === "\\") out += "\\" + ch;
      else if (c === 9) out += "\\t";
      else if (c === 10) out += "\\n";
      else if (c === 13) out += "\\r";
      else if (c < 0x20 || c === 0x7f) out += "\\x" + hex(c, 2);
      else if (c < 0x7f || isPrintable(c)) out += ch;
      else if (c <= 0xff) out += "\\x" + hex(c, 2);
      else if (c <= 0xffff) out += "\\u" + hex(c, 4);
      else out += "\\U" + hex(c, 8);
    }
    return out + q;
  }

  function isHigh(c) { return c >= 0xd800 && c <= 0xdbff; }
  function isLow(c) { return c >= 0xdc00 && c <= 0xdfff; }
  // Python's s[i:i + count] with count in code points, i a code unit index, not past end
  function take(s, i, count, end) {
    if (end === undefined || end > s.length) end = s.length;
    var j = i;
    while (count > 0 && j < end) {
      j += isHigh(s.charCodeAt(j)) && j + 1 < end && isLow(s.charCodeAt(j + 1)) ? 2 : 1;
      count--;
    }
    return s.slice(i, j);
  }
  // the code point at code unit index i, as a string (Python's text[i])
  function charAt(s, i) { return take(s, i, 1); }
  // number of code points in s[0:end] (a code unit end): the Python offset
  function cpOffset(s, end) {
    var n = 0, i;
    for (i = 0; i < end; i++) {
      if (isHigh(s.charCodeAt(i)) && i + 1 < end && isLow(s.charCodeAt(i + 1))) i++;
      n++;
    }
    return n;
  }
  // the index of the first lone surrogate, or -1 (a JS string that is not valid Unicode)
  function loneSurrogate(s) {
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (isHigh(c)) {
        if (i + 1 < s.length && isLow(s.charCodeAt(i + 1))) { i++; continue; }
        return i;
      }
      if (isLow(c)) return i;
    }
    return -1;
  }
  function utf8Length(s) { // s is well-formed
    var n = 0, i, c;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c < 0x80) n += 1;
      else if (c < 0x800) n += 2;
      else if (isHigh(c)) { n += 4; i++; }
      else n += 3;
    }
    return n;
  }

  // ------------------------------------------------------------------ errors
  var CODES = {
    E200: "Entity Not Found", E300: "Syntax Error", E302: "Invalid Modifier",
    E303: "Invalid Value", E304: "Unknown Verb", E502: "Unsupported Format"
  };
  // iml.errors.IMLError; offset is a code unit index here, turned into the Python code
  // point offset when the error leaves the module (publicError)
  function IMLError(code, message, offset, op) {
    this.code = code;
    this.message = message;
    this.offset = offset === undefined ? null : offset;
    this.op = op === undefined ? null : op;
  }
  function fail(code, message, offset, op) { throw new IMLError(code, message, offset, op); }

  function publicError(e, base, line) {
    if (!(e instanceof IMLError)) throw e;
    var offset = e.offset === null ? null : cpOffset(base, e.offset);
    var where = [];
    if (offset !== null) where.push("offset " + offset);
    if (e.op !== null) where.push("op " + e.op);
    return {
      code: e.code, name: CODES[e.code], message: e.message, line: line, offset: offset, op: e.op,
      text: e.code + " " + CODES[e.code] + ": " + e.message + (where.length ? " (" + where.join(", ") + ")" : "")
    };
  }

  // ------------------------------------------------------ text helpers (codec.py)
  var RE_NAME = /^[A-Z][A-Z0-9_]*$/;
  var RE_ROOT = /^[A-Z0-9]{2}$/;
  var RE_KEYCODE = /^[a-z]{2}$/;
  var BATCH_VERB = "BATC";

  function quote(content) { // SPEC.md 2.4 escapes
    return '"' + content.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
  }

  // codec.scan_quoted: text[i] is '"'; returns [content, index after the closing quote]
  function scanQuoted(text, i, what, end) {
    if (what === undefined) what = "quoted value";
    var n = end === undefined ? text.length : end, buf = "", j = i + 1, c, e;
    while (j < n) {
      c = text[j];
      if (c === "\\") {
        if (j + 1 >= n) break;
        e = text[j + 1];
        if (e === '"') buf += '"';
        else if (e === "\\") buf += "\\";
        else if (e === "n") buf += "\n";
        else fail("E300", "bad escape `\\" + charAt(text, j + 1) + "` in " + what, j);
        j += 2;
        continue;
      }
      if (c === '"') return [buf, j + 1];
      if (isControl(text.charCodeAt(j))) {
        fail("E300", "raw control character U+" + X04(text.charCodeAt(j)) + " inside " + what +
          (what === "quoted value" ? " (a newline is written \\n)" : ""), j);
      }
      buf += c;
      j += 1;
    }
    fail("E300", what === "quoted value" ? "unterminated " + what : "unterminated quote in " + what, i);
  }

  // codec.first_whitespace_outside_quotes: a quote opens a value only right after `=`
  function firstWhitespaceOutsideQuotes(text, start) {
    var quoted = false, escaped = false, k, c;
    for (k = start || 0; k < text.length; k++) {
      c = text[k];
      if (quoted) {
        if (escaped) escaped = false;
        else if (c === "\\") escaped = true;
        else if (c === '"') quoted = false;
        else if (isControl(text.charCodeAt(k))) {
          fail("E300", "raw control character U+" + X04(text.charCodeAt(k)) + " inside quoted value", k);
        }
        continue;
      }
      if (c === '"' && k > 0 && text[k - 1] === "=") { quoted = true; continue; }
      if (isSpace(text.charCodeAt(k))) return k;
    }
    return -1;
  }

  // ------------------------------------------------------------------ l2.py
  var OMEGA = "\u03a9";
  var CONTINUATION = "=>";
  var NOT_AN_ENTITY = "operation target `%s` is not an @ENTITY (v3.0 \u00a72.2; BATC/\u03a0 excepted)";

  function ilangBareable(content) {
    if (!content || content[0] === "@") return false;
    for (var k = 0; k < content.length; k++) {
      var c = content.charCodeAt(k);
      if (",|][ \"\\".indexOf(content[k]) >= 0 || isSpace(c) || isControl(c)) return false;
    }
    return true;
  }

  function printValue(val, opIndex) {
    if (val.kind === "entity") return "@" + val.text;
    if (val.kind === "code") fail("E303", "a value code ~" + val.text + " has no I-Lang spelling", null, opIndex);
    for (var k = 0; k < val.text.length; k++) {
      var c = val.text.charCodeAt(k);
      if (c !== 10 && isControl(c)) {
        fail("E300", "control character U+" + X04(c) + " in a value has no spelling (only a newline has an escape, \\n)",
          null, opIndex);
      }
    }
    return ilangBareable(val.text) ? val.text : quote(val.text);
  }

  // l2.ChainJoiner: an operation line and its continuation lines, with the quote state of
  // ends_with_closed_operation kept from piece to piece
  function ChainJoiner(first) {
    this.parts = [];
    this.length = 0;
    this.quoted = false;
    this.escaped = false;
    this.prev = "";
    if (first) this.add(first);
  }
  ChainJoiner.prototype.add = function (piece) {
    var quoted = this.quoted, escaped = this.escaped, prev = this.prev, k, c;
    for (k = 0; k < piece.length; k++) {
      c = piece[k];
      if (quoted) {
        if (escaped) escaped = false;
        else if (c === "\\") escaped = true;
        else if (c === '"') quoted = false;
      } else if (c === '"' && prev === "=") quoted = true;
      prev = c;
    }
    this.quoted = quoted;
    this.escaped = escaped;
    this.prev = prev;
    this.parts.push(piece);
    this.length += piece.length;
  };
  ChainJoiner.prototype.closed = function () { return !this.quoted && this.prev === "]"; };
  ChainJoiner.prototype.text = function () { return this.parts.join(""); };

  function printL2(ops) {
    var parts = [], idx, op, s, m;
    for (idx = 0; idx < ops.length; idx++) {
      op = ops[idx];
      s = op.verb === "OUT" ? OMEGA : op.verb;
      if (op.target !== null) s += ":@" + op.target;
      else if (op.verbref !== null) s += ":" + op.verbref;
      if (op.mods.length) {
        m = [];
        for (var k = 0; k < op.mods.length; k++) m.push(op.mods[k][0] + "=" + printValue(op.mods[k][1], idx));
        s += "|" + m.join(",");
      }
      parts.push("[" + s + "]");
    }
    return parts.join("=>");
  }

  function Op(verb, target, mods, verbref) {
    this.verb = verb;
    this.target = target;
    this.mods = mods;
    this.verbref = verbref;
  }

  function scanTo(text, j, stops) { // first index at or after j whose character is in stops
    var n = text.length;
    while (j < n && stops.indexOf(text[j]) < 0) j++;
    return j;
  }

  // l2.parse_L2: one canon I-Lang chain -> list of Op
  function parseL2(text) {
    if (!text) fail("E300", "empty input", 0);
    if (isSpace(text.charCodeAt(0))) fail("E300", "leading whitespace before the operation chain", 0);
    if (isSpace(text.charCodeAt(text.length - 1))) {
      fail("E300", "trailing whitespace after the operation chain", text.length - 1);
    }
    if (text.startsWith(CONTINUATION)) fail("E300", "orphan `=>` continuation: no preceding operation line", 0);
    if (text[0] !== "[") {
      fail("E502", "outside the supported subset: an operation chain starts with `[` (seen " + repr(take(text, 0, 12)) + ")", 0);
    }
    var n = text.length, k = firstWhitespaceOutsideQuotes(text), i, j, idx = 0, ops = [];
    if (k >= 0) {
      j = k;
      while (j < n && isSpace(text.charCodeAt(j))) j++;
      if (text[k - 1] === "]" && j < n && text[j] === "[") {
        fail("E502", "a second operation chain on the line: IML carries one chain per line", k);
      }
      fail("E300", "whitespace is not allowed outside a quoted value", k);
    }
    i = 0;
    for (;;) {
      if (text[i] !== "[") fail("E300", "expected `[` to open an operation", i, idx);
      i += 1;
      j = scanTo(text, i, ":|]");
      if (j >= n) fail("E300", "unterminated operation: `]` missing", i - 1, idx);
      var spelling = text.slice(i, j);
      if (!spelling) fail("E300", "missing verb", i, idx);
      var verb = resolveVerb(spelling);
      if (verb === null) fail("E304", "unknown verb " + repr(spelling), i, idx);
      i = j;
      var target = null, verbref = null;
      if (text[i] === ":") {
        i += 1;
        j = scanTo(text, i, "|]");
        if (j >= n) fail("E300", "unterminated operation: `]` missing", i, idx);
        var ttext = text.slice(i, j);
        if (!ttext) fail("E300", "empty target after `:`", i, idx);
        if (ttext[0] !== "@") {
          if (verb !== BATCH_VERB) fail("E300", NOT_AN_ENTITY.replace("%s", function () { return ttext; }), i, idx);
          var ref = resolveVerb(ttext);
          if (ref === null) fail("E304", "BATC verb reference `" + ttext + "` is not a registered verb or alias", i, idx);
          if (ref === "OUT") fail("E502", "OUT cannot be batched: not representable in IML", i, idx);
          verbref = ref;
        } else {
          var name = ttext.slice(1);
          if (!RE_NAME.test(name)) fail("E200", "entity name " + repr(ttext) + " does not match [A-Z][A-Z0-9_]*", i, idx);
          if (verb === "OUT") fail("E502", "OUT with a target is not representable in IML", i, idx);
          target = name;
        }
        i = j;
      }
      var mods = [];
      if (text[i] === "|") {
        i += 1;
        for (;;) {
          j = scanTo(text, i, "=,]|");
          if (j >= n) fail("E300", "unterminated operation: `]` missing", i, idx);
          if (text[j] !== "=") fail("E300", "modifier lacks `=`", i, idx);
          var key = text.slice(i, j);
          if (!key) fail("E300", "empty modifier key", i, idx);
          if (!keyCode.has(key)) fail("E302", "unknown modifier key " + repr(key), i, idx);
          i = j + 1;
          if (i >= n) fail("E300", "unterminated operation: `]` missing", i, idx);
          var c = text[i], val;
          if (c === '"') {
            var r = scanQuoted(text, i);
            val = { kind: "quoted", text: r[0] };
            i = r[1];
          } else if (c === "@") {
            j = scanTo(text, i + 1, ",]|");
            var ename = text.slice(i + 1, j);
            if (!RE_NAME.test(ename)) {
              fail("E200", "entity name " + repr(text.slice(i, j)) + " does not match [A-Z][A-Z0-9_]*", i, idx);
            }
            val = { kind: "entity", text: ename };
            i = j;
          } else {
            j = scanTo(text, i, ",]|");
            var raw = text.slice(i, j);
            if (!raw) fail("E300", "empty value for key " + key, i, idx);
            for (var q = 0; q < raw.length; q++) {
              var cc = raw.charCodeAt(q);
              if (isControl(cc)) fail("E300", "raw control character U+" + X04(cc) + " in bare value", i + q, idx);
              if (raw[q] === "[" || raw[q] === '"' || raw[q] === "\\") {
                fail("E303", "reserved character `" + raw[q] + "` in bare value", i + q, idx);
              }
            }
            val = { kind: "bare", text: raw };
            i = j;
          }
          if (i >= n) fail("E300", "unterminated operation: `]` missing", i, idx);
          mods.push([key, val]);
          if (text[i] === ",") { i += 1; continue; }
          if (text[i] === "]") break;
          if (text[i] === "|") fail("E300", "stray `|`: modifiers are separated by commas", i, idx);
          fail("E300", "stray character after value", i, idx);
        }
      }
      if (text[i] !== "]") fail("E300", "expected `]`", i, idx);
      i += 1;
      ops.push(new Op(verb, target, mods, verbref));
      if (i >= n) break;
      if (text.startsWith(CONTINUATION, i)) {
        if (verb === "OUT") fail("E502", "OUT may appear only as the last operation", i, idx);
        i += 2;
        idx += 1;
        if (i >= n) fail("E300", "missing operation after `=>`", i, idx);
        continue;
      }
      fail("E502", "outside the supported subset: text after the operation chain (seen " + repr(take(text, i, 12)) + ")", i, idx);
    }
    return ops;
  }

  // ----------------------------------------------------- compile (codec.py, 0.5)
  var PHI = "@", DOLLAR = "$", SEP = " ";

  function imlBareable(content) { // codec.iml_bareable on the 0.5 surface
    if (!content || "~@\"$".indexOf(content[0]) >= 0) return false;
    for (var k = 0; k < content.length; k++) {
      var c = content.charCodeAt(k);
      if (",\"\\ ".indexOf(content[k]) >= 0 || isSpace(c) || isControl(c)) return false;
    }
    return true;
  }

  function compileEntity(name, idx) {
    if (!RE_NAME.test(name)) fail("E200", "entity name " + repr(name) + " does not match [A-Z][A-Z0-9_]*", null, idx);
    return entityMark.has(name) ? PHI + entityMark.get(name) : PHI + "{" + name + "}";
  }

  function compileValue(val, key, idx) {
    if (val.kind === "entity") return compileEntity(val.text, idx);
    if (val.kind === "code") fail("E303", "value code ~" + val.text + " is not in the table of key " + key, null, idx);
    for (var k = 0; k < val.text.length; k++) {
      var c = val.text.charCodeAt(k);
      if (c !== 10 && isControl(c)) {
        fail("E300", "control character U+" + X04(c) + " in a value has no spelling (only a newline has an escape, \\n)",
          null, idx);
      }
    }
    return imlBareable(val.text) ? val.text : quote(val.text);
  }

  // codec._compile_chain on the 0.5 surface (the AST comes from parseL2)
  function compileChain(ops) {
    var last = ops.length - 1, parts = [], idx, op, s, kvs, k;
    if (!ops.length) fail("E300", "a chain carries at least one operation", null, 0);
    for (idx = 0; idx < ops.length; idx++) {
      op = ops[idx];
      if (op.verb === "OUT") {
        if (idx !== last) fail("E502", "OUT may appear only as the last operation", null, idx);
        if (op.target !== null) fail("E502", "OUT with a target is not representable in IML", null, idx);
        if (op.verbref !== null) fail("E502", "OUT with a verb reference is not representable in IML", null, idx);
        s = DOLLAR;
      } else {
        if (!verbRoot.has(op.verb)) fail("E304", "unknown verb " + repr(op.verb), null, idx);
        s = verbRoot.get(op.verb);
        if (op.target !== null) s += compileEntity(op.target, idx);
        else if (op.verbref !== null) {
          if (op.verb !== BATCH_VERB) {
            fail("E300", "verb reference " + repr(op.verbref) + " on " + op.verb +
              ": only BATC references a verb (SPEC.md 3.9)", null, idx);
          }
          if (op.verbref === "OUT") fail("E502", "OUT cannot be batched: not representable in IML", null, idx);
          if (!verbRoot.has(op.verbref)) {
            fail("E304", "BATC verb reference " + repr(op.verbref) + " is not a registered verb", null, idx);
          }
          s += ":" + verbRoot.get(op.verbref);
        }
      }
      if (op.mods.length) {
        kvs = [];
        for (k = 0; k < op.mods.length; k++) {
          var key = op.mods[k][0];
          if (!keyCode.has(key)) fail("E302", "unknown modifier key " + repr(key), null, idx);
          kvs.push(keyCode.get(key) + "=" + compileValue(op.mods[k][1], key, idx));
        }
        s += kvs.join(",");
      }
      parts.push(s);
    }
    return parts.join(SEP);
  }

  // --------------------------------------------------- decompile (codec.py, 0.5)
  var RE_HEADER = /^#iml\/([0-9]+\.[0-9]+)\/([0-9a-f]{12})( |$)/;
  var RE_DOCUMENT_FIRST_LINE = /^#iml\/[0-9]+\.[0-9]+\/[0-9a-f]{12}(?:\r\n|\n|$)/;
  var READS = ["0.5", "0.4", "0.3"];
  var QUOTE = '"';

  function isDocument(text) { return RE_DOCUMENT_FIRST_LINE.test(text); }

  // codec._check_version_and_digest for the default reader; m is RE_HEADER's match
  function checkVersionAndDigest(m) {
    var version = m[1];
    if (READS.indexOf(version) < 0) {
      if (version === "0.2") fail("E502", PLAYGROUND_02, 5);
      fail("E502", "unsupported IML version " + version + " (this decoder reads 0.5, 0.4, 0.3)", 5);
    }
    var want = digestFor(version).slice(0, 12);
    if (m[2] !== want) {
      fail("E502", "registry digest mismatch: message " + m[2] + ", registry " + want + " (the digest a " + version +
        " header carries)", 6 + version.length);
    }
  }

  // codec._scan_entity: text[i] is `@`; returns [entity name, index after it]
  function scanEntity(text, i, n, idx) {
    if (take(text, i + 1, 1, n) === "{") {
      var j = text.indexOf("}", i + 2);
      if (j < 0 || j >= n) fail("E300", "unterminated custom entity `@{`", i, idx);
      var name = text.slice(i + 2, j);
      if (!RE_NAME.test(name)) fail("E200", "entity name " + repr(name) + " does not match [A-Z][A-Z0-9_]*", i + 2, idx);
      if (entityMark.has(name)) {
        fail("E200", "registered entity " + name + " is written by its mark @" + entityMark.get(name) +
          ", not as a custom entity", i, idx);
      }
      return [name, j + 1];
    }
    var mark = take(text, i + 1, 2, n);
    if (!RE_ROOT.test(mark)) fail("E300", "stray character: an entity mark [A-Z0-9]{2} or `{NAME}` expected after `@`", i + 1, idx);
    if (!markEntity.has(mark)) fail("E200", "unknown entity mark " + repr(mark), i + 1, idx);
    return [markEntity.get(mark), i + 3];
  }

  // codec._scan_verbref: text[i] is `:` right after the root of verb
  function scanVerbref(text, i, n, verb, root, idx) {
    if (verb !== BATCH_VERB) {
      fail("E300", "`:` after a root other than BT (" + root + "): only BT (BATC) takes a verb reference", i, idx);
    }
    var ref = take(text, i + 1, 2, n);
    if (!RE_ROOT.test(ref)) fail("E300", "`BT:` must be followed by a verb root [A-Z0-9]{2} (seen " + repr(ref) + ")", i + 1, idx);
    if (!rootVerb.has(ref)) fail("E304", "BATC verb reference root " + repr(ref) + " is not in the registry", i + 1, idx);
    var j = i + 3;
    if (j < n && text[j] === PHI) {
      fail("E300", "a target after a verb reference: `BT:" + ref + "` takes no `@` target (the two exclude each other)", j, idx);
    }
    return [rootVerb.get(ref), j];
  }

  // codec._scan_chain on the 0.5 surface: one chain from text[i:n]
  function scanChain(text, i, n) {
    var ops = [], idx = 0, c, verb, target, verbref, r;
    for (;;) {
      if (i >= n) fail("E300", "missing operation after the space between operations", i, idx);
      c = text[i];
      target = null;
      verbref = null;
      if (c === DOLLAR) {
        verb = "OUT";
        i += 1;
        if (i < n && text[i] === PHI) fail("E300", "`$` (OUT) takes no target", i, idx);
        if (i < n && text[i] === ":") fail("E300", "`$` (OUT) takes no verb reference", i, idx);
      } else {
        var root = take(text, i, 2, n);
        if (!RE_ROOT.test(root)) fail("E300", "stray character: a verb root [A-Z0-9]{2} or `$` expected", i, idx);
        if (!rootVerb.has(root)) fail("E304", "unknown verb root " + repr(root), i, idx);
        verb = rootVerb.get(root);
        i += 2;
        if (i < n && text[i] === PHI) { r = scanEntity(text, i, n, idx); target = r[0]; i = r[1]; }
        else if (i < n && text[i] === ":") { r = scanVerbref(text, i, n, verb, root, idx); verbref = r[0]; i = r[1]; }
      }
      var mods = [];
      if (i < n && text[i] >= "a" && text[i] <= "z") {
        for (;;) {
          var code = take(text, i, 2, n);
          if (!RE_KEYCODE.test(code)) fail("E300", "stray character: a key code [a-z]{2} expected", i, idx);
          if (take(text, i + 2, 1, n) !== "=") fail("E300", "modifier lacks `=`", i + 2, idx);
          if (!codeKey.has(code)) fail("E302", "unknown key code " + repr(code), i, idx);
          var key = codeKey.get(code), val;
          i += 3;
          if (i >= n || text[i] === "," || text[i] === SEP) fail("E300", "empty value for key " + key, i, idx);
          c = text[i];
          if (c === QUOTE) {
            r = scanQuoted(text, i, "quoted value", n);
            val = { kind: "quoted", text: r[0] };
            i = r[1];
          } else if (c === PHI) {
            r = scanEntity(text, i, n, idx);
            val = { kind: "entity", text: r[0] };
            i = r[1];
          } else if (c === "~") {
            var j = i + 1;
            while (j < n && /[a-z0-9]/.test(text[j])) j++;
            var codeText = text.slice(i + 1, j);
            if (!codeText) fail("E300", "empty value code after `~`", i, idx);
            fail("E303", "value code ~" + codeText + " is not in the table of key " + key, i, idx);
          } else if (c === DOLLAR) {
            fail("E303", "a bare value may not start with `$` (reserved); such a value is written quoted", i, idx);
          } else {
            var jj = i;
            while (jj < n && text[jj] !== "," && text[jj] !== SEP) jj++;
            var raw = text.slice(i, jj);
            for (var k = 0; k < raw.length; k++) {
              var cc = raw.charCodeAt(k);
              if (isControl(cc)) fail("E300", "raw control character U+" + X04(cc) + " in bare value", i + k, idx);
              if (isSpace(cc)) fail("E300", "whitespace inside a bare value", i + k, idx);
              if (raw[k] === '"' || raw[k] === "\\") fail("E303", "reserved character `" + raw[k] + "` in bare value", i + k, idx);
            }
            val = { kind: "bare", text: raw };
            i = jj;
          }
          mods.push([key, val]);
          if (i >= n) break;
          if (text[i] === ",") {
            i += 1;
            if (i >= n || text[i] === "," || text[i] === SEP) fail("E300", "missing modifier after `,`", i, idx);
            continue;
          }
          if (text[i] === SEP) break;
          fail("E300", "stray character after value", i, idx);
        }
      }
      ops.push(new Op(verb, target, mods, verbref));
      if (i >= n) break;
      if (text[i] === SEP) {
        if (verb === "OUT") fail("E502", "`$` (OUT) may appear only as the last operation", i, idx);
        i += 1;
        idx += 1;
        continue;
      }
      fail("E300", "stray character " + repr(charAt(text, i)), i, idx);
    }
    return ops;
  }

  // codec.decompile with the default reader (0.5; 0.4 and 0.3 headers too). Returns the
  // chains: one for a message, one per line for a document of chains.
  function decompileText(text) {
    if (!text.startsWith("#iml/")) fail("E502", "no IML header (`" + HEADER + "` expected)", 0);
    var length = text.length, nl = text.indexOf("\n"), lineEnd = nl < 0 ? length : nl;
    if (nl >= 0 && lineEnd > 0 && text[lineEnd - 1] === "\r") lineEnd -= 1;
    var m = RE_HEADER.exec(text.slice(0, lineEnd));
    if (!m) {
      fail("E300", "bad header shape: `#iml/<digits>.<digits>/<12 lowercase hex>` followed by one space " +
        "(message) or the end of the line (document) expected", 5);
    }
    checkVersionAndDigest(m);
    if (m[3] === " ") {
      var i = m[0].length;
      if (nl >= 0 && nl + 1 < length) {
        fail("E300", "text after the message line: a message is one line; a document puts " +
          "the header alone on its first line", nl + 1);
      }
      if (i >= lineEnd) {
        if (nl >= 0) fail("E300", "trailing space after the header: a document header stands alone on its line", i - 1);
        fail("E300", "empty chain", i);
      }
      if (text[i] === QUOTE || text[i] === ":") {
        if (m[1] === "0.5") {
          fail("E502", "declarations and text lines exist only in the document form (the header alone" +
            " on its first line); a message carries one chain", i);
        }
        fail("E502", "declarations and text lines need a 0.5 header (this message's header is version " + m[1] + ")", i);
      }
      return [scanChain(text, i, lineEnd)];
    }
    if (nl < 0) {
      fail("E300", "header alone: a document carries at least one " + (m[1] === "0.5" ? "item" : "chain") +
        " line after the header", length);
    }
    return readDocument(text, nl, m[1]);
  }

  // doc_read.read_document for a document of chains: a 0.5 header reads the document
  // layer, which the playground leaves to the reference codec (a declaration or a text
  // line is E502 PLAYGROUND_DOC); a 0.4 or 0.3 header carries chains only
  function readDocument(text, nl, version) {
    var full = version === "0.5", items = [], length = text.length, start = nl + 1, nl2, end, segEnd, c;
    while (start < length) {
      nl2 = text.indexOf("\n", start);
      end = nl2 < 0 ? length : nl2;
      segEnd = nl2 >= 0 && end > start && text[end - 1] === "\r" ? end - 1 : end;
      if (segEnd === start) fail("E300", "blank line in a document", start);
      if (text.startsWith("#iml/", start)) {
        fail("E502", "a second header in a document (one header, then one item per line)", start);
      }
      c = text[start];
      if (!full) {
        if (c === QUOTE || c === ":") {
          fail("E502", "declarations and text lines need a 0.5 header (this document's header is version " +
            version + ")", start);
        }
        items.push(scanChain(text, start, segEnd));
      } else if (c === QUOTE || c === ":") {
        fail("E502", PLAYGROUND_DOC, start);
      } else if (c === " ") {
        fail("E300", "a line that starts with a space belongs to the declaration above it: there is none", start);
      } else if (c === DOLLAR || (c >= "A" && c <= "Z") || (c >= "0" && c <= "9")) {
        items.push(scanChain(text, start, segEnd));
      } else {
        fail("E300", "a document line may not start with " + repr(charAt(text, start)) + ": `#` the header, a verb" +
          " root or `$` a chain, a quote a text line, `:` a declaration, a space a line of the declaration above", start);
      }
      if (nl2 < 0) break;
      start = nl2 + 1;
    }
    if (!items.length) fail("E300", "a document carries at least one item line after the header", nl);
    return items;
  }

  // ------------------------------------ the compile side of a document (doc_parse.py)
  // The validator's line patterns (doc_lex.py); `\s` and `\S` of Python re are str.isspace.
  var PYWS = "\\t\\n\\v\\f\\r\\x1c-\\x20\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";
  var RE_DOC_MARKER = new RegExp("^::ILANG::[^" + PYWS + "]+$");
  var RE_TEMPORAL_BIND = new RegExp("^T\\[[^\\]]+\\]=[^" + PYWS + "]+");
  var RE_TEMPORAL_PREFIX = new RegExp("^(T\\[[^\\]]+\\])[" + PYWS + "]+(::[^\\n]*)$");
  var RE_TEMPORAL_NOTE = new RegExp("^(T\\[[^\\]]+\\](\\u2192T\\[[^\\]]+\\])?|PARALLEL\\{[^}]*\\})([" + PYWS + "][^\\n]*)?$");
  var RE_TAG_LINE = /^(\[[A-Z][A-Z0-9_\-]*(?::[^\[\]]*)?\])+$/;
  var RE_BRACKET_GROUPS = /\[([^\[\]]*)\]/;
  var STRUCTURAL_CHARS = ["::", "[", "{", "}", "|", "\u21d2", "=>"];
  var MSG_MARKER_POSITION = "::ILANG document marker may only open or close a document (\u00a71.7)";
  var MSG_ORPHAN = "orphan `=>` continuation: no preceding operation line";
  var MSG_UNTERMINATED = "continuation after an unterminated operation line: the text above a `=>` line " +
    "must end with `]` outside a quoted value";
  var MSG_BOM = "a byte order mark (U+FEFF) at the head of the input: the command line drops every leading one," +
    " the library does not";
  function msgControl(c, what) {
    return "raw control character U+" + X04(c) + " in " + what + " (IML quoted strings have no escape for it)";
  }

  function maskQuoted(s) { // doc_lex.mask_quoted
    var out = [], quoted = false, escaped = false, k, ch;
    for (k = 0; k < s.length; k++) {
      ch = s[k];
      if (quoted) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === '"') { quoted = false; out.push(ch); continue; }
        out.push("_");
        continue;
      }
      if (ch === '"' && k > 0 && "=:,".indexOf(s[k - 1]) >= 0) quoted = true;
      out.push(ch);
    }
    return quoted ? s : out.join("");
  }
  function headOf(s) {
    var m = RE_BRACKET_GROUPS.exec(maskQuoted(s));
    return m ? strip(m[1].split(/[:|]/)[0]) : "";
  }
  function isOperationLine(s) { return maskQuoted(s).indexOf("]=>") >= 0 || verbsAndAliases.has(headOf(s)); }

  // doc_parse.DocParser for a raw I-Lang document of chains: the lines are told apart as
  // the reference reads them; a chain (with its `=>` lines, at any indentation) is parsed,
  // any other kind of line (a declaration, a marker, a tag line, prose) is E502
  // PLAYGROUND_DOC, and the reference's own errors for chain inputs are kept. The preamble
  // rules (tag lines and one-operation chains after a ::ILANG:: marker) cannot arise: the
  // marker itself is not a chain.
  function parseDocumentChains(data) {
    if (data.charCodeAt(0) === 0xfeff) fail("E502", MSG_BOM, 0);
    var lines = [], starts = [], pos = 0, segs = data.split("\n"), si, k, c;
    for (si = 0; si < segs.length; si++) {
      var seg = segs[si], line = seg.endsWith("\r") ? seg.slice(0, -1) : seg;
      for (k = 0; k < line.length; k++) {
        c = line.charCodeAt(k);
        if (c !== 9 && isControl(c)) fail("E300", msgControl(c, "a document line"), pos + k);
      }
      lines.push(line);
      starts.push(pos);
      pos += seg.length + 1;
    }
    var n = lines.length, i, firstNb = -1, lastNb = -1;
    for (i = 0; i < n; i++) {
      if (strip(lines[i])) { if (firstNb < 0) firstNb = i; lastNb = i; }
    }
    function lineOff(j) { return starts[j] + indentOf(lines[j]); }
    function notAChain(s, off) { // a Text item of the reference (after its carried-text check)
      for (var q = 0; q < s.length; q++) {
        if (isControl(s.charCodeAt(q))) fail("E300", msgControl(s.charCodeAt(q), "a text line"), off + q);
      }
      fail("E502", PLAYGROUND_DOC, off);
    }
    function joinChain(j0, s) { // doc_body.join_chain at top level
      var joiner = new ChainJoiner(s), jsegs = [[0, lineOff(j0)]], j = j0 + 1, t;
      while (j < n) {
        t = strip(lines[j]);
        if (!t.startsWith("=>")) break;
        if (!joiner.closed()) fail("E300", MSG_UNTERMINATED, lineOff(j));
        jsegs.push([joiner.length, lineOff(j)]);
        joiner.add(t);
        j += 1;
      }
      try {
        return [parseL2(joiner.text()), j];
      } catch (e) {
        if (e instanceof IMLError && e.offset !== null) {
          var base = jsegs[0][0], src = jsegs[0][1];
          for (var q = 0; q < jsegs.length; q++) if (jsegs[q][0] <= e.offset) { base = jsegs[q][0]; src = jsegs[q][1]; }
          e.offset = src + (e.offset - base);
        }
        throw e;
      }
    }
    var chains = [], seenConstruct = false, s, off, r;
    i = 0;
    while (i < n) {
      s = strip(lines[i]);
      off = lineOff(i);
      if (!s || s === "---") { i += 1; continue; }
      if (RE_DOC_MARKER.test(s)) {
        if (i !== firstNb && i !== lastNb) fail("E300", MSG_MARKER_POSITION, off);
        notAChain(s, off);
      }
      if (RE_TEMPORAL_BIND.test(s)) notAChain(s, off);
      if (s.startsWith("::") || RE_TEMPORAL_PREFIX.test(s)) fail("E502", PLAYGROUND_DOC, off);
      if (s.startsWith("=>")) fail("E300", MSG_ORPHAN, off);
      if (s.startsWith("[")) {
        if (isOperationLine(s)) {
          seenConstruct = true;
          r = joinChain(i, s);
          chains.push(r[0]);
          i = r[1];
          continue;
        }
        if (RE_TAG_LINE.test(maskQuoted(s))) notAChain(s, off);
        fail("E300", "bracket line is neither tag nor operation: " + take(s, 0, 60), off);
      }
      if (RE_TEMPORAL_NOTE.test(s) || s.startsWith("\u2192") || s.startsWith("<<<") ||
          (!seenConstruct && !STRUCTURAL_CHARS.some(function (x) { return s.indexOf(x) >= 0; }))) {
        notAChain(s, off);
      }
      fail("E300", "line matches no I-Lang production: " + take(s, 0, 60), off);
    }
    return chains;
  }

  // ---------------------------------------------------- the command line (__main__)
  function stripMarks(text) { // read_text: every leading byte order mark is dropped
    var i = 0;
    while (text.charCodeAt(i) === 0xfeff) i++;
    return text.slice(i);
  }
  function lineOf(data, offset) { // __main__.line_of
    if (offset === null) return 1;
    var count = 1, k = data.indexOf("\n");
    while (k >= 0 && k < offset) { count++; k = data.indexOf("\n", k + 1); }
    return count;
  }
  function inputError(text) { // text that the command line could not read as UTF-8
    var bad = loneSurrogate(text);
    if (bad < 0) return null;
    return publicError(new IMLError("E300", "input is not valid UTF-8 (byte offset " + utf8Length(text.slice(0, bad)) + ")"),
      text, 1);
  }

  // python -m iml compile [--document]
  function compileILang(text, opts) {
    text = String(text);
    var bad = inputError(text);
    if (bad) return { ok: false, error: bad };
    var data = stripMarks(text), e;
    if (opts && opts.document) {
      try {
        var chains = parseDocumentChains(data);
        if (!chains.length) fail("E300", "no I-Lang item to compile: a document carries at least one item", 0);
        return { ok: true, iml: HEADER + "\n" + chains.map(compileChain).join("\n") };
      } catch (err) {
        e = err;
        return { ok: false, error: publicError(e, data, lineOf(data, e.offset)) };
      }
    }
    // __main__.join_chain_lines: a chain is a line and the `=>` lines below it
    var entries = [], cur = null, lines = data.split("\n"), no, line, stripped;
    for (no = 1; no <= lines.length; no++) {
      line = lines[no - 1];
      if (line.endsWith("\r")) line = line.slice(0, -1);
      stripped = lstrip(line);
      if (!stripped) { cur = null; continue; }
      if (stripped.startsWith(CONTINUATION)) {
        if (cur === null) { entries.push({ no: no, text: stripped }); continue; }
        if (cur.error) continue;
        if (cur.joiner.closed()) cur.joiner.add(stripped);
        else {
          cur.text = cur.joiner.text();
          cur.error = new IMLError("E300", MSG_UNTERMINATED, cur.joiner.length);
        }
        continue;
      }
      cur = { no: no, joiner: new ChainJoiner(line), error: null };
      entries.push(cur);
    }
    var out = [], q, en, t, ls;
    for (q = 0; q < entries.length; q++) {
      en = entries[q];
      t = en.error ? en.text : en.joiner ? en.joiner.text() : en.text;
      try {
        if (en.error) throw en.error;
        ls = lstrip(t);
        if (!(ls.startsWith("[") || ls.startsWith(CONTINUATION) || ls.charCodeAt(0) === 0xfeff)) {
          fail("E502", PLAYGROUND_DOC, 0);
        }
        out.push(HEADER + " " + compileChain(parseL2(t)));
      } catch (err) {
        return { ok: false, error: publicError(err, t, en.no) };
      }
    }
    return { ok: true, iml: out.join("\n") };
  }

  // python -m iml decompile
  function decompileIML(text) {
    text = String(text);
    var bad = inputError(text);
    if (bad) return { ok: false, error: bad };
    var data = stripMarks(text), out = [], lines, no, line;
    if (isDocument(data)) {
      try {
        return { ok: true, ilang: decompileText(data).map(printL2).join("\n") };
      } catch (err) {
        return { ok: false, error: publicError(err, data, lineOf(data, err instanceof IMLError ? err.offset : null)) };
      }
    }
    lines = data.split("\n");
    for (no = 1; no <= lines.length; no++) {
      line = lines[no - 1];
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line) continue;
      try {
        out.push(printL2(decompileText(line)[0]));
      } catch (err) {
        return { ok: false, error: publicError(err, line, no) };
      }
    }
    return { ok: true, ilang: out.join("\n") };
  }

  return {
    VERSION: "0.5.1",
    COMMIT: "6d696d0",
    HEADER: HEADER,
    DIGEST: DIGEST_05,
    CHAIN_DIGEST: DIGEST_CHAIN,
    PLAYGROUND_DOC: PLAYGROUND_DOC,
    PLAYGROUND_02: PLAYGROUND_02,
    compileILang: compileILang,
    decompileIML: decompileIML
  };
});
