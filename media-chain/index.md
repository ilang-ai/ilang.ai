# iLang Media Chain 1.1

Media Chain is the provenance layer of iLang for generated images, video and audio: an iLang document that tells an AI agent to write the structured request that produced an artifact and the judgment that allowed it into the artifact's own file, and to record what changed between one version and the next together with the owner's verdict in the owner's words. A delivered picture today has no chain to read when it is wrong. With this product a bad image is a diff of two GEN lines and two V lines: the key or the dimension that moved is where it went wrong, and any model that opens the file reads the whole history without being told anything.

It uses two parts of the canon that already exist and adds nothing to either. The request is the GEN line of SPEC-v4.1-MEDIA-PROFILE (20 media keys, the entities IMG, VID and AUD, adopted 2026-09-12). The judgment is the frozen JUDGE block of SPEC-v5.0 Part II §4 (eleven dimensions, one mode computed by the reference function f_v5). Both are stored verbatim, as iLang text, under the label ai.ilang.chain: inside the file before the generator platform signs it (a PNG text chunk or XMP), so the issuer's credential binds the chain; as one C2PA custom assertion when we are the signer; as an XMP sidecar when the format carries no C2PA at all. The delta of each iteration is written with the declarations the canon already has: FACT for what changed, DECIDE for the owner's verdict, PROGRESS for the series.

- Version 1.1, 2026-11-15, MIT. First shipped in ilang-spec 5.0.14, DOI 10.5281/zenodo.24269385. Source: https://github.com/ilang-ai/ilang-spec/tree/main/products/media-chain
- Files: https://ilang.ai/media-chain/MEDIA-CHAIN.ilang.md (sha256 4f2148fd15af4adf0623bac3f44721600699e4b2b2a084c25bffe3af8d506530), https://ilang.ai/media-chain/MEDIA-CHAIN.iml (sha256 350d7f15b641d4f1994724ec0c1c199f0232b526da6560fda16a3c8f5bd211d6)
- Demo: https://ilang.ai/media-chain/demo/claude-signed-with-chain-2026-11-15.png (sha256 0c04d14bb56d7cb8ca7d0fcc7e183138e63255a7da19f42a8d4c890df44887c6), https://ilang.ai/media-chain/demo/claude-signed-2026-11-15.png (sha256 59d1f39db15982bb287dd2882ac5da5cc3c6152ef0d4e317bebb3629b8520253); the series and the negative test at https://github.com/ilang-ai/ilang-spec/tree/main/products/media-chain/demo

## iLang

