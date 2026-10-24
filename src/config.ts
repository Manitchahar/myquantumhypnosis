// Site-wide funnel settings. Swap values here (or via the VITE_* env vars
// on the host) without touching the components.

/** YouTube ID of the welcome video at the top of the page.
 *  Interim: Deyan's existing intro video until the new welcome video is recorded. */
export const WELCOME_VIDEO_ID = 't-wzh4Ta_vo';

/** YouTube ID of the interview with past client Amandeep Dhillon. */
export const INTERVIEW_VIDEO_ID = 'CNhcH4aBBd4';

/** Scheduling page for the free 15-minute introductory call (Calendly, Cal.com, etc.).
 *  Leave empty to hide the "Pick a time" button and offer only the "raise your hand" form. */
export const BOOKING_URL: string = import.meta.env.VITE_BOOKING_URL ?? '';

/** Endpoint that receives "raise your hand" requests as a JSON POST
 *  (Formspree, Zapier/Make webhook, GoHighLevel inbound webhook, ...). */
export const LEAD_ENDPOINT: string = import.meta.env.VITE_LEAD_ENDPOINT ?? '';
