# iLang Code Chain 1.1

Code Chain is the provenance layer of iLang for a change to a repository: an iLang document that tells an AI agent to put the request that caused a commit and the judgment that allowed it at the end of the commit message, where the commit hash covers them and a signed commit binds them to a key. The request is one FACT line carrying the owner's words verbatim and the change in one clause; the judgment is one JUDGE block.

It is the same chain Media Chain writes inside a generated image or video, put inside a git commit. It uses two parts of the canon that already exist and adds nothing to either: the FACT declaration of SPEC-v5.0 Part I §1 and the frozen JUDGE block of Part II §4 (eleven dimensions, one mode computed by f_v5). A gate reads the chain back from git log with the canon's two validators and counts before it forbids. First run on DeepSeekHarness, whose every commit since v1.1.53 carries a chain and whose CI refuses one without.

- Version 1.1, 2026-11-19, MIT. Shipped in ilang-spec 5.0.18 (1.0 the same day in 5.0.17), DOI 10.5281/zenodo.24384598. Source: https://github.com/ilang-ai/ilang-spec/tree/main/products/code-chain. First gate: https://github.com/adsorgcn/DeepSeekHarness/blob/main/tools/code_chain.py. Sibling: Media Chain, https://ilang.ai/media-chain/
- Files: https://ilang.ai/code-chain/CODE-CHAIN.ilang.md (sha256 ab24c19c724c657392008250f8210bc17b2c40e02cb69ddb36cc87c33ea6e676), https://ilang.ai/code-chain/CODE-CHAIN.iml (sha256 d3500cb84fc52e964500943ea0412e9d2d6aa3c228c3dc7c61c6d09f4e0b5bd2)

## Give it to your agent

Paste the block below into the instruction file of the agent that commits code for you: CLAUDE.md, AGENTS.md, a system prompt, wherever its instructions persist. From then on every commit it makes ends with its chain: who asked, in your words, what changed in one clause, and how the act was judged. A gate in CI reads the chain back the same day; a reader with git reads it back years later.

An agent with tools writes the request line from your words, judges the act of changing the repository, lets code compute the mode, runs the two validators, and appends the six lines before git commit. A chat window with no tools writes the same six lines and hands them back; whoever runs git pastes them into the message.

## iLang

