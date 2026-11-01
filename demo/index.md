# iLang Book Demo: two recorded runs of the Source Book

Two real runs of the Source Book, recorded on 2026-10-30 and replayed here exactly as the engine streamed them: every tool call, every pause while the model thinks, every word of its reply. A pasted tutorial and one Xiaohongshu link each become BOOK.md, an English iLang engineering book any agent can carry out. Nothing runs on this page: no model, no key, no input of yours.

Page: https://ilang.ai/demo/ . Recorded 2026-10-30 with Source Book 2.8 on deepseek-flash; the current Source Book is 2.9 (https://ilang.ai/source-book/), which adds only the feedback entry.

## Run 1: A pasted tutorial

Input, pasted as text:

```text
How to publish a static site on Cloudflare Pages from a GitHub repository

1. Push your site to a GitHub repository. The site is plain HTML, CSS and JS in the repository root, with an index.html at the top level.
2. In the Cloudflare dashboard open Workers & Pages, choose Create, then Pages, then Connect to Git. Authorize Cloudflare to read the repository and pick it.
3. In the build settings leave the framework preset at None, leave the build command empty and set the build output directory to / (the repository root). Save and deploy.
4. Wait for the first build to finish. The project gets an address like your-project.pages.dev. Open it and check that index.html is served.
5. To use your own domain, open the project's Custom domains tab, add the domain, and let Cloudflare create the CNAME record in your zone. Wait until the status shows Active.
6. From now on every push to the production branch triggers a new deployment; every other branch gets a preview address.
```

Tool calls, in order:

- model call 1 · web_fetch · https://runtime.ilang.app/manifest.json · 0.0 s
- model call 1 · web_fetch · https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/ilang_grammar_validator.py · 0.0 s
- model call 2 · web_fetch · https://runtime.ilang.app/ilang-latest.md · 0.0 s
- model call 3 · read_file · ilang_grammar_validator.py · 0.0 s
- model call 4 · web_search · Cloudflare Pages build output directory framework preset None site:developers.cloudflare.com · 0.5 s
- model call 4 · web_search · Cloudflare Pages preview deployments production branch custom domain CNAME site:developers.cloudflare.com · 0.5 s
- model call 5 · save_file · BOOK.md · 0.0 s
- model call 6 · run_command · python ilang_grammar_validator.py --lint BOOK.md --strict · 0.1 s

Result: 7 model calls · 1 min 23 s · 194,537 prompt tokens, 84% cached · about ¥0.10 of tokens · S=0.89

Validator (exit code 0):

```text
BOOK.md: 0 error(s), 0 warning(s) | mode=raw fences linted=0 skipped=0 annotations=0

TOTAL: 0 error(s), 0 warning(s) in 1 file(s)
```

BOOK.md:

