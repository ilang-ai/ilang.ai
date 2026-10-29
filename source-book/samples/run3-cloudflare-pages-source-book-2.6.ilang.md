::ILANG::v5.0::ENGINEERING_BOOK
[TYPE:engineering_book][ID:CLOUDFLARE-PAGES-STATIC-SITE][VERSION:1.0][DATE:2026-10-29][LANG:en][RUNTIME:2026.10.25-082851760176]

::STATE{@USER, role:site_owner, gives:the_repository_the_domain_and_the_last_decision, does:authorize_and_pay}
::STATE{@AGENT, role:the_user_s_AI_in_this_app, can:web_search_web_fetch_shell_files_and_a_browser, does:connect_deploy_verify_report}
::STATE{@TOOLS, first:the_Cloudflare_dashboard_or_the_REST_API_when_CLOUDFLARE_API_TOKEN_is_set, second:web_search_and_web_fetch_to_check_a_doc_or_a_live_address}

::OBJECTIVE{id:g1|owner:@USER|trust:trusted|version:1|status:active}
  target: the GitHub repository FILL_REPO is served as a live static site from a Cloudflare Pages project on the custom domain FILL_DOMAIN
  ACCEPT: every item of RUBRIC passes
  NON_GOALS: writing the site content, buying a domain, choosing where DNS is hosted
  DONE_WHEN: the REPORT is sent as REPORT says

::BOUNDARY{never:type_a_password_a_token_or_a_verification_code_into_any_field|scope:permanent}
::BOUNDARY{never:write_or_print_a_secret_in_a_file_a_commit_or_a_message|scope:permanent}
::BOUNDARY{never:delete_or_rewrite_the_user_s_repository|scope:permanent}
::BOUNDARY{never:change_a_DNS_record_the_domain_does_not_need|scope:permanent}
::BOUNDARY{never:promise_traffic_ranking_or_uptime|scope:permanent}

::RULE{a_repository_that_already_holds_the_finished_files_needs_no_build_command|conf:confirmed}
  url:https://developers.cloudflare.com/pages/configuration/build-configuration/
::RULE{a_custom_domain_is_added_in_the_Pages_project_then_a_CNAME_points_it_at_the_pages_dev_host|conf:confirmed}
  url:https://developers.cloudflare.com/pages/configuration/custom-domains/
  an_apex_domain_must_be_a_zone_on_this_account; a_subdomain_can_point_its_CNAME_from_any_registrar

::MODULE{INPUT|title:what_the_user_must_supply}
  [LINE] FILL_REPO is the GitHub repository as owner/name.
  [LINE] FILL_BRANCH is the branch to publish.
  [LINE] FILL_PROJECT is the Pages project name.
  [LINE] FILL_DOMAIN is the custom domain.
  [LINE] FILL_EXPECT is a phrase that must appear on the served page.

::MODULE{HOW|title:what_the_agent_does_in_order}
  [STEP] 1 VERIFY that FILL_REPO at FILL_BRANCH holds a public folder at its root with an index file. Expect both present.
  [STEP] 2 CREATE a Pages project named FILL_PROJECT linked to the GitHub repository FILL_REPO with production branch FILL_BRANCH. Expect the build settings with the build command empty and the output directory public, and a first deployment queued.
  [STEP] 3 WAIT for the first production deployment of FILL_PROJECT to report success and keep its id. Expect success, or the failing log line when it fails.
  [STEP] 4 FETCH the deployment address and find FILL_EXPECT in the body. Expect the phrase on an https page.
  [STEP] 5 ADD FILL_DOMAIN to the custom domains of FILL_PROJECT. Expect the domain row in a pending state.
  [STEP] 6 CREATE the CNAME record the dashboard names, from FILL_DOMAIN to the pages.dev host. Expect the record saved at the DNS provider.
  [STEP] 7 WAIT for FILL_DOMAIN to turn active and fetch it. Expect FILL_EXPECT on an https page.
  [STEP] 8 SEND the REPORT. Expect six lines, the score last.

::MODULE{REPORT|title:the_six_lines}
  [LINE] one sentence on what was deployed.
  [LINE] the project name, the repository and the branch as they were submitted.
  [LINE] the deployment id and its final state.
  [LINE] the deployment address and whether FILL_EXPECT was found there.
  [LINE] the custom domain and its state, or the DNS record still missing.
  [LINE] S= then the f_v5 STEP-4 action score of this run to two decimals.

::RUBRIC{A1: a Pages project exists and is linked to the repository|check:status}
::RUBRIC{A2: the newest production deployment reports success|check:json}
::RUBRIC{A3: the deployment address serves FILL_EXPECT over https|check:links}
::RUBRIC{A4: FILL_DOMAIN serves FILL_EXPECT over https|check:links}
::RUBRIC{A5: no password or token was typed, stored or reported|check:human}
::RUBRIC{A6: the report states only what the run saw and promises nothing|check:human}

::FALLBACK{no_browser_and_no_token then ask_the_user_to_run_the_same_step_in_the_dashboard_and_paste_the_result|public_folder_missing then report_the_missing_path_and_ask_which_folder_holds_the_site|build_failed then report_the_failing_log_line_word_for_word|no_GitHub_app then ask_the_user_to_authorize_the_Cloudflare_GitHub_app_once|domain_not_on_Cloudflare then add_the_CNAME_at_the_registrar_and_wait|plan_change then stop_and_ask_the_user}
::PRIORITY{
  user_decision > BOUNDARY > OBJECTIVE > RUBRIC > RULE
}
::ILANG::v5.0::ENGINEERING_BOOK