```
::ILANG::v5.0
[TYPE:code_chain][ID:ILANG-CODE-CHAIN][VERSION:1.1][DATE:2026-11-19][LANG:en]
[FROM:@ai_chuhai][TO:@AGENT][STATUS:active]
::STATE{@OWNER, kind:person, role:owner_of_the_repository, alias:the I in this chat}
::STATE{@ARTIFACT, kind:git_commit, act:one_change_to_a_repository, request:one_FACT_line_with_the_owner's_words_verbatim_and_the_change_in_one_clause, judgment:one_JUDGE_block_of_SPEC-v5.0_Part_II_§4}
::STATE{@CHAIN, kind:the_request_line_then_the_JUDGE_block_verbatim_UTF-8, label:ai.ilang.chain, where:the_last_six_lines_of_the_commit_message_after_one_blank_line:the_label_then_the_five, bound_by:the_commit_hash_and_a_signed_commit_when_the_repository_signs, reader:git_log_and_the_two_validators}
::STATE{@REQUEST, form:"::FACT{key:request|by:@HANDLE|words:\"the owner's words\"|change:what_this_commit_does_in_one_clause|conf:confirmed}", words:verbatim_or_absent_never_paraphrased, change:one_clause_in_the_author's_own_words}
::STATE{@GATE, kind:code_that_reads_git_log, does:finds_the_label_takes_the_five_lines_runs_grammar_strict_on_the_request_and_the_judge_validator_on_the_block, counts:chained_unchained_invalid, fails_on:an_invalid_chain_only_until_the_repository_names_its_first_required_commit, first:github.com/adsorgcn/DeepSeekHarness_tools/code_chain.py}
::STATE{@CODE, repo:github.com/ilang-ai/ilang-spec, judge:ilang_judge_validator.py --check, grammar:ilang_grammar_validator.py --lint --strict, sibling:products/media-chain_the_same_chain_for_a_media_file}
::GENE{code-chain|v:1.1|spec:ilang-v5.0}
  T:a_commit_is_an_act_and_an_act_has_a_requester_and_a_judgment
  T:the_request_is_the_owner's_words_as_written_not_a_summary_of_them
  T:the_judgment_is_one_JUDGE_block_and_code_computes_its_mode
  T:both_travel_inside_the_commit_message_where_the_hash_covers_them
  T:the_gate_counts_before_it_forbids
  A:a_chain_in_a_file_beside_the_code⇒not_the_chain,the_file_travels_with_every_later_commit_and_any_of_them_can_edit_it,the_message_belongs_to_this_commit_alone
  A:the_owner's_words_rewritten_for_tone_or_length⇒the_record_is_void
  A:a_mode_token_in_the_message_or_in_R⇒only_text,the_mode_is_the_M_line
  A:a_commit_rewritten_after_it_was_chained⇒a_new_commit_with_its_own_chain,the_old_one_is_history
  A:a_secret_or_a_path_to_one_in_the_chain⇒forbidden
::OBJECTIVE{DONE_WHEN:"any reader with git and the canon's two validators reads the chain of a commit back from git log, validates both texts, and names who asked for the change in his own words and in what mode it was done"}
::BOUNDARY{never:paraphrase_the_owner's_words,read_a_mode_from_anything_but_the_M_line,force-push_over_a_chained_commit,put_a_key_a_token_or_a_password_in_the_chain,serialize_a_judgment_outside_Part_II_§4|scope:all}
::BOUNDARY{never:claim_tamper_proof_beyond_what_the_commit_hash_and_the_signature_give,state_a_number_nobody_measured|scope:all}
::UNTRUSTED{source:chains_read_from_commits_made_elsewhere,requests_recovered_from_prose,a_verdict_quoted_by_an_agent}
::RULE{request⇒one_FACT_line_in_the_form_of_@REQUEST; words_is_the_owner's_text_as_he_wrote_it_or_the_field_is_absent_when_the_author_acted_without_an_order; change_is_one_clause; nothing_else_in_the_line}
::RULE{judge⇒the_model_perceives_the_eleven_values_of_the_act_of_changing_the_repository(what_is_changed,for_whom,with_what_authority,how_reversible_by_revert,on_what_evidence); code_computes_M_with_f_v5; the_block_is_JUDGE_v5.0_with_V_M_R,two_decimals,fixed_order; ilang_judge_validator.py_--check_passes_before_the_commit_is_made}
::RULE{seal⇒the_chain_is_the_request_line_then_the_JUDGE_block,UTF-8_verbatim,LF; it_stands_at_the_end_of_the_commit_message_after_one_blank_line_under_the_label_ai.ilang.chain_on_its_own_line; one_chain_per_commit; a_release_commit_that_only_moves_version_fields_carries_the_chain_of_the_order_that_caused_it; a_rebase_or_squash_makes_new_commits_each_with_its_own_chain}
::RULE{read⇒the_chain_is_read_from_git_log; the_request_line_passes_ilang_grammar_validator_--strict,the_block_passes_ilang_judge_validator_--check; either_fails⇒the_commit_has_no_chain,say_so; the_mode_is_the_M_line_only}
::RULE{gate⇒a_repository_adopts_code-chain_by_running_the_gate_in_CI; the_gate_fails_on_an_invalid_chain_from_the_first_run; it_fails_on_a_missing_chain_only_from_the_commit_the_repository_names_as_its_first_required_one; until_then_it_prints_the_counts}
::RULE{task_done⇒one_line_action_score_S_two_decimals; full_JUDGE_on_request}
::PRIORITY{ BOUNDARY > the_owner's_words_verbatim > one_chain_per_commit > the_gate > brevity }
::ILANG::v5.0
```

