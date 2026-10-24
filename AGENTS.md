<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Public lead submission goes through `submitLead` server fn (server-side Zod validation + privileged client, idempotent by submission_key); leads table has no anon access.
- Admin pages live under `src/routes/admin.*` with a client-only `beforeLoad` that requires `is_staff`; data access uses the browser client and relies on staff-only RLS.
- Admin email notification uses a server-only adapter; missing sender configuration is recorded as pending in notification_logs, never as sent, and never prevents a committed lead response.
- Initial administrative signup is restricted by an auth.users insertion trigger with a transaction advisory lock; roles are granted only after email verification and checked against the verified auth email, never profile metadata.
- Persistent rate limits and database unique keys protect public submissions; browser-generated request IDs are initialized after hydration to avoid losing entered form state.
