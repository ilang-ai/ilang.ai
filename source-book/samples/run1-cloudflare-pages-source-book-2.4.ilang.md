::ILANG::v5.0::ENGINEERING_BOOK
[TYPE:engineering_book]
[ID:STATIC-REPO-TO-PAGES-SITE]
[VERSION:1.0]
[LANG:en]
[DATE:2026-10-29]
[RUNTIME:2026.10.25-082851760176]

::STATE{@USER, role:decision_maker, does:fill_INPUT_and_authorize, owns:OBJECTIVE_g1}
::STATE{@AGENT, role:the_user_s_own_AI, can:shell_http_and_git, does:create_verify_and_report, never:print_a_secret}
::STATE{@PAGES, role:the_platform, does:build_serve_and_hold_the_domain}

::OBJECTIVE{id:g1|owner:user|trust:trusted|version:1|status:active}
  target: FILL_REPO is published by the Pages project FILL_PROJECT and answers over HTTPS at FILL_HOST
  ACCEPT: every item of RUBRIC passes
  NON_GOALS: editing site content, restyling the site, buying a paid plan, changing DNS that does not name FILL_HOST
  DONE_WHEN: RUBRIC passes and REPORT was printed

::STATE{@INPUT}
  FILL_REPO: GitHub owner and repository name that holds the static files
  FILL_BRANCH: branch whose latest commit is to be published
  FILL_ROOT: repository directory that holds the site files, a dot when they sit at the top
  FILL_BUILD: build command, empty when the files need no build step
  FILL_OUTPUT: directory the build writes, relative to FILL_ROOT, a dot when nothing is built
  FILL_PROJECT: name for the Pages project, lowercase and not yet used in the account
  FILL_HOST: hostname the site must answer on
  FILL_ZONE: DNS zone that owns FILL_HOST and sits in the same account
  FILL_TOKEN_VAR: name of the environment variable that holds the API token, never its value
  FILL_ACCOUNT_VAR: name of the environment variable that holds the account id, never its value

::BOUNDARY{never:print_store_or_send_the_token_value|scope:permanent}
::BOUNDARY{never:delete_the_repository_or_any_branch_of_it|scope:permanent}
::BOUNDARY{never:write_a_DNS_record_that_does_not_name_FILL_HOST|scope:permanent}
::BOUNDARY{never:place_a_credential_in_the_repository_or_the_site|scope:permanent}

::RULE{
  request_and_response_shapes_follow_the_official_Pages_API_reference
  source:https://developers.cloudflare.com/pages/configuration/api/
}

::MODULE::HOW{
  [STEP] 1 read FILL_ACCOUNT_VAR and FILL_TOKEN_VAR from the environment; expect two non-empty values; a missing one: stop and ask the user for it, never echo a value
  [STEP] 2 resolve FILL_ZONE to its zone id in that account; expect the zone whose name is the suffix of FILL_HOST; an authorization error: stop and ask for a token with Pages write and DNS write on FILL_ZONE
  [STEP] 3 read FILL_REPO at FILL_BRANCH and list FILL_OUTPUT under FILL_ROOT; expect an index document; missing: stop and name the path that was tried
  [STEP] 4 create the Pages project FILL_PROJECT from FILL_REPO with production branch FILL_BRANCH, root FILL_ROOT, build command FILL_BUILD and output FILL_OUTPUT; expect a project id; a report that the GitHub app is not installed: give the user the one install link and stop
  [STEP] 5 poll the production deployment of FILL_PROJECT; expect stage success; a failure: read the build log, report its first error and stop
  [STEP] 6 read the subdomain field of the project over HTTPS; expect the index document; a mismatch: stop before any domain work
  [STEP] 7 attach FILL_HOST to FILL_PROJECT; expect a pending domain and the validation record it carries
  [STEP] 8 point that record at the project subdomain in FILL_ZONE, reusing the record the platform already made and touching no other record, then poll FILL_HOST; expect domain status active, then print REPORT
}

::RUBRIC{
  A1: the book opens and closes with the marker|check:count|path:BOOK.md|regex:"(?m)^::ILANG::v5\.0::ENGINEERING_BOOK$"|expect:2
  A2: the grammar validator reports zero errors|check:cmd|run:"python ilang_grammar_validator.py --lint BOOK.md --strict"|expect:0
  A3: the project exists in the account|check:json|get:pages project FILL_PROJECT|expect:id
  A4: the production deployment succeeded|check:status|get:latest production deployment of FILL_PROJECT|expect:success
  A5: the custom domain is active|check:status|get:custom domain FILL_HOST on FILL_PROJECT|expect:active
  A6: the site answers with the index document|check:cmd|run:"curl -sS https://FILL_HOST"|expect:the index document
  A7: no token value appears in any output|check:human
  A8: REPORT has six lines and the last one carries the score|check:count|path:REPORT|expect:6
}

::MODULE::REPORT{
  [LINE] 1 project FILL_PROJECT, its id and its production branch
  [LINE] 2 deployment id and stage
  [LINE] 3 the documents served from the project subdomain
  [LINE] 4 custom domain FILL_HOST and its status
  [LINE] 5 DNS record id written into FILL_ZONE
  [LINE] 6 score S=<the f_v5 STEP-4 action score to two decimals>
}

::FALLBACK{no_http_or_no_token ⇒ ask_the_user_to_paste_the_project_summary_and_stop}

::PRIORITY{
  user_decision > BOUNDARY > OBJECTIVE > RUBRIC > RULE
}
::ILANG::v5.0::ENGINEERING_BOOK