4575 characters, sha256 ab24c19c724c657392008250f8210bc17b2c40e02cb69ddb36cc87c33ea6e676. iLang v5.0, canon grammar validator: 0 errors, strict.

## IML 0.6

```
#iml/0.6/ba5fde00dd69
"::ILANG::v5.0"
"[TYPE:code_chain][ID:ILANG-CODE-CHAIN][VERSION:1.1][DATE:2026-11-19][LANG:en]"
"[FROM:@ai_chuhai][TO:@AGENT][STATUS:active]"
:ST"@OWNER, kind:person, role:owner_of_the_repository, alias:the I in this chat"
:ST"@ARTIFACT, kind:git_commit, act:one_change_to_a_repository, request:one_FACT_line_with_the_owner's_words_verbatim_and_the_change_in_one_clause, judgment:one_JUDGE_block_of_SPEC-v5.0_Part_II_§4"
:ST"@CHAIN, kind:the_request_line_then_the_JUDGE_block_verbatim_UTF-8, label:ai.ilang.chain, where:the_last_six_lines_of_the_commit_message_after_one_blank_line:the_label_then_the_five, bound_by:the_commit_hash_and_a_signed_commit_when_the_repository_signs, reader:git_log_and_the_two_validators"
:ST"@REQUEST, form:\"::FACT{key:request|by:@HANDLE|words:\\\"the owner's words\\\"|change:what_this_commit_does_in_one_clause|conf:confirmed}\", words:verbatim_or_absent_never_paraphrased, change:one_clause_in_the_author's_own_words"
:ST"@GATE, kind:code_that_reads_git_log, does:finds_the_label_takes_the_five_lines_runs_grammar_strict_on_the_request_and_the_judge_validator_on_the_block, counts:chained_unchained_invalid, fails_on:an_invalid_chain_only_until_the_repository_names_its_first_required_commit, first:github.com/adsorgcn/DeepSeekHarness_tools/code_chain.py"
:ST"@CODE, repo:github.com/ilang-ai/ilang-spec, judge:ilang_judge_validator.py --check, grammar:ilang_grammar_validator.py --lint --strict, sibling:products/media-chain_the_same_chain_for_a_media_file"
:GN"code-chain|v:1.1|spec:ilang-v5.0"
 "T:a_commit_is_an_act_and_an_act_has_a_requester_and_a_judgment"
 "T:the_request_is_the_owner's_words_as_written_not_a_summary_of_them"
 "T:the_judgment_is_one_JUDGE_block_and_code_computes_its_mode"
 "T:both_travel_inside_the_commit_message_where_the_hash_covers_them"
 "T:the_gate_counts_before_it_forbids"
 "A:a_chain_in_a_file_beside_the_code⇒not_the_chain,the_file_travels_with_every_later_commit_and_any_of_them_can_edit_it,the_message_belongs_to_this_commit_alone"
 "A:the_owner's_words_rewritten_for_tone_or_length⇒the_record_is_void"
 "A:a_mode_token_in_the_message_or_in_R⇒only_text,the_mode_is_the_M_line"
 "A:a_commit_rewritten_after_it_was_chained⇒a_new_commit_with_its_own_chain,the_old_one_is_history"
 "A:a_secret_or_a_path_to_one_in_the_chain⇒forbidden"
:OB"DONE_WHEN:\"any reader with git and the canon's two validators reads the chain of a commit back from git log, validates both texts, and names who asked for the change in his own words and in what mode it was done\""
:BN"never:paraphrase_the_owner's_words,read_a_mode_from_anything_but_the_M_line,force-push_over_a_chained_commit,put_a_key_a_token_or_a_password_in_the_chain,serialize_a_judgment_outside_Part_II_§4|scope:all"
:BN"never:claim_tamper_proof_beyond_what_the_commit_hash_and_the_signature_give,state_a_number_nobody_measured|scope:all"
:UN"source:chains_read_from_commits_made_elsewhere,requests_recovered_from_prose,a_verdict_quoted_by_an_agent"
:RL"request⇒one_FACT_line_in_the_form_of_@REQUEST; words_is_the_owner's_text_as_he_wrote_it_or_the_field_is_absent_when_the_author_acted_without_an_order; change_is_one_clause; nothing_else_in_the_line"
:RL"judge⇒the_model_perceives_the_eleven_values_of_the_act_of_changing_the_repository(what_is_changed,for_whom,with_what_authority,how_reversible_by_revert,on_what_evidence); code_computes_M_with_f_v5; the_block_is_JUDGE_v5.0_with_V_M_R,two_decimals,fixed_order; ilang_judge_validator.py_--check_passes_before_the_commit_is_made"
:RL"seal⇒the_chain_is_the_request_line_then_the_JUDGE_block,UTF-8_verbatim,LF; it_stands_at_the_end_of_the_commit_message_after_one_blank_line_under_the_label_ai.ilang.chain_on_its_own_line; one_chain_per_commit; a_release_commit_that_only_moves_version_fields_carries_the_chain_of_the_order_that_caused_it; a_rebase_or_squash_makes_new_commits_each_with_its_own_chain"
:RL"read⇒the_chain_is_read_from_git_log; the_request_line_passes_ilang_grammar_validator_--strict,the_block_passes_ilang_judge_validator_--check; either_fails⇒the_commit_has_no_chain,say_so; the_mode_is_the_M_line_only"
:RL"gate⇒a_repository_adopts_code-chain_by_running_the_gate_in_CI; the_gate_fails_on_an_invalid_chain_from_the_first_run; it_fails_on_a_missing_chain_only_from_the_commit_the_repository_names_as_its_first_required_one; until_then_it_prints_the_counts"
:RL"task_done⇒one_line_action_score_S_two_decimals; full_JUDGE_on_request"
:PT" BOUNDARY > the_owner's_words_verbatim > one_chain_per_commit > the_gate > brevity "
"::ILANG::v5.0"
```

