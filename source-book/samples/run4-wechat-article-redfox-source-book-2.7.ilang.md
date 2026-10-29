::ILANG::v5.0::ENGINEERING_BOOK
[TYPE:engineering_book][ID:CLOUDFLARE-PAGES-STATIC-SITE][VERSION:1.1][DATE:2026-10-29][LANG:en][RUNTIME:2026.10.25-082851760176]

::STATE{@USER, role:site_owner, has:a_static_site_in_a_git_repository_and_a_domain_under_control, gives:the_repository_the_domain_and_the_last_decision, does:authorize_account_and_pay}
::STATE{@AGENT, role:the_owner_s_AI_in_this_app, can:git_shell_web_and_a_browser, does:push_connect_deploy_bind_verify_report, never:registers_an_account_or_pays_for_the_owner}
::STATE{@TOOLS, first:git_and_the_Cloudflare_dashboard_in_a_browser, second:web_fetch_to_read_a_doc_or_a_live_address}

::OBJECTIVE{id:g1|owner:@USER|trust:trusted|version:1|status:active}
  target: the site in FILL_REPO at FILL_BRANCH is served from a Cloudflare Pages project on the custom domain FILL_DOMAIN over https
  ACCEPT: every item of RUBRIC passes
  NON_GOALS: writing the site content, buying a domain, choosing a registrar
  DONE_WHEN: the REPORT is sent in FILL_LANG with the score line last

::BOUNDARY{never:type_a_password_a_token_or_a_verification_code_into_any_field|scope:permanent}
::BOUNDARY{never:write_or_print_a_secret_in_a_file_a_commit_or_a_message|scope:permanent}
::BOUNDARY{never:delete_or_rewrite_the_owner_s_repository|scope:permanent}
::BOUNDARY{never:create_a_domain_record_the_dashboard_says_it_writes_itself|scope:permanent}
::BOUNDARY{never:promise_traffic_ranking_or_uptime|scope:permanent}

::RULE{a_repository_that_already_holds_the_finished_files_needs_no_build_command|conf:confirmed}
  url:https://developers.cloudflare.com/pages/configuration/build-configuration/
::RULE{a_custom_domain_is_added_inside_the_Pages_project_and_a_zone_this_account_holds_gets_its_records_written_by_the_dashboard|conf:confirmed}
  url:https://developers.cloudflare.com/pages/configuration/custom-domains/

::MODULE{INPUT|title:what_the_owner_must_supply}
  [LINE] FILL_REPO is the git repository as owner/name.
  [LINE] FILL_REPO_FOLDER is the local clone whose root holds index.html.
  [LINE] FILL_BRANCH is the branch that holds the site.
  [LINE] FILL_PROJECT is the Pages project name, lowercase, no spaces.
  [LINE] FILL_DOMAIN is the custom domain the owner controls.
  [LINE] FILL_EXPECT is a phrase that must appear on the served page.
  [LINE] FILL_LANG is the language the owner reads.
  [LINE] FILL_SCORE is the f_v5 STEP-4 score of this run to two decimals.

::MODULE{HOW|title:what_the_agent_does_in_order}
  [STEP] 1 CHECK that FILL_REPO_FOLDER at FILL_BRANCH holds index.html at its root, and stop with one sentence in FILL_LANG if it does not. Expect the file present.
  [STEP] 2 PUSH the site to FILL_REPO on FILL_BRANCH and keep the commit id. Expect the remote to accept the commit that holds the site.
  [STEP] 3 OPEN dash.cloudflare.com, then Workers and Pages, then Pages, then Create application, then Connect to Git, and pick FILL_REPO. Expect an authorization screen the owner approves once.
  [STEP] 4 FILL Project name with FILL_PROJECT and Production branch with FILL_BRANCH, leave Build command and Build output directory empty because nothing is built, then choose Save and Deploy. Expect a first deployment queued.
  [STEP] 5 WAIT for that deployment and keep its state, then open the preview address at FILL_PROJECT.pages.dev. Expect the home page, or a page saying nothing is here yet when index.html is not at the root.
  [STEP] 6 OPEN Custom domains, choose Set up a custom domain, and type FILL_DOMAIN. Expect the panel to ask for the name servers of that domain to move to this account.
  [STEP] 7 MOVE the name servers as the panel asks, then wait. Expect the dashboard to write the records itself, so no record is added by hand, and to issue the certificate.
  [STEP] 8 FETCH https://FILL_DOMAIN and find FILL_EXPECT in the body over https, then open the same address in a private window and read the largest contentful paint. Expect the phrase on a page that paints quickly.

::MODULE{REPORT|title:the_six_lines}
  [LINE] one sentence in FILL_LANG on what went live and where.
  [LINE] the project, the repository and the branch as submitted.
  [LINE] the commit id and the final state of the deployment that served it.
  [LINE] the preview address and whether FILL_EXPECT was found there.
  [LINE] the custom domain and its state, or the name server step the owner still owes.
  [LINE] S=FILL_SCORE

::RUBRIC{A1: index.html sits at the root of FILL_REPO_FOLDER|check:file|path:"FILL_REPO_FOLDER/index.html"}
::RUBRIC{A2: the preview address serves FILL_EXPECT over https|check:links|url:"https://FILL_PROJECT.pages.dev/"|contains:"FILL_EXPECT"}
::RUBRIC{A3: FILL_DOMAIN serves FILL_EXPECT over https with a verified certificate|check:cmd|run:"curl -sS -o NUL -w %{ssl_verify_result} https://FILL_DOMAIN/"|expect:0}
::RUBRIC{A4: the deployment that served the domain names the pushed commit|check:human}
::RUBRIC{A5: no password or token was typed, stored or reported|check:human}

::FALLBACK{no_browser then ask_the_user_to_run_the_same_step_in_the_dashboard_and_paste_the_result|index_missing then report_the_missing_path_and_ask_which_branch_holds_the_site|deploy_failed then report_the_failing_log_line_word_for_word|no_GitHub_app then ask_the_user_to_authorize_the_Cloudflare_GitHub_app_once|domain_not_on_this_account then ask_the_user_to_move_the_name_servers_and_wait|name_server_change_refused then stop_and_ask_the_user|plan_change then stop_and_ask_the_user}
::PRIORITY{
  user_decision > BOUNDARY > OBJECTIVE > RUBRIC > RULE
}
::ILANG::v5.0::ENGINEERING_BOOK