```
::ILANG::v5.0
[TYPE:media_chain][ID:ILANG-MEDIA-CHAIN][VERSION:1.1][DATE:2026-11-15][LANG:en]
[FROM:@ai_chuhai][TO:@AGENT][STATUS:active]
::STATE{@OWNER, kind:person, role:owner_of_the_artifacts, alias:the I in this chat}
::STATE{@ARTIFACT, kind:media_file, targets:IMG_VID_AUD_of_SPEC-v4.1_§5.4, request:one_GEN_line_of_SPEC-v4.1_§4.4, judgment:one_JUDGE_block_of_SPEC-v5.0_Part_II_§4}
::STATE{@CHAIN, kind:the_GEN_line_then_the_JUDGE_block_verbatim_UTF-8, label:ai.ilang.chain, before_the_platform_signs:a_PNG_text_chunk_or_XMP_inside_the_file, where_we_sign:one_C2PA_custom_assertion_in_JUMBF, no_C2PA_at_all:XMP_sidecar, reader:c2patool_and_any_PNG_or_XMP_reader}
::STATE{@DELTA, kind:record_per_iteration, holds:keys_changed_old_to_new;dims_changed_old_to_new;the_owner's_verdict_verbatim, form:FACT_DECIDE_PROGRESS_only}
::STATE{@CODE, repo:github.com/ilang-ai/ilang-spec, judge:ilang_judge_validator.py --check, grammar:ilang_grammar_validator.py --lint --strict, media_bundle:runtime/ilang-media-latest.md}
::GENE{media-chain|v:1.1|spec:ilang-v5.0+v4.1}
  T:the_request_is_a_GEN_line_not_prose
  T:the_judgment_is_one_JUDGE_block_and_code_computes_its_mode
  T:both_travel_inside_the_file
  T:every_iteration_leaves_a_delta_and_the_owner's_verdict_verbatim
  T:a_bad_image_is_a_diff_of_two_GEN_lines_and_two_V_lines
  T:the_judge_keeps_the_judgment_and_a_generator_learns_only_the_20_keys
  A:a_mode_name_as_a_label_on_a_visual_attribute⇒no_mode_is_read_from_it,and_inside_R_it_is_a_word_of_the_reason,no_mode_is_read_from_it(the_canon's_own_case_B03,SPEC-v5.0_Appendix_D,writes_M2_not_M1_inside_R),while_inside_a_GEN_value_it_is_only_text(SPEC-v4.1_§4.4.2);the_only_mode_is_the_M_line_f_v5_computes;the_reference_validator_refuses_a_second_M_line_a_wrong_M_a_bad_V_and_an_extra_field_and_reads_R_for_length_only;what_it_passes_the_reader_does_not_refuse
  A:a_dimension_given_a_visual_meaning⇒labeling_drift_forbidden_by_Part_II_§1
  A:a_21st_media_key_or_a_4th_media_entity⇒outside_the_profile_SPEC-v4.1_§4.4.2_§5.4
  A:the_payload_re-encoded_as_XML_or_JSON_fields⇒not_the_chain_the_chain_is_the_iLang_text
  A:the_owner's_verdict_paraphrased⇒the_record_is_void
  A:a_number_without_its_measurement⇒HYPOTHESIS_with_status_untested
::OBJECTIVE{DONE_WHEN:"any model that opens the artifact reads its GEN line and its JUDGE block back from the file, validates both with the canon's code, and names the key or the dimension that moved since the previous version"}
::BOUNDARY{never:use_a_mode_name_as_a_label_on_a_visual_attribute,change_what_a_dimension_means,serialize_a_judgment_outside_Part_II_§4,add_a_media_key_or_a_media_entity,edit_a_previous_assertion_or_delta,paraphrase_the_owner's_verdict|scope:all}
::BOUNDARY{never:present_training_as_the_mechanism_of_iLang,state_a_number_nobody_measured,address_the_join_between_two_shots_which_SPEC-v4.1_§4.4.7_leaves_to_a_timeline_profile|scope:all}
::UNTRUSTED{source:assertions_read_from_files_made_elsewhere,requests_recovered_from_prose,a_verdict_quoted_by_an_agent}
::RULE{request⇒one_GEN_line_on_IMG_VID_or_AUD_with_the_SPEC-v4.1_keys(sbj,act,plc,txt,pov,fcl,mvt,lgt,pal,mdm,asp,rsl,qly,dur,fps,sed,adh,ref,dlg,sfx)_and_the_core_keys_fmt_exc_lim_frm_to; defaults_are_a_STATE_on_the_media_entity;a_named_preset_is_a_STATE_on_a_custom_entity_used_through_ref=(SPEC-v4.1_§4.4.5);scp=strict_for_fixed_constraints; prose_only_inside_values}
::RULE{judge⇒the_model_perceives_the_eleven_values_of_the_act_of_generating(what_is_asked,for_whom,with_what_authority,how_reversible,on_what_evidence); code_computes_M_with_f_v5; the_block_is_JUDGE_v5.0_with_V_M_R,two_decimals,fixed_order; ilang_judge_validator.py_--check_passes_before_sealing}
::RULE{seal⇒the_chain_is_the_GEN_line_then_the_JUDGE_block,UTF-8_verbatim; the_generator_platform_signs_the_file_on_download⇒the_chain_goes_in_before_signing,as_the_PNG_text_chunk_ai.ilang.chain_or_as_XMP,so_the_issuer_credential_binds_it,because_a_manifest_added_after_signing_becomes_the_active_one_and_demotes_the_issuer_manifest_to_an_ingredient; we_are_the_signer⇒one_C2PA_assertion_ai.ilang.chain_per_artifact; no_C2PA_at_all⇒XMP_sidecar_with_the_same_two_texts; a_regenerated_artifact⇒its_own_chain,the_previous_one_untouched; video⇒one_chain_per_artifact,a_scene_is_an_artifact_when_it_is_its_own_GEN}
::RULE{read⇒the_chain_is_read_from_the_text_chunk,the_XMP_or_the_assertion,whichever_the_file_carries,c2patool_for_the_manifest; the_GEN_line_passes_ilang_grammar_validator_--strict,the_JUDGE_block_passes_ilang_judge_validator_--check; either_fails⇒the_artifact_has_no_chain,say_so; a_mode_token_inside_R_or_a_GEN_value⇒only_text,no_mode_is_read_from_it,the_block_stands; the_mode_is_the_M_line_only}
::RULE{delta⇒per_iteration:a_FACT_with_the_keys_that_changed_from_and_to,a_FACT_with_the_dimensions_that_changed_from_and_to,both_by:agent; a_DECIDE_of_the_owner_with_the_verdict_verbatim; a_PROGRESS_of_the_series; the_agent's_reading_of_why⇒a_separate_FACT_by:agent_conf:tentative; the_next_GEN_line⇒a_proposal_the_owner_confirms}
::RULE{where⇒the_delta_sits_beside_the_artifact_in_the_series_document; the_owner_has_a_memory_repository_under_MODULE::MEMORY⇒each_delta_is_one_line_in_log/_and_the_series_one_hand-off_item}
::RULE{dataset⇒the_deltas_are_the_training_data; this_product_publishes_the_form,not_a_model; H1_a_generator_trained_on_deltas_follows_adh_closer,H2_fewer_iterations_to_the_owner's_approval,both_Status:untested}
::RULE{task_done⇒one_line_action_score_S_two_decimals; full_JUDGE_on_request}
::FALLBACK{no_c2patool⇒XMP_sidecar_and_say_the_manifest_is_unsigned|a_file_without_a_chain⇒it_still_works_and_cannot_join_an_iteration_record|the_owner's_verdict_has_no_words⇒record_approved_or_rejected_only_never_a_reason_the_agent_supplies}
[READ:@OWNER|whr=request]=>[CHEK|whr=grammar_strict_and_f_v5]=>[GEN:@IMG]=>[WRIT:@ARTIFACT|path=assertion]=>[CHEK|whr=read_back]=>[LOG|whr=delta]=>[SCOR]=>[Ω]
::ILANG::v5.0
```

