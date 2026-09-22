# auth.md

Status: under_construction. available=false. capabilities_status=planned_contract_only. launch_date=null.

Coming soon. Agent registration, authorization and token issuance for ilang.ai are planned and not available. Every endpoint referenced below returns HTTP 503 temporarily_unavailable, stores nothing, creates no account, issues no token and sends no email. Agents must not attempt registration or token exchange while available=false.

What works today without authentication:

- Public lookup API: https://ilang.ai/api/agent/lookup?q=TERM and https://ilang.ai/api/agent/faq?q=QUESTION (OpenAPI: https://ilang.ai/openapi.json)
- MCP server (Streamable HTTP, read-only tools): https://ilang.ai/mcp (server card: https://ilang.ai/.well-known/mcp/server-card.json)
- Agent entry page: https://ilang.ai/ai/

Planned contract (not live):

- Authorization Server metadata: https://ilang.ai/.well-known/oauth-authorization-server
- Protected Resource metadata: https://ilang.ai/.well-known/oauth-protected-resource (resource = https://ilang.ai)
- Registration: https://ilang.ai/agent-auth/register (identity type anonymous, credential type access_token, planned)
- Claim: https://ilang.ai/agent-auth/claim (planned)

Agent instructions (iLang):

```
::ILANG::v5.0
::STATE{@AUTH, status:under_construction, available:false}
::RULE{available=false⇒do_not_register_do_not_request_tokens}
::RULE{need_public_data⇒use_api_agent_lookup_or_mcp_without_credentials}
[READ:@AUTH_MD]=>[CHEK:@AUTH|whr=available=true]=>[Ω]
```