4541 characters, sha256 d3500cb84fc52e964500943ea0412e9d2d6aa3c228c3dc7c61c6d09f4e0b5bd2. Compiled by the reference codec of IML 0.6; decompiles back to the iLang file byte for byte.

## Where it goes

- An agent that commits code for an owner: Paste the block into the instruction file it reads when it starts. Before each git commit it writes the request line from the owner's words, judges the act, lets code compute the mode, and appends the six lines to the message.
- A repository that adopts it: Run the gate in CI. It fails on an invalid chain from the first run, and on a missing chain only from the commit the repository names as its first required one; until then it prints counts. DeepSeekHarness names v1.1.53.
- A chat assistant with no tools: It can write the request line and the JUDGE block and hand them back as text. Putting them into the message is done by whoever runs git.
- A reader with git and the two validators: git log -1 --format=%B REV, find the label, validate the five lines, and read who asked, in his own words, and in what mode it was done. No contact with the author is needed.

Pasted into a chat, it covers that chat only. To have it every time, put it where instructions persist.

## The chain of a commit

A real one. Commit a662a1d of DeepSeekHarness, 2026-11-19: the commit that turned the gate from counting to refusing. The order is the owner's words, verbatim; the change is one clause; the mode is the M line. https://github.com/adsorgcn/DeepSeekHarness/commit/a662a1d

