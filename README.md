# Ryan & Karen's Baby Shower — Vercel Version

This project is ready for GitHub and Vercel. It includes the invitation, mobile layout, RSVP form, calendar download, persistent RSVP storage, and the private host guest log at `/host`.

## Deploy in simple steps

1. Unzip this folder.
2. Upload every file and folder inside it to a new GitHub repository.
3. In Vercel, choose **Add New → Project**, import that GitHub repository, and deploy it as a Next.js project.
4. In the Vercel project, open **Storage** and add an **Upstash Redis** database from the Marketplace. Connect it to this project so its environment variables are added automatically.
5. In **Settings → Environment Variables**, add `RSVP_ADMIN_PIN` and choose your private host PIN. The current fallback PIN is `Jasmine!0822`.
6. Redeploy once after connecting Redis and adding the PIN.

The public RSVP form will not permanently save names until Redis is connected.

## Host guest list

Visit `/host` after deployment, enter the host PIN, and you can view RSVP names, see the exact acceptance date and time, and download a CSV.

## Calendar details

The calendar file currently uses August 22, 2026, from 5:00–8:00 PM in the America/Los_Angeles time zone. Edit `public/jasmine-baby-shower.ics` if that ending time or year should change.
