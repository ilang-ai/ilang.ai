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
