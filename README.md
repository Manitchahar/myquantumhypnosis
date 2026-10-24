# MyQuantumHypnosis.com

One-page lead-generation funnel for Deyan's Quantum Hypnosis practice (Vite + React + TypeScript).

## Page structure

1. **Welcome**: crest, headline and the welcome video
2. **Testimonials**: strip of client testimonial videos
3. **Next steps**: two options
   - book a free 15-minute introductory call (pick a time, or "raise your hand" with the form)
   - watch the interview with past client Amandeep Dhillon

## Configuration

Video IDs live in `src/config.ts`. Lead capture and booking are set through environment variables on the host:

| Variable | Purpose |
| --- | --- |
| `VITE_BOOKING_URL` | Scheduling link for the 15-minute call (Calendly, Cal.com, ...). Until it is set, the "Pick a time" button is a placeholder that stays on the page. |
| `VITE_LEAD_ENDPOINT` | URL that receives the form as a JSON `POST` (Formspree, Zapier/Make webhook, GoHighLevel, ...). **Until this is set, submissions are not delivered anywhere.** |

Testimonial videos are listed in `src/components/Testimonials/Testimonials.tsx`.

## Development

```bash
npm install
npm run dev     # local dev server
npm run build   # type-check and production build into dist/
```