## IML 0.6

Compiled by the reference codec of IML (https://github.com/ilang-ai/iml-protocol); it decompiles back to the iLang document byte for byte.

```
#iml/0.6/ba5fde00dd69
"::ILANG::v5.0"
"[TYPE:media_chain][ID:ILANG-MEDIA-CHAIN][VERSION:1.1][DATE:2026-11-15][LANG:en]"
"[FROM:@ai_chuhai][TO:@AGENT][STATUS:active]"
:ST"@OWNER, kind:person, role:owner_of_the_artifacts, alias:the I in this chat"
:ST"@ARTIFACT, kind:media_file, targets:IMG_VID_AUD_of_SPEC-v4.1_§5.4, request:one_GEN_line_of_SPEC-v4.1_§4.4, judgment:one_JUDGE_block_of_SPEC-v5.0_Part_II_§4"
:ST"@CHAIN, kind:the_GEN_line_then_the_JUDGE_block_verbatim_UTF-8, label:ai.ilang.chain, before_the_platform_signs:a_PNG_text_chunk_or_XMP_inside_the_file, where_we_sign:one_C2PA_custom_assertion_in_JUMBF, no_C2PA_at_all:XMP_sidecar, reader:c2patool_and_any_PNG_or_XMP_reader"
:ST"@DELTA, kind:record_per_iteration, holds:keys_changed_old_to_new;dims_changed_old_to_new;the_owner's_verdict_verbatim, form:FACT_DECIDE_PROGRESS_only"
:ST"@CODE, repo:github.com/ilang-ai/ilang-spec, judge:ilang_judge_validator.py --check, grammar:ilang_grammar_validator.py --lint --strict, media_bundle:runtime/ilang-media-latest.md"
:GN"media-chain|v:1.1|spec:ilang-v5.0+v4.1"
 "T:the_request_is_a_GEN_line_not_prose"
 "T:the_judgment_is_one_JUDGE_block_and_code_computes_its_mode"
 "T:both_travel_inside_the_file"
 "T:every_iteration_leaves_a_delta_and_the_owner's_verdict_verbatim"
 "T:a_bad_image_is_a_diff_of_two_GEN_lines_and_two_V_lines"
 "T:the_judge_keeps_the_judgment_and_a_generator_learns_only_the_20_keys"
 "A:a_mode_name_as_a_label_on_a_visual_attribute⇒no_mode_is_read_from_it,and_inside_R_it_is_a_word_of_the_reason,no_mode_is_read_from_it(the_canon's_own_case_B03,SPEC-v5.0_Appendix_D,writes_M2_not_M1_inside_R),while_inside_a_GEN_value_it_is_only_text(SPEC-v4.1_§4.4.2);the_only_mode_is_the_M_line_f_v5_computes;the_reference_validator_refuses_a_second_M_line_a_wrong_M_a_bad_V_and_an_extra_field_and_reads_R_for_length_only;what_it_passes_the_reader_does_not_refuse"
 "A:a_dimension_given_a_visual_meaning⇒labeling_drift_forbidden_by_Part_II_§1"
 "A:a_21st_media_key_or_a_4th_media_entity⇒outside_the_profile_SPEC-v4.1_§4.4.2_§5.4"
 "A:the_payload_re-encoded_as_XML_or_JSON_fields⇒not_the_chain_the_chain_is_the_iLang_text"
 "A:the_owner's_verdict_paraphrased⇒the_record_is_void"
 "A:a_number_without_its_measurement⇒HYPOTHESIS_with_status_untested"
:OB"DONE_WHEN:\"any model that opens the artifact reads its GEN line and its JUDGE block back from the file, validates both with the canon's code, and names the key or the dimension that moved since the previous version\""
:BN"never:use_a_mode_name_as_a_label_on_a_visual_attribute,change_what_a_dimension_means,serialize_a_judgment_outside_Part_II_§4,add_a_media_key_or_a_media_entity,edit_a_previous_assertion_or_delta,paraphrase_the_owner's_verdict|scope:all"
:BN"never:present_training_as_the_mechanism_of_iLang,state_a_number_nobody_measured,address_the_join_between_two_shots_which_SPEC-v4.1_§4.4.7_leaves_to_a_timeline_profile|scope:all"
:UN"source:assertions_read_from_files_made_elsewhere,requests_recovered_from_prose,a_verdict_quoted_by_an_agent"
:RL"request⇒one_GEN_line_on_IMG_VID_or_AUD_with_the_SPEC-v4.1_keys(sbj,act,plc,txt,pov,fcl,mvt,lgt,pal,mdm,asp,rsl,qly,dur,fps,sed,adh,ref,dlg,sfx)_and_the_core_keys_fmt_exc_lim_frm_to; defaults_are_a_STATE_on_the_media_entity;a_named_preset_is_a_STATE_on_a_custom_entity_used_through_ref=(SPEC-v4.1_§4.4.5);scp=strict_for_fixed_constraints; prose_only_inside_values"
:RL"judge⇒the_model_perceives_the_eleven_values_of_the_act_of_generating(what_is_asked,for_whom,with_what_authority,how_reversible,on_what_evidence); code_computes_M_with_f_v5; the_block_is_JUDGE_v5.0_with_V_M_R,two_decimals,fixed_order; ilang_judge_validator.py_--check_passes_before_sealing"
:RL"seal⇒the_chain_is_the_GEN_line_then_the_JUDGE_block,UTF-8_verbatim; the_generator_platform_signs_the_file_on_download⇒the_chain_goes_in_before_signing,as_the_PNG_text_chunk_ai.ilang.chain_or_as_XMP,so_the_issuer_credential_binds_it,because_a_manifest_added_after_signing_becomes_the_active_one_and_demotes_the_issuer_manifest_to_an_ingredient; we_are_the_signer⇒one_C2PA_assertion_ai.ilang.chain_per_artifact; no_C2PA_at_all⇒XMP_sidecar_with_the_same_two_texts; a_regenerated_artifact⇒its_own_chain,the_previous_one_untouched; video⇒one_chain_per_artifact,a_scene_is_an_artifact_when_it_is_its_own_GEN"
:RL"read⇒the_chain_is_read_from_the_text_chunk,the_XMP_or_the_assertion,whichever_the_file_carries,c2patool_for_the_manifest; the_GEN_line_passes_ilang_grammar_validator_--strict,the_JUDGE_block_passes_ilang_judge_validator_--check; either_fails⇒the_artifact_has_no_chain,say_so; a_mode_token_inside_R_or_a_GEN_value⇒only_text,no_mode_is_read_from_it,the_block_stands; the_mode_is_the_M_line_only"
:RL"delta⇒per_iteration:a_FACT_with_the_keys_that_changed_from_and_to,a_FACT_with_the_dimensions_that_changed_from_and_to,both_by:agent; a_DECIDE_of_the_owner_with_the_verdict_verbatim; a_PROGRESS_of_the_series; the_agent's_reading_of_why⇒a_separate_FACT_by:agent_conf:tentative; the_next_GEN_line⇒a_proposal_the_owner_confirms"
:RL"where⇒the_delta_sits_beside_the_artifact_in_the_series_document; the_owner_has_a_memory_repository_under_MODULE::MEMORY⇒each_delta_is_one_line_in_log/_and_the_series_one_hand-off_item"
:RL"dataset⇒the_deltas_are_the_training_data; this_product_publishes_the_form,not_a_model; H1_a_generator_trained_on_deltas_follows_adh_closer,H2_fewer_iterations_to_the_owner's_approval,both_Status:untested"
:RL"task_done⇒one_line_action_score_S_two_decimals; full_JUDGE_on_request"
:FL"no_c2patool⇒XMP_sidecar_and_say_the_manifest_is_unsigned|a_file_without_a_chain⇒it_still_works_and_cannot_join_an_iteration_record|the_owner's_verdict_has_no_words⇒record_approved_or_rejected_only_never_a_reason_the_agent_supplies"
RD@{OWNER}wh=request CKwh=grammar_strict_and_f_v5 GN@IM WR@{ARTIFACT}pt=assertion CKwh=read_back LGwh=delta SO $
"::ILANG::v5.0"
```

## Where it goes

- An agent that generates images or video through an API: Paste this block into the instruction file it reads when it starts. It then writes every request as a GEN line, lets code compute the mode, seals both into the file with c2patool, and records the delta when the owner answers.
- A pipeline without an agent: The two validators of ilang-spec check the texts; c2patool writes and reads the assertion. The block is the contract the pipeline implements.
- A chat assistant with no tools: It can write the GEN line and the JUDGE block and hand them back as text. Sealing them into the file needs a tool on the owner's machine.
- A reader that only receives the file: c2patool reads the assertion; the GEN line and the JUDGE block are plain iLang and validate with the canon's code. No contact with the sender is needed.

Pasted into a chat, it covers that chat only. To have it every time, put it where instructions persist.

## Read it line by line

Line numbers are those of MEDIA-CHAIN.ilang.md.

1. `::ILANG::v5.0`
   The opening marker: what follows is an iLang document, protocol version 5.0.
2. `[TYPE:media_chain][ID:ILANG-MEDIA-CHAIN][VERSION:1.1][DATE:2026-11-15][LANG:en]`
   The header: a media-chain document named ILANG-MEDIA-CHAIN, version 1.1, dated 2026-11-15, in English.
3. `[FROM:@ai_chuhai][TO:@AGENT][STATUS:active]`
   From the author to the AI agent that loads it; the status is active.
4. `::STATE{@OWNER, kind:person, role:owner_of_the_artifacts, alias:the I in this chat}`
   Who the owner is: the person whose artifacts these are; "I" in the chat means the owner.
5. `::STATE{@ARTIFACT, kind:media_file, targets:IMG_VID_AUD_of_SPEC-v4.1_§5.4, request:one_GEN_line_of_SPEC-v4.1_§4.4, judgment:one_JUDGE_block_of_SPEC-v5.0_Part_II_§4}`
   What an artifact is: an image, video or audio file in the sense of SPEC-v4.1 §5.4, with one GEN line as its request and one JUDGE block as its judgment.
6. `::STATE{@CHAIN, kind:the_GEN_line_then_the_JUDGE_block_verbatim_UTF-8, label:ai.ilang.chain, before_the_platform_signs:a_PNG_text_chunk_or_XMP_inside_the_file, where_we_sign:one_C2PA_custom_assertion_in_JUMBF, no_C2PA_at_all:XMP_sidecar, reader:c2patool_and_any_PNG_or_XMP_reader}`
   What the chain is: the GEN line followed by the JUDGE block, verbatim UTF-8, under the label ai.ilang.chain. Where it lives depends on who signs: when the generator platform signs the file on download, the chain is written into the file before signing (a PNG text chunk or XMP) so the issuer credential binds it; when we sign, it is one C2PA custom assertion; with no C2PA at all, an XMP sidecar. c2patool reads the manifest; any PNG or XMP reader reads the chain.
7. `::STATE{@DELTA, kind:record_per_iteration, holds:keys_changed_old_to_new;dims_changed_old_to_new;the_owner's_verdict_verbatim, form:FACT_DECIDE_PROGRESS_only}`
   What a delta is: one record per iteration holding the keys that changed, the dimensions that changed and the owner's verdict verbatim, written with FACT, DECIDE and PROGRESS only.
8. `::STATE{@CODE, repo:github.com/ilang-ai/ilang-spec, judge:ilang_judge_validator.py --check, grammar:ilang_grammar_validator.py --lint --strict, media_bundle:runtime/ilang-media-latest.md}`
   Where the code is: the ilang-spec repository, the judge validator for JUDGE blocks, the grammar validator for everything else, the media runtime bundle.
9. `::GENE{media-chain|v:1.1|spec:ilang-v5.0+v4.1}`
   The genes of the product, version 1.1, on iLang v5.0 and the v4.1 media profile: the traits and the anti-patterns that follow.
10. `T:the_request_is_a_GEN_line_not_prose`
   A request for an image is written as a GEN line with registered keys, never as a paragraph.
11. `T:the_judgment_is_one_JUDGE_block_and_code_computes_its_mode`
   The judgment of the act of generating is one JUDGE block, and its mode is computed by code, not chosen by the model.
12. `T:both_travel_inside_the_file`
   The request and the judgment are stored in the artifact itself, so they survive copying.
13. `T:every_iteration_leaves_a_delta_and_the_owner's_verdict_verbatim`
   Each new version leaves a record of what changed and of what the owner said, in the owner's words.
14. `T:a_bad_image_is_a_diff_of_two_GEN_lines_and_two_V_lines`
   When a version is wrong, the agent compares the two GEN lines and the two vectors; the thing that moved is the cause to look at first.
15. `T:the_judge_keeps_the_judgment_and_a_generator_learns_only_the_20_keys`
   Judgment stays with the model that judges. A generator is taught only to follow the 20 keys; it is never taught to judge.
16. `A:a_mode_name_as_a_label_on_a_visual_attribute⇒no_mode_is_read_from_it,and_inside_R_it_is_a_word_of_the_reason,no_mode_is_read_from_it(the_canon's_own_case_B03,SPEC-v5.0_Appendix_D,writes_M2_not_M1_inside_R),while_inside_a_GEN_value_it_is_only_text(SPEC-v4.1_§4.4.2);the_only_mode_is_the_M_line_f_v5_computes;the_reference_validator_refuses_a_second_M_line_a_wrong_M_a_bad_V_and_an_extra_field_and_reads_R_for_length_only;what_it_passes_the_reader_does_not_refuse`
   A mode name used as a label on an attribute, M3 next to a composition or M5 next to a palette, gives no mode: nothing is read from it. Inside R it is a word of the reason and no mode is read from it: the canon's own case B03 in Appendix D of SPEC-v5.0 writes M2_not_M1 inside R. Inside a GEN value it is only text, because txt is the verbatim text on the artifact (SPEC-v4.1 §4.4.2): a BMW M3 inside txt is a car, and the block stands. The only mode is the M line, computed by f_v5. The reference judge validator refuses a second M line, a wrong M, a bad V and an extra field, and reads R for its length only; what it passes, the reader does not refuse.
17. `A:a_dimension_given_a_visual_meaning⇒labeling_drift_forbidden_by_Part_II_§1`
   Giving a dimension a visual meaning (consequence as emotional impact, authority as creative freedom) is labeling drift and is forbidden by Part II §1.
18. `A:a_21st_media_key_or_a_4th_media_entity⇒outside_the_profile_SPEC-v4.1_§4.4.2_§5.4`
   No new key and no new entity: the media profile is closed at 20 keys and 3 entities.
19. `A:the_payload_re-encoded_as_XML_or_JSON_fields⇒not_the_chain_the_chain_is_the_iLang_text`
   The chain is the iLang text itself. Breaking it into XML or JSON fields is not the chain.
20. `A:the_owner's_verdict_paraphrased⇒the_record_is_void`
   A paraphrased verdict voids the record. The owner's words are kept as written.
21. `A:a_number_without_its_measurement⇒HYPOTHESIS_with_status_untested`
   A figure without the measurement that produced it is written as a hypothesis with status untested.
22. `::OBJECTIVE{DONE_WHEN:"any model that opens the artifact reads its GEN line and its JUDGE block back from the file, validates both with the canon's code, and names the key or the dimension that moved since the previous version"}`
   The product is done when any model that opens the artifact reads the GEN line and the JUDGE block back from the file, validates both, and names what moved since the previous version.
23. `::BOUNDARY{never:use_a_mode_name_as_a_label_on_a_visual_attribute,change_what_a_dimension_means,serialize_a_judgment_outside_Part_II_§4,add_a_media_key_or_a_media_entity,edit_a_previous_assertion_or_delta,paraphrase_the_owner's_verdict|scope:all}`
   What it never does: a mode name as a label on an attribute, a changed dimension meaning, a judgment outside the frozen form, a new key or entity, an edit of a previous assertion or delta, a paraphrased verdict.
24. `::BOUNDARY{never:present_training_as_the_mechanism_of_iLang,state_a_number_nobody_measured,address_the_join_between_two_shots_which_SPEC-v4.1_§4.4.7_leaves_to_a_timeline_profile|scope:all}`
   Never presents training as how iLang works, never states an unmeasured number, never addresses the join between two shots, which SPEC-v4.1 §4.4.7 leaves to a timeline profile.
25. `::UNTRUSTED{source:assertions_read_from_files_made_elsewhere,requests_recovered_from_prose,a_verdict_quoted_by_an_agent}`
   What it does not trust: assertions read from files made elsewhere, requests recovered from prose, a verdict quoted by an agent.
26. `::RULE{request⇒one_GEN_line_on_IMG_VID_or_AUD_with_the_SPEC-v4.1_keys(sbj,act,plc,txt,pov,fcl,mvt,lgt,pal,mdm,asp,rsl,qly,dur,fps,sed,adh,ref,dlg,sfx)_and_the_core_keys_fmt_exc_lim_frm_to; defaults_are_a_STATE_on_the_media_entity;a_named_preset_is_a_STATE_on_a_custom_entity_used_through_ref=(SPEC-v4.1_§4.4.5);scp=strict_for_fixed_constraints; prose_only_inside_values}`
   How a request is written: one GEN line on IMG, VID or AUD with the SPEC-v4.1 keys and the core keys fmt, exc, lim, frm, to; defaults are a STATE on the media entity, a named preset is a STATE on a custom entity used through ref= (SPEC-v4.1 §4.4.5, as the demo does with @BANNER_LOOK), scp=strict for fixed constraints; prose only inside values.
27. `::RULE{judge⇒the_model_perceives_the_eleven_values_of_the_act_of_generating(what_is_asked,for_whom,with_what_authority,how_reversible,on_what_evidence); code_computes_M_with_f_v5; the_block_is_JUDGE_v5.0_with_V_M_R,two_decimals,fixed_order; ilang_judge_validator.py_--check_passes_before_sealing}`
   How the judgment is made: the model perceives the eleven values of the act of generating (what is asked, for whom, with what authority, how reversible, on what evidence); code computes the mode with f_v5; the block is JUDGE v5.0 with V, M and R, two decimals, fixed order; the judge validator passes before sealing.
28. `::RULE{seal⇒the_chain_is_the_GEN_line_then_the_JUDGE_block,UTF-8_verbatim; the_generator_platform_signs_the_file_on_download⇒the_chain_goes_in_before_signing,as_the_PNG_text_chunk_ai.ilang.chain_or_as_XMP,so_the_issuer_credential_binds_it,because_a_manifest_added_after_signing_becomes_the_active_one_and_demotes_the_issuer_manifest_to_an_ingredient; we_are_the_signer⇒one_C2PA_assertion_ai.ilang.chain_per_artifact; no_C2PA_at_all⇒XMP_sidecar_with_the_same_two_texts; a_regenerated_artifact⇒its_own_chain,the_previous_one_untouched; video⇒one_chain_per_artifact,a_scene_is_an_artifact_when_it_is_its_own_GEN}`
   How the chain is sealed: the chain is the GEN line then the JUDGE block, verbatim. When the generator platform signs the file on download, the chain goes in before signing, as the PNG text chunk ai.ilang.chain or as XMP, so the issuer credential binds it; a manifest added after signing would become the active one and demote the issuer manifest to an ingredient, which is what the second tester run showed. When we are the signer, one C2PA assertion ai.ilang.chain per artifact; with no C2PA at all, an XMP sidecar. A regenerated artifact gets its own chain and the previous one is untouched; one chain per video artifact, a scene being an artifact when it is its own GEN.
29. `::RULE{read⇒the_chain_is_read_from_the_text_chunk,the_XMP_or_the_assertion,whichever_the_file_carries,c2patool_for_the_manifest; the_GEN_line_passes_ilang_grammar_validator_--strict,the_JUDGE_block_passes_ilang_judge_validator_--check; either_fails⇒the_artifact_has_no_chain,say_so; a_mode_token_inside_R_or_a_GEN_value⇒only_text,no_mode_is_read_from_it,the_block_stands; the_mode_is_the_M_line_only}`
   How a chain is read: from the text chunk, the XMP or the assertion, whichever the file carries, with c2patool for the manifest; the GEN line passes the grammar validator in strict mode and the JUDGE block passes the judge validator; if either fails the artifact has no chain, and the agent says so; a mode token inside R or inside a GEN value is only text, no mode is read from it and the block stands; the mode is the M line only.
30. `::RULE{delta⇒per_iteration:a_FACT_with_the_keys_that_changed_from_and_to,a_FACT_with_the_dimensions_that_changed_from_and_to,both_by:agent; a_DECIDE_of_the_owner_with_the_verdict_verbatim; a_PROGRESS_of_the_series; the_agent's_reading_of_why⇒a_separate_FACT_by:agent_conf:tentative; the_next_GEN_line⇒a_proposal_the_owner_confirms}`
   How a delta is recorded: a FACT with the keys that changed, a FACT with the dimensions that changed, both by the agent; a DECIDE of the owner with the verdict verbatim; a PROGRESS of the series; the agent's reading of why is a separate FACT marked tentative; the next GEN line is a proposal the owner confirms.
31. `::RULE{where⇒the_delta_sits_beside_the_artifact_in_the_series_document; the_owner_has_a_memory_repository_under_MODULE::MEMORY⇒each_delta_is_one_line_in_log/_and_the_series_one_hand-off_item}`
   Where the delta lives: beside the artifact in the series document; when the owner keeps a memory repository under MODULE::MEMORY, each delta is one line in log/ and the series one hand-off item.
32. `::RULE{dataset⇒the_deltas_are_the_training_data; this_product_publishes_the_form,not_a_model; H1_a_generator_trained_on_deltas_follows_adh_closer,H2_fewer_iterations_to_the_owner's_approval,both_Status:untested}`
   What the deltas are for: they are the training data; this product publishes the form, not a model; two hypotheses are named and both have status untested.
33. `::RULE{task_done⇒one_line_action_score_S_two_decimals; full_JUDGE_on_request}`
   When a task ends, one line gives the action score S to two decimals; the full JUDGE block on request (PRODUCT-4).
34. `::FALLBACK{no_c2patool⇒XMP_sidecar_and_say_the_manifest_is_unsigned|a_file_without_a_chain⇒it_still_works_and_cannot_join_an_iteration_record|the_owner's_verdict_has_no_words⇒record_approved_or_rejected_only_never_a_reason_the_agent_supplies}`
   What happens at the edges: no c2patool means an XMP sidecar and a stated unsigned manifest; a file without a chain still works but cannot join an iteration record; a verdict without words is recorded as approved or rejected only, never with a reason the agent supplies.
35. `[READ:@OWNER|whr=request]=>[CHEK|whr=grammar_strict_and_f_v5]=>[GEN:@IMG]=>[WRIT:@ARTIFACT|path=assertion]=>[CHEK|whr=read_back]=>[LOG|whr=delta]=>[SCOR]=>[Ω]`
   The operation chain: read the request, check grammar and f_v5, generate, write the assertion, read it back, log the delta, score, end.
36. `::ILANG::v5.0`
   The closing marker.

## The demo

claude-signed-with-chain-2026-11-15.png (sha256 0c04d14bb56d7cb8ca7d0fcc7e183138e63255a7da19f42a8d4c890df44887c6) was made through the Claude API code execution tool and downloaded through the Files API; the v1 chain of SERIES-001 was written as the PNG text chunk ai.ilang.chain inside the sandbox before the platform signed it. c2patool reads one manifest, issuer Anthropic, validation state Valid; the chunk is byte-identical to the v1 payload, 463 bytes; change M1 to M3 inside it and the signature fails. The same request without the chunk is claude-signed-2026-11-15.png (sha256 59d1f39db15982bb287dd2882ac5da5cc3c6152ef0d4e317bebb3629b8520253). The tester's findings are stored verbatim at https://github.com/ilang-ai/ilang-spec/blob/main/products/media-chain/records/TESTER-GROKBOT-2026-11-15.ilang.md.

SERIES-001 (https://github.com/ilang-ai/ilang-spec/blob/main/products/media-chain/demo/SERIES-001.ilang.md) is a worked series of three versions of one banner. Each version shows the exact payload of its chain: one GEN line, then one JUDGE block whose mode the reference f_v5 computes from its vector. Between versions the delta FACTs name what moved: from v1 to v2 only keys moved, a real screenshot became an illustration, and the mode stayed M1; from v2 to v3 the subject, the medium, the text and the exclusion list moved, the request began to name a third party, authority and externality dropped and the mode moved to M2. The verdicts in the series are placeholders until the owner writes his own words on his own images (item C13). BAD-001 (https://github.com/ilang-ai/ilang-spec/blob/main/products/media-chain/demo/BAD-001.ilang.md) is the negative test: six blocks, each with one defect the judge validator refuses, a second M line, three dimensions, one decimal, a ninth mode, a mode that does not match its vector, an extra field (item C9).

## Acceptance

Fifteen items in https://github.com/ilang-ai/ilang-spec/blob/main/products/media-chain/ACCEPTANCE.ilang.md, run by goal-check of ilang-conformance; thirteen pass, two wait for a person, as of 2026-11-15. The author confirms nothing of its own work: a human item passes only on an evidence line written by a tester, stored verbatim in records/ and read from there.

- C1 to C9: grammar in strict mode, the IML round trip, the pinned hashes, the length, the site check, the demo series through both validators, the negative test refused: all pass.
- C10, C11: the three payloads sealed with c2patool and read back byte for byte; the signed demo PNG validated with its chain inside: pass, on the tester's own evidence lines.
- C12: a blind read of the three payloads: waits for a reader who has not seen the delta FACTs.
- C13: the owner's own verdicts on his own images: waits for the owner.
- C14, C15: the two signed demo files unchanged, by sha256: pass.

## iLang or IML

Paste the iLang block, written for people and models. The IML block is the same document compiled for programs with the IML 0.6 reference codec (https://github.com/ilang-ai/iml-protocol). It decompiles to the iLang text; the acceptance items check both ways.

## Questions

**Why does the chain go into the file before the platform signs it?** Because a signature covers what is inside the file when it is made. The demo PNG was signed by the Claude platform on download; the chain was written as the PNG text chunk ai.ilang.chain inside the sandbox before that, so the Anthropic credential covers the chunk: c2patool validates the manifest, and changing one letter of the mode inside the chunk fails the signature (assertion.dataHash.mismatch). Adding our own manifest to an already signed file does the opposite: ours becomes the active manifest and the issuer's is demoted to an ingredient.

**Who confirms the acceptance items?** Not the author. The items code can run are run by goal-check, and the two that need a person pass only on an evidence line written by someone other than the author, a tester or a CI run, stored verbatim in the records directory and read by goal-check from there. That is PRODUCT-3 of the canon: the one who did the work does not confirm its own items.

**Why not put the judgment chain in a JSON schema of its own?** Because the chain is the iLang text. The two validators already check it; a second schema would be a second truth. C2PA carries arbitrary assertion payloads, so the text goes in as it is.

**Why are the eleven dimensions not about the look of the image?** Because they never were. They judge the act of generating: who asked, with what authority, how reversible, on what evidence, with what effect on third parties. The look is the business of the 20 media keys. Mixing the two makes the chain unreadable and the canon forbids it (Part II §1).

**Does this train a model?** No. It produces the records a training set would need and publishes their form. Whether training on them helps is written as two hypotheses with status untested, and stays that way until someone measures.

**What about video transitions?** Outside this product. SPEC-v4.1 §4.4.7 records transitions between shots as the business of a timeline profile that does not exist yet.

**Can I change it?** Yes. The license is MIT. To check that your edit is still valid iLang, run the canon grammar validator in strict mode and the judge validator on any JUDGE block: both are in ilang-spec. The released text is the one whose sha256 the acceptance file names.

## Feedback

Found a case where it fails? File a counterexample: https://github.com/ilang-ai/ilang-research/issues/new?template=counterexample.yml

Want a rule changed? File an amendment with the fix: https://github.com/ilang-ai/ilang-research/issues/new?template=amendment.yml

Both run the gates the canon defines and are recorded verbatim at research (https://github.com/ilang-ai/ilang-research/tree/main/records); nothing is merged by a machine.

Want the files? https://github.com/ilang-ai/ilang-spec/tree/main/products/media-chain (the product, its IML form, the acceptance items, the demo series and the signed PNG files)

Want the agent to keep the series? See Memory: https://ilang.ai/memory/

Want a persona for the agent? See SOUL: https://ilang.ai/soul/