```
ci: code-chain 门禁开拦，v1.1.53 起缺链就挂；README 写明每笔改动带链

tests.yml 的门禁加 --require v1.1.53：v1.1.52 起照数，v1.1.53 之后缺链或链不合法直接挂。README「放心」加一段链的读法。CHANGELOG 记 v1.1.54。

ai.ilang.chain
::FACT{key:request|by:@SUN|words:"从 v1.1.53 起缺链就拦 页也开"|change:the CI gate requires a chain on every commit from v1.1.53 on, README says so, the code-chain page opens on ilang.ai|conf:confirmed}
::JUDGE{v5.0}
V:[int=0.90,cap=0.90,csq=0.80,rel=0.90,cer=0.90,aut=0.90,rev=0.90,evd=0.90,sov=0.95,ine=0.70,ext=0.85]
M:M1|conf:0.90
R:the_owner_ordered_it_in_his_words_the_gate_now_forbids_what_it_only_counted_reversible_by_revert
```

What the gate printed on that repository the same day, in CI, with --since v1.1.52 --require v1.1.53: the one commit without a chain predates v1.1.53, so it is counted, not refused.

```
code-chain: 5 chained, 1 unchained, 0 invalid (since v1.1.52)
```

words is absent when the author acted without an order. change is one clause. A rebase or a squash makes new commits, each with its own chain; the old one is history and is never edited.

## Read it line by line

Line numbers are those of CODE-CHAIN.ilang.md.

1. `::ILANG::v5.0`
   The opening marker: what follows is an iLang document, protocol version 5.0.
2. `[TYPE:code_chain][ID:ILANG-CODE-CHAIN][VERSION:1.1][DATE:2026-11-19][LANG:en]`
   The header: a code-chain document named ILANG-CODE-CHAIN, version 1.1, dated 2026-11-19, in English.
3. `[FROM:@ai_chuhai][TO:@AGENT][STATUS:active]`
   From the author to the AI agent that loads it; the status is active.
4. `::STATE{@OWNER, kind:person, role:owner_of_the_repository, alias:the I in this chat}`
   Who the owner is: the person whose repository this is; "I" in the chat means the owner.
