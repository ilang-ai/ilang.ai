::ILANG::v5.0::ENGINEERING_BOOK
[TYPE:engineering_book][ID:IMPACT-MEDIA-ONBOARD][VERSION:1.0][DATE:2026-10-29][LANG:en][RUNTIME:2026.10.25-082851760176]

::STATE{@USER, role:decision_maker, gives:the_site_the_brand_and_the_last_decision, does:authorize_and_pay}
::STATE{@AGENT, role:the_user_s_AI_in_this_app, can:web_search_web_fetch_shell_files, does:fill_submit_check_report}
::STATE{@TOOLS, first:the_agent_s_own_web_search_and_web_fetch, fallback:ask_the_user_to_paste_the_page_text}

::OBJECTIVE{id:g1|owner:@USER|trust:trusted|version:1|status:active}
  target: the user holds a working media account on the Impact affiliate network, the user's site carries a visible review state, and every brand the user chose shows a recorded application state
  ACCEPT: every item of RUBRIC passes
  NON_GOALS: choosing the user's niche, writing the user's content, promising any result
  DONE_WHEN: the REPORT is sent as REPORT says

::BOUNDARY{never:type_a_password_a_token_or_a_verification_code_into_any_field|scope:permanent}
::BOUNDARY{never:promise_or_predict_approval_traffic_or_return|scope:permanent}
::BOUNDARY{never:use_a_number_a_price_or_a_claim_from_the_guide_without_a_source|scope:permanent}
::BOUNDARY{never:pay_or_subscribe_before_the_user_says_go|scope:permanent}

::RULE{the_media_partner_sign_up_is_free_and_runs_on_the_official_impact_page|conf:confirmed}
  url:https://impact.com/partners/affiliate-partners/
::RULE{approval_is_decided_by_the_network_and_by_each_brand|conf:confirmed}
  the_agent_records_the_state_it_sees_and_forecasts_nothing

::MODULE{INPUT|title:what_the_user_must_supply}
  [LINE] FILL_SITE is the website or channel the user will register.
  [LINE] FILL_TRAFFIC is where that site gets its visitors, in one short phrase.
  [LINE] FILL_EMAIL is the address for the new account.
  [LINE] FILL_BRAND is the first brand the user wants to work with.
  [LINE] FILL_PITCH is how the site will present that brand.
  [LINE] FILL_FOLDER is the folder where the agent keeps its notes.

::MODULE{HOW|title:what_the_agent_does_in_order}
  [STEP] 1 READ the page at the url in the first RULE and open its partner sign up form. Expect a form that asks for a site.
  [STEP] 2 FILL the form with FILL_SITE, FILL_TRAFFIC and FILL_EMAIL, then submit it. Expect a confirmation and a dashboard.
  [STEP] 3 SUBMIT the site for review wherever the dashboard offers it. Expect a review state on the site row.
  [STEP] 4 RE-CHECK that state on every return and copy the exact wording. Expect pending, approved or rejected with a reason.
  [STEP] 5 SEARCH the brand marketplace for FILL_BRAND. Expect a result list or an empty state.
  [STEP] 6 APPLY to each matching brand with FILL_PITCH. Expect one application record per brand with a state.
  [STEP] 7 SAVE each approved tracking link and its placement note under FILL_FOLDER. Expect one note per brand.
  [STEP] 8 SEND the REPORT. Expect six lines and a score line last.

::MODULE{REPORT|title:the_six_lines}
  [LINE] one sentence on what was done.
  [LINE] the account state and the site review state, in the dashboard's own words.
  [LINE] the FILL_ values that were submitted, and nothing else.
  [LINE] each RUBRIC item marked pass or fail.
  [LINE] the decision the user must make next, or the sentence no decision is open.
  [LINE] S= then the f_v5 STEP-4 action score of this run to two decimals.

::RUBRIC{A1: an account exists and the dashboard opens for the user|check:status}
::RUBRIC{A2: the site shows a review state in the dashboard|check:status}
::RUBRIC{A3: every brand the agent applied to shows an application state|check:status}
::RUBRIC{A4: every value submitted came from a FILL_ field and none was invented|check:human}
::RUBRIC{A5: the report states the current state and the next action and promises nothing|check:human}

::FALLBACK{no_web_tool then ask_the_user_to_open_the_page_and_paste_its_text|form_changed then re-read_the_form_and_retry_once|review_says_rejected then report_the_reason_word_for_word_and_ask_for_another_brand|verification_mail then ask_the_user_to_open_it_and_confirm|blocked_account then stop_and_report_the_exact_message}
::PRIORITY{
  user_decision > BOUNDARY > OBJECTIVE > RUBRIC > RULE
}
::ILANG::v5.0::ENGINEERING_BOOK
