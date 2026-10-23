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
- Admin email notification (Resend) is best-effort: lead is saved first, outcome logged in notification_logs.