5. `::STATE{@ARTIFACT, kind:git_commit, act:one_change_to_a_repository, request:one_FACT_line_with_the_owner's_words_verbatim_and_the_change_in_one_clause, judgment:one_JUDGE_block_of_SPEC-v5.0_Part_II_§4}`
   What an artifact is here: one git commit, one change to a repository, with one FACT line as its request (the owner's words verbatim and the change in one clause) and one JUDGE block of SPEC-v5.0 Part II §4 as its judgment.
6. `::STATE{@CHAIN, kind:the_request_line_then_the_JUDGE_block_verbatim_UTF-8, label:ai.ilang.chain, where:the_last_six_lines_of_the_commit_message_after_one_blank_line:the_label_then_the_five, bound_by:the_commit_hash_and_a_signed_commit_when_the_repository_signs, reader:git_log_and_the_two_validators}`
   What the chain is: the request line followed by the JUDGE block, verbatim UTF-8, under the label ai.ilang.chain. It stands in the last six lines of the commit message after one blank line: the label, then the five. The commit hash covers it and a signed commit binds it to a key; git log and the two validators read it.
7. `::STATE{@REQUEST, form:"::FACT{key:request|by:@HANDLE|words:\"the owner's words\"|change:what_this_commit_does_in_one_clause|conf:confirmed}", words:verbatim_or_absent_never_paraphrased, change:one_clause_in_the_author's_own_words}`
   The form of the request line. by: the handle of who asked. words: the owner's text as he wrote it, or absent, never paraphrased. change: what this commit does, one clause, in the author's own words.
8. `::STATE{@GATE, kind:code_that_reads_git_log, does:finds_the_label_takes_the_five_lines_runs_grammar_strict_on_the_request_and_the_judge_validator_on_the_block, counts:chained_unchained_invalid, fails_on:an_invalid_chain_only_until_the_repository_names_its_first_required_commit, first:github.com/adsorgcn/DeepSeekHarness_tools/code_chain.py}`
   What the gate is: code that reads git log, finds the label, takes the five lines, runs the grammar validator in strict mode on the request and the judge validator on the block. It counts chained, unchained and invalid commits; it fails only on an invalid chain until the repository names its first required commit. The first gate is tools/code_chain.py of DeepSeekHarness.
9. `::STATE{@CODE, repo:github.com/ilang-ai/ilang-spec, judge:ilang_judge_validator.py --check, grammar:ilang_grammar_validator.py --lint --strict, sibling:products/media-chain_the_same_chain_for_a_media_file}`
   Where the code is: the ilang-spec repository, the judge validator for JUDGE blocks, the grammar validator for everything else; the sibling product Media Chain puts the same chain into a media file.
10. `::GENE{code-chain|v:1.1|spec:ilang-v5.0}`
   The genes of the product, version 1.1, on iLang v5.0: the traits and the anti-patterns that follow.
11. `  T:a_commit_is_an_act_and_an_act_has_a_requester_and_a_judgment`
   A commit is an act, and an act has someone who asked for it and a judgment of it.
12. `  T:the_request_is_the_owner's_words_as_written_not_a_summary_of_them`
   The request is what the owner wrote, as written, not a summary of it.
13. `  T:the_judgment_is_one_JUDGE_block_and_code_computes_its_mode`
   The judgment is one JUDGE block, and its mode is computed by code, not chosen by the model.
14. `  T:both_travel_inside_the_commit_message_where_the_hash_covers_them`
   The request and the judgment are stored in the commit message itself, where the commit hash covers them.
15. `  T:the_gate_counts_before_it_forbids`
   The gate reports counts first; it refuses only what the repository has said it refuses.
16. `  A:a_chain_in_a_file_beside_the_code⇒not_the_chain,the_file_travels_with_every_later_commit_and_any_of_them_can_edit_it,the_message_belongs_to_this_commit_alone`
   A chain written into a file beside the code is not the chain, and the line says why: the file travels with every later commit and any of them can edit it, so nothing ties one of its lines to the commit that made a change; the message belongs to this commit alone, and it is the message that the hash and the signature seal as the record of the act. Version 1.0 of this line said the hash does not cover a file; that was inaccurate, a file in the tree is under the commit hash too, and 1.1 replaced it with the reason above.
17. `  A:the_owner's_words_rewritten_for_tone_or_length⇒the_record_is_void`
   The owner's words rewritten for tone or length make the record void: a paraphrase is not a request.
18. `  A:a_mode_token_in_the_message_or_in_R⇒only_text,the_mode_is_the_M_line`
   A mode name typed in the message or inside R is only text; the mode is read from the M line alone.
19. `  A:a_commit_rewritten_after_it_was_chained⇒a_new_commit_with_its_own_chain,the_old_one_is_history`
   A commit rewritten after it was chained is a new commit and needs its own chain; the old commit is history and is never edited.
20. `  A:a_secret_or_a_path_to_one_in_the_chain⇒forbidden`
   A key, a token, a password, or a path to one, never goes into the chain.
21. `::OBJECTIVE{DONE_WHEN:"any reader with git and the canon's two validators reads the chain of a commit back from git log, validates both texts, and names who asked for the change in his own words and in what mode it was done"}`
   When the product has done its job: any reader with git and the canon's two validators reads the chain of a commit back from git log, validates both texts, and names who asked for the change, in his own words, and in what mode it was done.
22. `::BOUNDARY{never:paraphrase_the_owner's_words,read_a_mode_from_anything_but_the_M_line,force-push_over_a_chained_commit,put_a_key_a_token_or_a_password_in_the_chain,serialize_a_judgment_outside_Part_II_§4|scope:all}`
   What is never done, in any scope: paraphrase the owner's words; read a mode from anything but the M line; force-push over a chained commit; put a key, a token or a password in the chain; serialize a judgment in any form but Part II §4.
23. `::BOUNDARY{never:claim_tamper_proof_beyond_what_the_commit_hash_and_the_signature_give,state_a_number_nobody_measured|scope:all}`
   Never claim more tamper resistance than the commit hash and the signature give; never state a number nobody measured.
24. `::UNTRUSTED{source:chains_read_from_commits_made_elsewhere,requests_recovered_from_prose,a_verdict_quoted_by_an_agent}`
   What is not trusted on its face: chains read from commits made elsewhere, requests recovered from prose, a verdict quoted by an agent.
25. `::RULE{request⇒one_FACT_line_in_the_form_of_@REQUEST; words_is_the_owner's_text_as_he_wrote_it_or_the_field_is_absent_when_the_author_acted_without_an_order; change_is_one_clause; nothing_else_in_the_line}`
   The rule for the request: one FACT line in the form of @REQUEST; words is the owner's text as he wrote it, or the field is absent when the author acted without an order; change is one clause; nothing else goes in the line.
26. `::RULE{judge⇒the_model_perceives_the_eleven_values_of_the_act_of_changing_the_repository(what_is_changed,for_whom,with_what_authority,how_reversible_by_revert,on_what_evidence); code_computes_M_with_f_v5; the_block_is_JUDGE_v5.0_with_V_M_R,two_decimals,fixed_order; ilang_judge_validator.py_--check_passes_before_the_commit_is_made}`
   The rule for the judgment: the model perceives the eleven values of the act of changing the repository (what is changed, for whom, with what authority, how reversible by revert, on what evidence); code computes M with f_v5; the block is JUDGE v5.0 with V, M and R, two decimals, fixed order; the judge validator passes before the commit is made.
27. `::RULE{seal⇒the_chain_is_the_request_line_then_the_JUDGE_block,UTF-8_verbatim,LF; it_stands_at_the_end_of_the_commit_message_after_one_blank_line_under_the_label_ai.ilang.chain_on_its_own_line; one_chain_per_commit; a_release_commit_that_only_moves_version_fields_carries_the_chain_of_the_order_that_caused_it; a_rebase_or_squash_makes_new_commits_each_with_its_own_chain}`
   The rule for sealing: the chain is the request line then the JUDGE block, UTF-8 verbatim, LF; it stands at the end of the commit message after one blank line under the label ai.ilang.chain on its own line; one chain per commit; a release commit that only moves version fields carries the chain of the order that caused it; a rebase or a squash makes new commits, each with its own chain.
28. `::RULE{read⇒the_chain_is_read_from_git_log; the_request_line_passes_ilang_grammar_validator_--strict,the_block_passes_ilang_judge_validator_--check; either_fails⇒the_commit_has_no_chain,say_so; the_mode_is_the_M_line_only}`
   The rule for reading: the chain is read from git log; the request line passes the grammar validator in strict mode and the block passes the judge validator; if either fails, the commit has no chain and the reader says so; the mode is the M line only.
29. `::RULE{gate⇒a_repository_adopts_code-chain_by_running_the_gate_in_CI; the_gate_fails_on_an_invalid_chain_from_the_first_run; it_fails_on_a_missing_chain_only_from_the_commit_the_repository_names_as_its_first_required_one; until_then_it_prints_the_counts}`
   The rule for the gate: a repository adopts Code Chain by running the gate in CI; the gate fails on an invalid chain from the first run; it fails on a missing chain only from the commit the repository names as its first required one; until then it prints the counts.
30. `::RULE{task_done⇒one_line_action_score_S_two_decimals; full_JUDGE_on_request}`
   When a task is done the agent writes one action-score line, S with two decimals; a full JUDGE block on request.
31. `::PRIORITY{ BOUNDARY > the_owner's_words_verbatim > one_chain_per_commit > the_gate > brevity }`
   When rules collide: the boundaries first, then the owner's words verbatim, then one chain per commit, then the gate, then brevity.
32. `::ILANG::v5.0`
   The closing marker: the document ends here.

## Acceptance

Eight items in https://github.com/ilang-ai/ilang-spec/blob/main/products/code-chain/ACCEPTANCE.ilang.md, run by goal-check of ilang-conformance; five run by code, three wait for a person, as of 2026-11-19.

- C1 to C5: Grammar in strict mode, the IML round trip with the reference codec, the two pinned hashes, the length under 6000 characters: pass in the 5.0.18 release lint.
- C6: The chain in the README, the request line then the JUDGE block, passes both validators when written to a file under the canon header: waits for a tester's evidence line.
- C7: DeepSeekHarness reads its chained commits back with its gate in a CI run and reports 0 invalid: the run exists (v1.1.54, 2026-11-19, the line quoted above); the item passes when someone other than the author records it.
- C8: A reader given only git log of one chained commit names who asked, in his own words, and the mode: waits for a reader.

## iLang or IML

Paste the iLang block, written for people and models. The IML block is the same document compiled for programs with the IML 0.6 reference codec (https://github.com/ilang-ai/iml-protocol). It decompiles to the iLang text; the acceptance items check both ways.

## Questions

**Why in the commit message and not in a file beside the code?** Because the message is the record of the act and belongs to one commit only. A file in the tree travels with every later commit and any of them can edit it; nothing ties one of its lines to the commit that made a change. The message is what the hash of that commit and, when the repository signs, its signature seal as the act's own record.

**Where does the mode come from?** From code. The model perceives the eleven values of the act of changing the repository; f_v5 of SPEC-v5.0 Part II computes the mode from them; the judge validator refuses a block whose M line disagrees with its V line. A mode name typed into the message is only text.

**What about the commits made before a repository adopted it?** They are counted, not refused. The gate fails on an invalid chain from its first run; it fails on a missing chain only from the commit the repository names as its first required one. DeepSeekHarness names v1.1.53: one older commit in its window has no chain, and the gate prints it and passes.

**What if nobody gave an order?** Then words is absent. The author's own change clause remains, and so does the judgment; what the record says is that the author acted without an order, which is itself worth knowing.

**Does this make a commit tamper-proof?** No more than git does, and the product forbids claiming more. The commit hash covers the chain; a signed commit binds it to a key; a rewritten commit is a different commit with a different hash and needs its own chain. What the chain adds is not strength but content: who asked, in his words, and how the act was judged, in the place the hash already covers.

**What about squash and rebase?** They make new commits. Each needs its own chain; the old commits are history and are never edited. A release commit that only moves version fields carries the chain of the order that caused it.

**Is this the same as Media Chain?** The same chain, a different artifact. Media Chain puts a GEN line and a JUDGE block inside a generated image or video before the platform signs it; Code Chain puts a FACT line and a JUDGE block inside a commit message before git hashes it. One judgment layer, one JUDGE block, two places it is sealed.

**Can I change it?** Yes. The license is MIT. To check that your edit is still valid iLang, run the canon grammar validator in strict mode and the judge validator on any JUDGE block: both are in ilang-spec, standard library only.

## Feedback

Found a case where it fails? File a counterexample: https://github.com/ilang-ai/ilang-research/issues/new?template=counterexample.yml

Want a rule changed? File an amendment with the fix: https://github.com/ilang-ai/ilang-research/issues/new?template=amendment.yml

Both run the gates the canon defines and are recorded verbatim at research (https://github.com/ilang-ai/ilang-research/tree/main/records); nothing is merged by a machine.

Want the files? https://github.com/ilang-ai/ilang-spec/tree/main/products/code-chain (the product, its IML form and the acceptance items)

Want the first gate? https://github.com/adsorgcn/DeepSeekHarness/blob/main/tools/code_chain.py (check, show, seal)

Want the same chain inside a generated image or video? See Media Chain: https://ilang.ai/media-chain/

Want the agent to keep its memory? See Memory: https://ilang.ai/memory/

Want a persona for the agent? See SOUL: https://ilang.ai/soul/
