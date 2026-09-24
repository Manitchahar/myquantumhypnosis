import { useState, useCallback, type FormEvent } from 'react';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import styles from './LeadCapture.module.css';

interface FormData {
  firstName: string;
  email: string;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

async function submitLead(data: FormData): Promise<void> {
  // Abstraction for future CRM / email integration
  // Replace this with actual API call
  console.log('Lead submitted:', data);
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function LeadCapture() {
  const { ref, progress } = useSectionProgress();
  const [form, setForm] = useState<FormData>({ firstName: '', email: '' });
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const opacity = Math.min(progress * 2.5, 1);
  const translateY = (1 - Math.min(progress * 2, 1)) * 30;

  const validate = useCallback((): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.firstName.trim()) errs.firstName = 'Please enter your name';
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
      await submitLead(form);
      setState('success');
    } catch {
      setState('error');
    }
  }, [form, validate]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      id="lead-capture"
      aria-label="Get started"
    >
      <div className={styles.inner} style={{ opacity, transform: `translateY(${translateY}px)` }}>
        <div className={styles.content}>
          <h2 className={styles.headline}>
            Curious where your<br />journey <em>could lead?</em>
          </h2>
          <p className={styles.copy}>
            Share your details and receive information about the process,
            preparation and next steps.
          </p>

          {state === 'success' ? (
            <div className={styles.success} role="status">
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" />
                  <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>Thank you, {form.firstName}.</h3>
              <p className={styles.successText}>
                We've received your details. Check your inbox for information about
                the process and next steps.
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  value={form.firstName}
                  onChange={(e) => {
                    setForm(f => ({ ...f, firstName: e.target.value }));
                    if (errors.firstName) setErrors(e => ({ ...e, firstName: undefined }));
                  }}
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
                  onChange={(e) => {
                    setForm(f => ({ ...f, email: e.target.value }));
                    if (errors.email) setErrors(e => ({ ...e, email: undefined }));
                  }}
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

              <button
                type="submit"
                className={styles.submit}
                disabled={state === 'loading'}
              >
                {state === 'loading' ? (
                  <span className={styles.spinner} aria-label="Submitting" />
                ) : (
                  <>
                    Get the Next Steps
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

          <p className={styles.microcopy}>
            No pressure. Just information to help you decide whether the
            experience feels right for you.
          </p>
        </div>
      </div>
    </section>
  );
}