```text
::ILANG::v5.0::ENGINEERING_BOOK
[TYPE:engineering_book]
[ID:METHOD-CF-PAGES-FROM-GITHUB]
[VERSION:1.0]
[DATE:2026-10-29]
[LANG:en]

::STATE{@USER, role:site_owner, has:a_cloudflare_account_and_a_github_account, may_have:a_domain_already_in_cloudflare, does:decide_authorize_pay}
::STATE{@AGENT, role:the_user_s_own_AI, can:shell_git_browser, does:prepare_push_click_through_the_dashboard_verify, never:runs_a_step_before_the_user_says_go}
::STATE{@RUNTIME, version:2026.10.25-082851760176, note:the_iLang_runtime_this_book_was_written_against_and_its_grammar_wins_over_this_text}

::OBJECTIVE{id:g1|owner:user|trust:trusted|version:1|status:active}
  target: the plain site in FILL_SITE_DIR is published from FILL_REPO by Cloudflare Pages and answers at its pages.dev address, with FILL_DOMAIN on it when one is given, and every push to FILL_BRANCH publishes again
  ACCEPT: R1 and R2 and R3 and R4 and R5 pass
  NON_GOALS: designing or rewriting the site, writing its content, moving it to another host, buying a plan or a domain
  DONE_WHEN: the addresses answer and the report was printed as six lines

::BOUNDARY{never:put_a_token_password_or_key_in_the_repository_or_in_the_site_folder|scope:permanent}
::BOUNDARY{never:change_nameservers_or_delete_the_repository_or_the_project_without_the_user_saying_go|scope:permanent}
::BOUNDARY{never:add_a_card_start_a_paid_plan_or_buy_a_domain_that_is_the_user_s_decision|scope:permanent}
::BOUNDARY{never:call_a_build_done_from_the_click_alone_a_served_page_is_the_evidence|scope:permanent}

::STATE{@INPUT, FILL_SITE_DIR:the_local_folder_whose_top_level_holds_index.html, FILL_REPO:the_GitHub_repository_as_owner/name_created_when_absent, FILL_PROJECT:the_Cloudflare_Pages_project_name, FILL_BRANCH:the_branch_whose_pushes_publish_production, FILL_DOMAIN:the_custom_domain_or_the_word_none}

::MODULE{HOW|title:publish the site}
  [STEP] 1 READ FILL_SITE_DIR and expect index.html at its top level beside the CSS and JS; not there: ask the user which folder holds the site and stop
  [STEP] 2 RUN in FILL_SITE_DIR the git commands that commit and push to FILL_REPO and expect the files on FILL_BRANCH; repository absent: create it empty with no readme and push again
  [STEP] 3 OPEN the Cloudflare dashboard on Workers and Pages then Create then Pages then Connect to Git, authorize the GitHub account on FILL_REPO and expect the repository listed and chosen
  [STEP] 4 SET the build settings to framework preset None, build command empty, build output directory the repository root, then deploy and expect a build log that ends in a success line
  [STEP] 5 GET the pages.dev address the project shows, open it and expect the index page served, not a directory listing and not an error page
  [STEP] 6 SET the custom domain when FILL_DOMAIN is not none: project Custom domains tab, add FILL_DOMAIN, let Cloudflare write the CNAME record in its own zone, expect the status Active
  [STEP] 7 RUN one further commit on FILL_BRANCH and expect a new production deployment, with a preview address for a commit on any other branch
  [STEP] 8 CHEK R1 to R5 on what is live rather than on what was clicked and expect each item pass or a named gap
  [IF] the first build fails
  [THEN] open the build log, correct the build output directory or the file layout the log names, push again, and keep the project
  [IF] FILL_DOMAIN sits on nameservers outside Cloudflare
  [THEN] stop at the record Cloudflare shows, print it for the user, and let the user place it
  [IF] a screen asks for a card, a plan or a confirmation the agent cannot give
  [THEN] stop and hand that one decision to the user
  [NOTE] confirmed in the Cloudflare Pages build configuration documentation: a project with no framework leaves the build command blank, and the build output directory names the folder holding the files to serve, which for this site is the repository root
  [NOTE] confirmed in the Cloudflare Pages preview deployments and custom domains documentation: commits to the production branch update the pages.dev address, other branches get preview addresses, and a domain already in the Cloudflare zone gets its CNAME record written by Cloudflare

::MODULE{REPORT|title:the six lines the agent prints at the end}
  [LINE] one sentence in the user_s language saying where the site now answers
  [LINE] the pages.dev address that answered
  [LINE] every change made to the repository and to the dashboard on one line, or the word nothing
  [LINE] the custom domain status word, or the word skipped
  [LINE] the rubric ids that passed and, on that same line, each id that did not with its gap
  [LINE] S= the f_v5 STEP-4 action score of what the agent did, to two decimals

::RUBRIC{id:R1|title:the site folder holds index.html at its top level|check:cmd|run:"test -f FILL_SITE_DIR/index.html"|expect:0}
::RUBRIC{id:R2|title:the pages.dev address serves the site|check:cmd|run:"curl -fsS -o /dev/null https://FILL_PROJECT.pages.dev/"|expect:0}
::RUBRIC{id:R3|title:the served page is the site and not an error page or a listing|check:human}
::RUBRIC{id:R4|title:the custom domain answers or was skipped and recorded|check:human}
::RUBRIC{id:R5|title:the report was printed as six lines ending in the score|check:human}

::FALLBACK{no_git_or_no_github_access then ask_the_user_to_push_the_folder_or_grant_access_then_continue_from_step_3|a_dashboard_step_the_agent_cannot_click then print_the_setting_the_user_must_choose_and_wait|the_build_fails_twice then stop_and_name_the_error_line_for_the_user}

::PRIORITY{
  user_decision > BOUNDARY > OBJECTIVE > RUBRIC > RULE
}
::ILANG::v5.0::ENGINEERING_BOOK
```

## Run 2: One Xiaohongshu link

Input, one link: https://www.xiaohongshu.com/explore/6ad1973f0000000001008c0e (A note on free YouTube channels for cross-border e-commerce, read through RedFox, the reader the Source Book names for Xiaohongshu, Douyin and WeChat Channels links.)

Tool calls, in order:

