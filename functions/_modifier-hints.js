// Hints for ilang_validate: when the canon validator reports E302 for an unknown modifier, the MCP
// server adds did_you_mean with the registered key it most likely stands for. The validator itself
// is untouched (it matches the Python reference byte for byte); this is a hint layer on top.
//
// aliases: common names people write for a registered modifier. Each value must be a registered
// modifier key; an entry whose value is not registered is ignored.
// max_distance: an unknown key that is not in aliases gets the registered key nearest to it by
// Levenshtein distance, when that distance is at most this and smaller than the length of both
// keys (so at least one character survives: `outp` is two edits from `op` but gets nothing), and
// no other registered key is as near. Otherwise no suggestion is made.
export default {
  aliases: {
    tgt: 'lng',
    target: 'lng',
    lang: 'lng',
    language: 'lng',
    source: 'src',
    format: 'fmt',
  },
  max_distance: 2,
};
