import { useState, useCallback, type FormEvent } from 'react';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import YouTubePlayer from '../UI/YouTubePlayer';
import { BOOKING_URL, INTERVIEW_VIDEO_ID, LEAD_ENDPOINT } from '../../config';
import styles from './NextSteps.module.css';

interface FormData {
  firstName: string;
  email: string;
  phone: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type FormState = 'idle' | 'loading' | 'success' | 'error';

async function submitInterest(data: FormData): Promise<void> {
  if (!LEAD_ENDPOINT) {
    // No endpoint configured yet: keep the flow working, but make it obvious in the console
    console.warn('VITE_LEAD_ENDPOINT is not set; call request was not sent anywhere.', data);
    return new Promise((resolve) => setTimeout(resolve, 800));
  }

  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...data,
      request: 'Free 15-minute introductory call',
      source: 'myquantumhypnosis.com',
    }),
  });
  if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`);
}

const EMPTY_FORM: FormData = { firstName: '', email: '', phone: '', message: '' };

export default function NextSteps() {
  const { ref, progress } = useSectionProgress();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<FormErrors>({});

  const opacity = Math.min(progress * 2.5, 1);
  const translateY = (1 - Math.min(progress * 2, 1)) * 30;

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = 'Please enter your first name';
    if (!form.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setState('loading');
    try {
      await submitInterest(form);
      setState('success');
    } catch {
      setState('error');
    }
  }, [form, validate]);

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(errs => ({ ...errs, [field]: undefined }));
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      id="next-steps"
      aria-label="Next steps"
    >
      <div className={styles.inner} style={{ opacity, transform: `translateY(${translateY}px)` }}>
        <div className={styles.header}>
          <span className="section-marker">03 / Next Steps</span>
          <h2 className={styles.headline}>
            Two ways to take<br />the <em>next step.</em>
          </h2>
          <p className={styles.copy}>
            Talk with Deyan directly, or hear first-hand from a past client
            what the experience was like.
          </p>
        </div>

        <div className={styles.options}>
          {/* Option 1: introductory call */}
          <article className={styles.card} id="book-call" aria-labelledby="book-call-title">
            <span className={styles.cardBadge}>Option 1 · Free</span>
            <h3 className={styles.cardTitle} id="book-call-title">
              Book a 15-minute introductory call
            </h3>
            <p className={styles.cardDesc}>
              A relaxed connection call with Deyan to answer your questions and see
              whether Quantum Hypnosis is a good fit for you right now. No pressure,
              no obligation.
            </p>

            {BOOKING_URL && (
              <>
                <a
                  href={BOOKING_URL}
                  {...(BOOKING_URL.startsWith('#')
                    ? {
                        // Placeholder link: send the visitor to the form instead of doing nothing
                        onClick: (e: React.MouseEvent) => {
                          e.preventDefault();
                          document.getElementById('firstName')?.focus();
                        },
                      }
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  className={styles.primaryCta}
                >
                  Pick a Time
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <div className={styles.divider}>
                  <span>or just raise your hand</span>
                </div>
              </>
            )}

            {state === 'success' ? (
              <div className={styles.success} role="status">
                <div className={styles.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" />
                    <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className={styles.successTitle}>Thank you, {form.firstName}.</h4>
                <p className={styles.successText}>
                  Your hand is raised. Deyan will be in touch personally to find a
                  time for your introductory call.
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {!BOOKING_URL && (
                  <p className={styles.formIntro}>
                    Raise your hand below and Deyan will personally reach out to arrange your call.
                  </p>
                )}

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                      value={form.firstName}
                      onChange={update('firstName')}
                      required
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                    {errors.firstName && (
                      <span id="firstName-error" className={styles.error} role="alert">
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      value={form.email}
                      onChange={update('email')}
                      required
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <span id="email-error" className={styles.error} role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone / WhatsApp <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={update('phone')}
                    autoComplete="tel"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>
                    What draws you to Quantum Hypnosis? <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.message}
                    onChange={update('message')}
                  />
                </div>

                <button
                  type="submit"
                  className={BOOKING_URL ? styles.secondaryCta : styles.primaryCta}
                  disabled={state === 'loading'}
                >
                  {state === 'loading' ? (
                    <span className={styles.spinner} aria-label="Submitting" />
                  ) : (
                    <>
                      I'm Interested in a Call
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {state === 'error' && (
                  <div className={styles.formError} role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}
              </form>
            )}
          </article>

          {/* Option 2: client interview */}
          <article className={styles.card} id="interview" aria-labelledby="interview-title">
            <span className={styles.cardBadge}>Option 2 · Watch</span>
            <h3 className={styles.cardTitle} id="interview-title">
              Hear it from a past client
            </h3>
            <p className={styles.cardDesc}>
              Deyan sits down with past client Amandeep Dhillon for an open
              conversation about his Quantum Hypnosis experience, in his own words.
            </p>

            <div className={styles.videoFrame}>
              <YouTubePlayer
                videoId={INTERVIEW_VIDEO_ID}
                title="Interview with Amandeep Dhillon"
                caption="Interview · Amandeep Dhillon"
              />
            </div>

            <a href="#book-call" className={styles.textLink}>
              Resonates with you? Book your free call
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