- model call 1 · web_fetch · https://runtime.ilang.app/manifest.json · 0.0 s
- model call 1 · web_fetch · https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/ilang_grammar_validator.py · 0.0 s
- model call 1 · web_fetch · https://www.xiaohongshu.com/explore/6ad1973f0000000001008c0e · 3.5 s
- model call 2 · web_fetch · https://runtime.ilang.app/ilang-latest.md · 0.0 s
- model call 3 · web_search · Nathan Nazareth youtube dropshipping channel · 0.5 s
- model call 3 · web_search · Dan Vas youtube ecommerce FBA dropshipping channel · 0.5 s
- model call 3 · web_search · Biaheza youtube channel product testing ecommerce · 0.5 s
- model call 3 · web_search · Travis Marziani youtube ecommerce product research branding · 0.5 s
- model call 4 · web_search · Mohammed Kamil Sattar youtube dropshipping ecommerce channel · 0.5 s
- model call 4 · web_search · Kevin David youtube amazon FBA ecommerce channel · 0.6 s
- model call 4 · web_search · Beau Crabill youtube ecommerce strategy channel · 0.6 s
- model call 4 · web_search · Murat Ozturker youtube import export product sourcing channel · 0.5 s
- model call 5 · save_file · BOOK.md · 0.0 s
- model call 6 · run_command · python ilang_grammar_validator.py --lint BOOK.md --strict · 0.1 s
- model call 7 · read_file · ilang_grammar_validator.py · 0.0 s
- model call 8 · web_fetch · https://raw.githubusercontent.com/ilang-ai/ilang-spec/main/archive/SPEC-v5.0-PATCH-2.md · 4.0 s
- model call 9 · save_file · BOOK.md · 0.0 s
- model call 10 · run_command · python ilang_grammar_validator.py --lint BOOK.md --strict · 0.1 s
- model call 11 · save_file · BOOK.md · 0.0 s
- model call 12 · run_command · python ilang_grammar_validator.py --lint BOOK.md --strict · 0.1 s

Result: 13 model calls · 2 min 36 s · 607,464 prompt tokens, 93% cached · about ¥0.24 of tokens · S=0.89

Validator (exit code 0):

```text
BOOK.md: 0 error(s), 0 warning(s) | mode=raw fences linted=0 skipped=0 annotations=0

TOTAL: 0 error(s), 0 warning(s) in 1 file(s)
```

BOOK.md:

