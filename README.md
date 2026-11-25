# Shahid Khan website kit

Folders: public (website + admin.html), api (serverless backend), supabase/schema.sql (database).

## Setup (about 30 minutes)
1. Supabase (supabase.com, free): New project -> SQL Editor -> paste supabase/schema.sql -> Run. Copy Project URL and service_role key (Settings -> API).
2. Resend (resend.com, free): create API key. Verify your own domain later; until then emails send from onboarding@resend.dev to your own email only.
3. Twilio WhatsApp (twilio.com): activate the WhatsApp Sandbox, join it from +91 79773 29122. Copy SID and Auth Token. For replies to visitors on WhatsApp, a Twilio-approved WhatsApp sender and message templates are needed. Email replies work without this.
4. Social auto-posting: create a free Make.com or Zapier scenario "Webhook -> Facebook Pages, LinkedIn, Instagram, YouTube". Paste the webhook URL as SOCIAL_WEBHOOK_URL.
5. GitHub: upload this whole folder as a new repository.
6. Vercel: Add New -> Project -> import the repo -> Environment Variables: copy every key from .env.example with your values -> Deploy. Set ADMIN_PASSWORD to a long private password.
7. Open yoursite/admin.html, enter the password. Publish posts, approve comments and likes, reply to messages.

## How it works
- Visitors' comments and likes are saved as pending and appear only after you approve them in Studio.
- Contact, script, artist and vendor forms save to the database, then email you and WhatsApp you.
- Replying in Studio emails the visitor, and WhatsApps them if a phone number was given.

## Notes
- Keep .env values private. Never put them in GitHub.
- Add your own posters and set photos through Studio (Gallery post with images).
