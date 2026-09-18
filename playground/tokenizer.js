/*
 * tokenizer.js: cl100k_base token counting in the browser, global CL100K.
 *
 * A port of tiktoken 0.14 `Encoding.encode_ordinary` for cl100k_base
 * (github.com/openai/tiktoken, src/lib.rs `encode_ordinary`, `byte_pair_encode`,
 * `_byte_pair_merge`). Special-token strings such as <|endoftext|> are ordinary text.
 * The ranks come from cl100k_base.tiktoken.txt next to this file (tiktoken's rank
 * file, sha256 223921b76ee99bde995b7ff738513eef100fb51d18c93597a113bcffe865b2a7).
 *
 * The pre-tokenizer pattern is tiktoken's
 *   '(?i:[sdmt]|ll|ve|re)|[^\r\n\p{L}\p{N}]?+\p{L}++|\p{N}{1,3}+|
 *    ?[^\s\p{L}\p{N}]++[\r\n]*+|\s++$|\s*[\r\n]|\s+(?!\S)|\s
 * translated for JavaScript (see PATTERN below). Its \p{L} and \p{N} classes are
 * spelled out as tiktoken's own tables (Unicode 16.0, measured from tiktoken code
 * point by code point), because JavaScript engines ship other Unicode versions
 * (Node 24 has 17.0) and would split some text differently.
 * No dependencies, no network except CL100K.load(url) fetching the rank file.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CL100K = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Rust regex `\s` is Unicode White_Space. JavaScript `\s` differs (it adds U+FEFF
  // and lacks U+0085), so the set is spelled out.
  var WS = "\\t\\n\\v\\f\\r \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";

  // \p{L} and \p{N} as tiktoken 0.14 compiles them (Rust regex tables, Unicode 16.0),
  // measured code point by code point; hex ranges lo-hi separated by spaces.
  var LETTERS = [
    "41-5a 61-7a aa b5 ba c0-d6 d8-f6 f8-2c1 2c6-2d1 2e0-2e4 2ec 2ee 370-374 376-377 37a-37d 37f 386",
    "388-38a 38c 38e-3a1 3a3-3f5 3f7-481 48a-52f 531-556 559 560-588 5d0-5ea 5ef-5f2 620-64a 66e-66f",
    "671-6d3 6d5 6e5-6e6 6ee-6ef 6fa-6fc 6ff 710 712-72f 74d-7a5 7b1 7ca-7ea 7f4-7f5 7fa 800-815 81a",
    "824 828 840-858 860-86a 870-887 889-88e 8a0-8c9 904-939 93d 950 958-961 971-980 985-98c 98f-990",
    "993-9a8 9aa-9b0 9b2 9b6-9b9 9bd 9ce 9dc-9dd 9df-9e1 9f0-9f1 9fc a05-a0a a0f-a10 a13-a28 a2a-a30",
    "a32-a33 a35-a36 a38-a39 a59-a5c a5e a72-a74 a85-a8d a8f-a91 a93-aa8 aaa-ab0 ab2-ab3 ab5-ab9 abd",
    "ad0 ae0-ae1 af9 b05-b0c b0f-b10 b13-b28 b2a-b30 b32-b33 b35-b39 b3d b5c-b5d b5f-b61 b71 b83",
    "b85-b8a b8e-b90 b92-b95 b99-b9a b9c b9e-b9f ba3-ba4 ba8-baa bae-bb9 bd0 c05-c0c c0e-c10 c12-c28",
    "c2a-c39 c3d c58-c5a c5d c60-c61 c80 c85-c8c c8e-c90 c92-ca8 caa-cb3 cb5-cb9 cbd cdd-cde ce0-ce1",
    "cf1-cf2 d04-d0c d0e-d10 d12-d3a d3d d4e d54-d56 d5f-d61 d7a-d7f d85-d96 d9a-db1 db3-dbb dbd",
    "dc0-dc6 e01-e30 e32-e33 e40-e46 e81-e82 e84 e86-e8a e8c-ea3 ea5 ea7-eb0 eb2-eb3 ebd ec0-ec4 ec6",
    "edc-edf f00 f40-f47 f49-f6c f88-f8c 1000-102a 103f 1050-1055 105a-105d 1061 1065-1066 106e-1070",
    "1075-1081 108e 10a0-10c5 10c7 10cd 10d0-10fa 10fc-1248 124a-124d 1250-1256 1258 125a-125d",
    "1260-1288 128a-128d 1290-12b0 12b2-12b5 12b8-12be 12c0 12c2-12c5 12c8-12d6 12d8-1310 1312-1315",
    "1318-135a 1380-138f 13a0-13f5 13f8-13fd 1401-166c 166f-167f 1681-169a 16a0-16ea 16f1-16f8",
    "1700-1711 171f-1731 1740-1751 1760-176c 176e-1770 1780-17b3 17d7 17dc 1820-1878 1880-1884",
    "1887-18a8 18aa 18b0-18f5 1900-191e 1950-196d 1970-1974 1980-19ab 19b0-19c9 1a00-1a16 1a20-1a54",
    "1aa7 1b05-1b33 1b45-1b4c 1b83-1ba0 1bae-1baf 1bba-1be5 1c00-1c23 1c4d-1c4f 1c5a-1c7d 1c80-1c8a",
    "1c90-1cba 1cbd-1cbf 1ce9-1cec 1cee-1cf3 1cf5-1cf6 1cfa 1d00-1dbf 1e00-1f15 1f18-1f1d 1f20-1f45",
    "1f48-1f4d 1f50-1f57 1f59 1f5b 1f5d 1f5f-1f7d 1f80-1fb4 1fb6-1fbc 1fbe 1fc2-1fc4 1fc6-1fcc",
    "1fd0-1fd3 1fd6-1fdb 1fe0-1fec 1ff2-1ff4 1ff6-1ffc 2071 207f 2090-209c 2102 2107 210a-2113 2115",
    "2119-211d 2124 2126 2128 212a-212d 212f-2139 213c-213f 2145-2149 214e 2183-2184 2c00-2ce4",
    "2ceb-2cee 2cf2-2cf3 2d00-2d25 2d27 2d2d 2d30-2d67 2d6f 2d80-2d96 2da0-2da6 2da8-2dae 2db0-2db6",
    "2db8-2dbe 2dc0-2dc6 2dc8-2dce 2dd0-2dd6 2dd8-2dde 2e2f 3005-3006 3031-3035 303b-303c 3041-3096",
    "309d-309f 30a1-30fa 30fc-30ff 3105-312f 3131-318e 31a0-31bf 31f0-31ff 3400-4dbf 4e00-a48c",
    "a4d0-a4fd a500-a60c a610-a61f a62a-a62b a640-a66e a67f-a69d a6a0-a6e5 a717-a71f a722-a788",
    "a78b-a7cd a7d0-a7d1 a7d3 a7d5-a7dc a7f2-a801 a803-a805 a807-a80a a80c-a822 a840-a873 a882-a8b3",
    "a8f2-a8f7 a8fb a8fd-a8fe a90a-a925 a930-a946 a960-a97c a984-a9b2 a9cf a9e0-a9e4 a9e6-a9ef",
    "a9fa-a9fe aa00-aa28 aa40-aa42 aa44-aa4b aa60-aa76 aa7a aa7e-aaaf aab1 aab5-aab6 aab9-aabd aac0",
    "aac2 aadb-aadd aae0-aaea aaf2-aaf4 ab01-ab06 ab09-ab0e ab11-ab16 ab20-ab26 ab28-ab2e ab30-ab5a",
    "ab5c-ab69 ab70-abe2 ac00-d7a3 d7b0-d7c6 d7cb-d7fb f900-fa6d fa70-fad9 fb00-fb06 fb13-fb17 fb1d",
    "fb1f-fb28 fb2a-fb36 fb38-fb3c fb3e fb40-fb41 fb43-fb44 fb46-fbb1 fbd3-fd3d fd50-fd8f fd92-fdc7",
    "fdf0-fdfb fe70-fe74 fe76-fefc ff21-ff3a ff41-ff5a ff66-ffbe ffc2-ffc7 ffca-ffcf ffd2-ffd7",
    "ffda-ffdc 10000-1000b 1000d-10026 10028-1003a 1003c-1003d 1003f-1004d 10050-1005d 10080-100fa",
    "10280-1029c 102a0-102d0 10300-1031f 1032d-10340 10342-10349 10350-10375 10380-1039d 103a0-103c3",
    "103c8-103cf 10400-1049d 104b0-104d3 104d8-104fb 10500-10527 10530-10563 10570-1057a 1057c-1058a",
    "1058c-10592 10594-10595 10597-105a1 105a3-105b1 105b3-105b9 105bb-105bc 105c0-105f3 10600-10736",
    "10740-10755 10760-10767 10780-10785 10787-107b0 107b2-107ba 10800-10805 10808 1080a-10835",
    "10837-10838 1083c 1083f-10855 10860-10876 10880-1089e 108e0-108f2 108f4-108f5 10900-10915",
    "10920-10939 10980-109b7 109be-109bf 10a00 10a10-10a13 10a15-10a17 10a19-10a35 10a60-10a7c",
    "10a80-10a9c 10ac0-10ac7 10ac9-10ae4 10b00-10b35 10b40-10b55 10b60-10b72 10b80-10b91 10c00-10c48",
    "10c80-10cb2 10cc0-10cf2 10d00-10d23 10d4a-10d65 10d6f-10d85 10e80-10ea9 10eb0-10eb1 10ec2-10ec4",
    "10f00-10f1c 10f27 10f30-10f45 10f70-10f81 10fb0-10fc4 10fe0-10ff6 11003-11037 11071-11072 11075",
    "11083-110af 110d0-110e8 11103-11126 11144 11147 11150-11172 11176 11183-111b2 111c1-111c4 111da",
    "111dc 11200-11211 11213-1122b 1123f-11240 11280-11286 11288 1128a-1128d 1128f-1129d 1129f-112a8",
    "112b0-112de 11305-1130c 1130f-11310 11313-11328 1132a-11330 11332-11333 11335-11339 1133d 11350",
    "1135d-11361 11380-11389 1138b 1138e 11390-113b5 113b7 113d1 113d3 11400-11434 11447-1144a",
    "1145f-11461 11480-114af 114c4-114c5 114c7 11580-115ae 115d8-115db 11600-1162f 11644 11680-116aa",
    "116b8 11700-1171a 11740-11746 11800-1182b 118a0-118df 118ff-11906 11909 1190c-11913 11915-11916",
    "11918-1192f 1193f 11941 119a0-119a7 119aa-119d0 119e1 119e3 11a00 11a0b-11a32 11a3a 11a50",
    "11a5c-11a89 11a9d 11ab0-11af8 11bc0-11be0 11c00-11c08 11c0a-11c2e 11c40 11c72-11c8f 11d00-11d06",
    "11d08-11d09 11d0b-11d30 11d46 11d60-11d65 11d67-11d68 11d6a-11d89 11d98 11ee0-11ef2 11f02",
    "11f04-11f10 11f12-11f33 11fb0 12000-12399 12480-12543 12f90-12ff0 13000-1342f 13441-13446",
    "13460-143fa 14400-14646 16100-1611d 16800-16a38 16a40-16a5e 16a70-16abe 16ad0-16aed 16b00-16b2f",
    "16b40-16b43 16b63-16b77 16b7d-16b8f 16d40-16d6c 16e40-16e7f 16f00-16f4a 16f50 16f93-16f9f",
    "16fe0-16fe1 16fe3 17000-187f7 18800-18cd5 18cff-18d08 1aff0-1aff3 1aff5-1affb 1affd-1affe",
    "1b000-1b122 1b132 1b150-1b152 1b155 1b164-1b167 1b170-1b2fb 1bc00-1bc6a 1bc70-1bc7c 1bc80-1bc88",
    "1bc90-1bc99 1d400-1d454 1d456-1d49c 1d49e-1d49f 1d4a2 1d4a5-1d4a6 1d4a9-1d4ac 1d4ae-1d4b9 1d4bb",
    "1d4bd-1d4c3 1d4c5-1d505 1d507-1d50a 1d50d-1d514 1d516-1d51c 1d51e-1d539 1d53b-1d53e 1d540-1d544",
    "1d546 1d54a-1d550 1d552-1d6a5 1d6a8-1d6c0 1d6c2-1d6da 1d6dc-1d6fa 1d6fc-1d714 1d716-1d734",
    "1d736-1d74e 1d750-1d76e 1d770-1d788 1d78a-1d7a8 1d7aa-1d7c2 1d7c4-1d7cb 1df00-1df1e 1df25-1df2a",
    "1e030-1e06d 1e100-1e12c 1e137-1e13d 1e14e 1e290-1e2ad 1e2c0-1e2eb 1e4d0-1e4eb 1e5d0-1e5ed 1e5f0",
    "1e7e0-1e7e6 1e7e8-1e7eb 1e7ed-1e7ee 1e7f0-1e7fe 1e800-1e8c4 1e900-1e943 1e94b 1ee00-1ee03",
    "1ee05-1ee1f 1ee21-1ee22 1ee24 1ee27 1ee29-1ee32 1ee34-1ee37 1ee39 1ee3b 1ee42 1ee47 1ee49 1ee4b",
    "1ee4d-1ee4f 1ee51-1ee52 1ee54 1ee57 1ee59 1ee5b 1ee5d 1ee5f 1ee61-1ee62 1ee64 1ee67-1ee6a",
    "1ee6c-1ee72 1ee74-1ee77 1ee79-1ee7c 1ee7e 1ee80-1ee89 1ee8b-1ee9b 1eea1-1eea3 1eea5-1eea9",
    "1eeab-1eebb 20000-2a6df 2a700-2b739 2b740-2b81d 2b820-2cea1 2ceb0-2ebe0 2ebf0-2ee5d 2f800-2fa1d",
    "30000-3134a 31350-323af"
  ].join(" ");
  var NUMBERS = [
    "30-39 b2-b3 b9 bc-be 660-669 6f0-6f9 7c0-7c9 966-96f 9e6-9ef 9f4-9f9 a66-a6f ae6-aef b66-b6f",
    "b72-b77 be6-bf2 c66-c6f c78-c7e ce6-cef d58-d5e d66-d78 de6-def e50-e59 ed0-ed9 f20-f33",
    "1040-1049 1090-1099 1369-137c 16ee-16f0 17e0-17e9 17f0-17f9 1810-1819 1946-194f 19d0-19da",
    "1a80-1a89 1a90-1a99 1b50-1b59 1bb0-1bb9 1c40-1c49 1c50-1c59 2070 2074-2079 2080-2089 2150-2182",
    "2185-2189 2460-249b 24ea-24ff 2776-2793 2cfd 3007 3021-3029 3038-303a 3192-3195 3220-3229",
    "3248-324f 3251-325f 3280-3289 32b1-32bf a620-a629 a6e6-a6ef a830-a835 a8d0-a8d9 a900-a909",
    "a9d0-a9d9 a9f0-a9f9 aa50-aa59 abf0-abf9 ff10-ff19 10107-10133 10140-10178 1018a-1018b",
    "102e1-102fb 10320-10323 10341 1034a 103d1-103d5 104a0-104a9 10858-1085f 10879-1087f 108a7-108af",
    "108fb-108ff 10916-1091b 109bc-109bd 109c0-109cf 109d2-109ff 10a40-10a48 10a7d-10a7e 10a9d-10a9f",
    "10aeb-10aef 10b58-10b5f 10b78-10b7f 10ba9-10baf 10cfa-10cff 10d30-10d39 10d40-10d49 10e60-10e7e",
    "10f1d-10f26 10f51-10f54 10fc5-10fcb 11052-1106f 110f0-110f9 11136-1113f 111d0-111d9 111e1-111f4",
    "112f0-112f9 11450-11459 114d0-114d9 11650-11659 116c0-116c9 116d0-116e3 11730-1173b 118e0-118f2",
    "11950-11959 11bf0-11bf9 11c50-11c6c 11d50-11d59 11da0-11da9 11f50-11f59 11fc0-11fd4 12400-1246e",
    "16130-16139 16a60-16a69 16ac0-16ac9 16b50-16b59 16b5b-16b61 16d70-16d79 16e80-16e96 1ccf0-1ccf9",
    "1d2c0-1d2d3 1d2e0-1d2f3 1d360-1d378 1d7ce-1d7ff 1e140-1e149 1e2f0-1e2f9 1e4f0-1e4f9 1e5f1-1e5fa",
    "1e8c7-1e8cf 1e950-1e959 1ec71-1ecab 1ecad-1ecaf 1ecb1-1ecb4 1ed01-1ed2d 1ed2f-1ed3d 1f100-1f10c",
    "1fbf0-1fbf9"
  ].join(" ");

  function classBody(spec) { // "41-5a b5" -> the regex class body for those code points (u flag)
    var parts = spec.split(" "), out = "", i, d;
    for (i = 0; i < parts.length; i++) {
      d = parts[i].split("-");
      out += "\\u{" + d[0] + "}" + (d.length > 1 ? "-\\u{" + d[1] + "}" : "");
    }
    return out;
  }
  var L = classBody(LETTERS), N = classBody(NUMBERS);

  // Possessive quantifiers become greedy ones: in every place the pattern uses them
  // the greedy form cannot backtrack into a different match (the item is last in
  // its branch, or the following item's class is disjoint from it, or `$` cannot
  // match earlier). `(?i:...)` is spelled out with Unicode simple case folding,
  // which also folds U+017F LATIN SMALL LETTER LONG S to s.
  var PATTERN =
    "'(?:[sdmtSDMT\\u017f]|[lL][lL]|[vV][eE]|[rR][eE])" +
    "|[^\\r\\n" + L + N + "]?[" + L + "]+" +
    "|[" + N + "]{1,3}" +
    "| ?[^" + WS + L + N + "]+[\\r\\n]*" +
    "|[" + WS + "]+$" +
    "|[" + WS + "]*[\\r\\n]" +
    "|[" + WS + "]+(?![^" + WS + "])" +
    "|[" + WS + "]";

  var RE = new RegExp(PATTERN, "gu");
  var LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:^|[^\uD800-\uDBFF])([\uDC00-\uDFFF])/;
  var RANK_COUNT = 100256;
  var MAX = 0x7fffffff;

  var ranks = null;      // Map: UTF-8 bytes as a binary string -> rank
  var loading = null;    // shared Promise of CL100K.load

  var B64 = (function () {
    var t = new Int16Array(128), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i;
    for (i = 0; i < 128; i++) t[i] = -1;
    for (i = 0; i < 64; i++) t[s.charCodeAt(i)] = i;
    return t;
  })();

  function b64ToBinary(s) {
    var out = "", acc = 0, bits = 0, i, v;
    for (i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c === 61) break; // '='
      v = c < 128 ? B64[c] : -1;
      if (v < 0) throw new Error("cl100k: bad base64 in rank file");
      acc = (acc << 6) | v;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        out += String.fromCharCode((acc >> bits) & 255);
      }
    }
    return out;
  }

  function loadFromText(text) {
    var map = new Map(), lines = text.split("\n"), i, line, sp;
    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      if (line.charCodeAt(line.length - 1) === 13) line = line.slice(0, -1);
      if (!line) continue;
      sp = line.indexOf(" ");
      if (sp < 0) throw new Error("cl100k: bad line " + (i + 1) + " in rank file");
      map.set(b64ToBinary(line.slice(0, sp)), parseInt(line.slice(sp + 1), 10));
    }
    if (map.size !== RANK_COUNT) throw new Error("cl100k: expected " + RANK_COUNT + " ranks, got " + map.size);
    ranks = map;
    api.ready = true;
    return api;
  }

  function load(url) {
    if (ranks) return Promise.resolve(api);
    if (!loading) {
      loading = Promise.resolve(url || "cl100k_base.tiktoken.txt")
        .then(function (u) { return fetch(u); })
        .then(function (r) {
          if (!r.ok) throw new Error("cl100k: HTTP " + r.status + " for the rank file");
          return r.text();
        })
        .then(loadFromText)
        .catch(function (e) { loading = null; throw e; });
    }
    return loading;
  }

  // Python replaces each lone surrogate with U+FFFD before the Rust core sees the text.
  function wellFormed(text) {
    if (!LONE_SURROGATE.test(text)) return text;
    var out = "", i, c, d;
    for (i = 0; i < text.length; i++) {
      c = text.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        d = i + 1 < text.length ? text.charCodeAt(i + 1) : 0;
        if (d >= 0xdc00 && d <= 0xdfff) { out += text[i] + text[i + 1]; i++; }
        else out += "\ufffd";
      } else if (c >= 0xdc00 && c <= 0xdfff) out += "\ufffd";
      else out += text[i];
    }
    return out;
  }

  // UTF-8 bytes of a well-formed string, as a binary string (one char per byte).
  function utf8(s) {
    var out = "", i, c, d;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c < 0x80) out += s[i];
      else if (c < 0x800) out += String.fromCharCode(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c >= 0xd800 && c <= 0xdbff) {
        d = s.charCodeAt(++i);
        c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00);
        out += String.fromCharCode(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      } else out += String.fromCharCode(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }

  function rankOf(bytes) {
    var r = ranks.get(bytes);
    return r === undefined ? MAX : r;
  }

  // tiktoken `_byte_pair_merge`: parts[i] = [start, rank of the pair starting there];
  // repeatedly merge the adjacent pair with the lowest rank (the leftmost on ties).
  function mergeSimple(piece) {
    var starts = [], pr = [], n = piece.length, i, j, r, minRank = MAX, minI = -1;
    for (i = 0; i < n - 1; i++) {
      r = rankOf(piece.substr(i, 2));
      if (r < minRank) { minRank = r; minI = i; }
      starts.push(i);
      pr.push(r);
    }
    starts.push(n - 1, n);
    pr.push(MAX, MAX);
    function pairRank(k) { // parts k and k+1 once k+1 and k+2 are merged (k+1 not yet removed)
      return k + 3 < starts.length ? rankOf(piece.slice(starts[k], starts[k + 3])) : MAX;
    }
    while (minRank !== MAX) {
      i = minI;
      if (i > 0) pr[i - 1] = pairRank(i - 1);
      pr[i] = pairRank(i);
      starts.splice(i + 1, 1);
      pr.splice(i + 1, 1);
      minRank = MAX;
      minI = -1;
      for (j = 0; j < starts.length - 1; j++) {
        if (pr[j] < minRank) { minRank = pr[j]; minI = j; }
      }
    }
    var out = [];
    for (i = 0; i + 1 < starts.length; i++) out.push(ranks.get(piece.slice(starts[i], starts[i + 1])));
    return out;
  }

  // The same merge order for long pieces, with a binary heap keyed by (rank, start):
  // the smallest start among the lowest-rank pairs is the leftmost pair, as above.
  function mergeHeap(piece) {
    var n = piece.length, next = new Int32Array(n + 1), prev = new Int32Array(n + 1);
    var ver = new Int32Array(n + 1), alive = new Uint8Array(n + 1), heap = [], i, k, r;
    for (i = 0; i <= n; i++) { next[i] = i + 1; prev[i] = i - 1; alive[i] = 1; }
    function less(a, b) { return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]); }
    function push(e) {
      var c = heap.length, p;
      heap.push(e);
      while (c > 0) {
        p = (c - 1) >> 1;
        if (!less(heap[c], heap[p])) break;
        var t = heap[c]; heap[c] = heap[p]; heap[p] = t; c = p;
      }
    }
    function pop() {
      var top = heap[0], last = heap.pop(), c = 0, l, m;
      if (heap.length) {
        heap[0] = last;
        for (;;) {
          l = 2 * c + 1; m = c;
          if (l < heap.length && less(heap[l], heap[m])) m = l;
          if (l + 1 < heap.length && less(heap[l + 1], heap[m])) m = l + 1;
          if (m === c) break;
          var t = heap[c]; heap[c] = heap[m]; heap[m] = t; c = m;
        }
      }
      return top;
    }
    function pairRank(a) { // part a (starting at byte a) with the part after it
      var b = next[a];
      return b < n ? rankOf(piece.slice(a, next[b])) : MAX;
    }
    function offer(a) {
      ver[a]++;
      r = pairRank(a);
      if (r !== MAX) push([r, a, ver[a]]);
    }
    for (i = 0; i < n - 1; i++) offer(i);
    while (heap.length) {
      var e = pop();
      k = e[1];
      if (!alive[k] || e[2] !== ver[k]) continue;
      var b = next[k];
      alive[b] = 0;
      next[k] = next[b];
      prev[next[b]] = k;
      if (prev[k] >= 0) offer(prev[k]);
      offer(k);
    }
    var out = [];
    for (k = 0; k < n; k = next[k]) out.push(ranks.get(piece.slice(k, next[k])));
    return out;
  }

  function encode(text) {
    if (!ranks) throw new Error("CL100K: the rank file is not loaded (call CL100K.load first)");
    text = wellFormed(String(text));
    var out = [], m, piece, r, toks, i;
    RE.lastIndex = 0;
    while ((m = RE.exec(text)) !== null) {
      if (m[0] === "") { RE.lastIndex++; continue; }
      piece = utf8(m[0]);
      r = ranks.get(piece);
      if (r !== undefined) { out.push(r); continue; }
      toks = piece.length < api._heapFrom ? mergeSimple(piece) : mergeHeap(piece);
      for (i = 0; i < toks.length; i++) out.push(toks[i]);
    }
    return out;
  }

  function count(text) { return encode(text).length; }

  var api = {
    ready: false,
    load: load,
    loadFromText: loadFromText,
    encode: encode,
    count: count,
    PATTERN: PATTERN,
    _heapFrom: 256 // pieces of this many bytes or more use the heap merge (same result)
  };
  return api;
});