```text
::ILANG::v5.0::ENGINEERING_BOOK
[TYPE:engineering_book]
[ID:YT-FREE-LESSON-LADDER]
[VERSION:1.0]
[DATE:2026-10-29]
[LANG:en]

::STATE{@USER, role:learner_of_cross_border_ecommerce, does:answers_the_FILL_fields_once, may:own_a_store_or_have_none_yet, never:has_to_read_this_grammar}
::STATE{@AGENT, role:you_the_user_s_own_AI, can:web_search_web_fetch_write_files, does:reads_the_free_lessons_then_writes_one_plan, never:pays_buys_a_course_opens_an_account_or_takes_a_trial}
::STATE{@RUNTIME, version:2026.10.25-082851760176, note:the_runtime_this_book_was_written_against}

::OBJECTIVE{id:g1|owner:user|trust:trusted|version:1|status:active}
  target: one written plan in FILL_LANG that turns the free YouTube channels on the ladder into an ordered set of backend actions the user performs in their own store, with a dated week table and a tool table, saved as PLAN.md
  ACCEPT: every item of RUBRIC passes
  NON_GOALS: buying a paid course, opening an account for the user, promising results
  DONE_WHEN: PLAN.md exists in FILL_FOLDER in FILL_LANG and every RUBRIC item was checked

::MODULE::INPUT{
  [LINE] FILL_STAGE: where the user stands now, no_store, store_no_orders or orders_unstable
  [LINE] FILL_PLATFORM: the marketplace or site the user sells on
  [LINE] FILL_MARKET: the countries the user sells into
  [LINE] FILL_HOURS: study hours per week the user can give
  [LINE] FILL_QUOTA: practice videos and test batches the user commits to
  [LINE] FILL_WEEKS: weeks the user gives this plan
  [LINE] FILL_LANG: language of PLAN.md
  [LINE] FILL_FOLDER: folder where PLAN.md is saved
}

::MODULE::HOW{
  [NOTE] the ladder is the method; a rung is a stage, the names on it are the free channels kept for it
  [LINE] rung start: Nathan Nazareth, Dan Vas, Biaheza
  [LINE] rung operate: Travis Marziani, Mohammed Kamil Sattar, Kevin David
  [LINE] rung break_through: Beau Crabill, Murat OZTURKER
  [NOTE] the toolkit is the second half of the method; mark each tool free or paid and leave every paid choice to the user
  [LINE] market_analysis: Google Trends, Semrush
  [LINE] product_research: Jungle Scout, Keepa, AliExpress Dropshipping Center
  [LINE] listing_and_store_analysis: the admin of FILL_PLATFORM, Helium 10
  [LINE] copy_and_translation: DeepL, Grammarly
  [LINE] images: Canva, Removebg
  [LINE] shipping_tracking: ShipStation, 17Track
  [STEP] 1 Read INPUT, ask in one message in FILL_LANG for every FILL_ left empty, and wait; expect the stage, platform, market, hours, quota, weeks, language and folder
  [STEP] 2 Resolve the ladder: search the web for each name on its rung plus YouTube, open the channel, keep the canonical channel whose about text matches that rung; expect one channel per name
  [STEP] 3 Keep only backend lessons: list each kept channel's uploads, keep the videos that run a store or marketplace backend on screen, drop the ones that only talk about results; expect a shortlist per rung
  [STEP] 4 Read the lessons: fetch each shortlisted transcript, take every action the person performs in the backend as one imperative line with the menu path and the screen to expect; expect an action list per video and no opinion restated
  [STEP] 5 Order by prerequisite: merge the lists, sort so nothing comes before what it needs, tag each action with its rung, drop duplicates; expect one ladder from the first store setting to the first tested product
  [STEP] 6 Cut to the user's stage: drop every action FILL_STAGE already passed, keep the whole ladder when it says no_store; expect a plan that starts where the user stands
  [STEP] 7 Fit the calendar: spread the kept actions over FILL_WEEKS weeks at FILL_HOURS per week, one deliverable per week, FILL_QUOTA inside those weeks; expect a week table with a deliverable on every row
  [STEP] 8 Attach tools and save: name the tool at the action that needs it, mark it free or paid, write PLAN.md into FILL_FOLDER in FILL_LANG with the ladder, the week table, the tool table and the open questions; expect one file and no account, trial or purchase
  [FORMAT] PLAN.md: under each rung one heading line of the form two hashes, a space, rung, a space, the rung key, a colon, then the words in FILL_LANG; then the numbered action list with the menu path in bold; then the week table; then the tool table with a free_or_paid column; then the open questions list
  [IF] a name cannot be found, or is clearly another person, THEN leave that rung one name shorter, say so in the report, and keep working
  [IF] a transcript is out of reach, THEN keep the video with its title, work from the description and the chapter list, and mark it watch_first in the plan
  [IF] an action needs a paid tool, THEN write the free path to the same action beside it, so the user can still do it without paying
  [IF] STEP 8 wrote the file, THEN run every RUBRIC item and only then write REPORT
}

::RUBRIC{A1: PLAN.md was written into FILL_FOLDER|check:file|path:PLAN.md}
::RUBRIC{A2: every rung on the ladder has its own heading|check:count|path:PLAN.md|regex:"(?m)^## rung "|expect:3}
::RUBRIC{A3: every action line names a menu path or the screen to expect|check:human}
::RUBRIC{A4: every week row carries one deliverable and FILL_QUOTA sits inside the weeks|check:human}
::RUBRIC{A5: no paid course recommended, no account, trial or purchase made|check:human}
::RUBRIC{A6: PLAN.md is written in FILL_LANG and in no other language|check:human}

::MODULE::REPORT{
  [LINE] first: the path of PLAN.md and the language it is in
  [LINE] second: the channels kept, the names dropped and why, and how many lessons were read
  [LINE] third: the rung the plan starts at and the FILL_STAGE value that put it there
  [LINE] fourth: every FILL_ the user left empty and what was read in its place
  [LINE] fifth: every RUBRIC item left unknown or failed and the reason for each
  [LINE] sixth: S= the f_v5 STEP-4 action score of this run to two decimals, and nothing else on the line
}

::ILANG::v5.0::ENGINEERING_BOOK
```

## Run it yourself

Paste Source Book 2.9 (https://ilang.ai/source-book/) into an agent app that has a shell, files and the web, give the agent a tutorial as text or one link, and it writes BOOK.md the same way. Or connect the iLang MCP (https://mcp.ilang.ai/mcp) and ask for the source_book prompt: the book comes filled in, and ilang_book_check runs the same validator. These runs used Source Book 2.8; 2.9, the current version, adds only the feedback entry.

## Feedback

Counterexample: https://github.com/ilang-ai/ilang-research/issues/new?template=counterexample.yml . Amendment: https://github.com/ilang-ai/ilang-research/issues/new?template=amendment.yml . Records: https://github.com/ilang-ai/ilang-research/tree/main/records
