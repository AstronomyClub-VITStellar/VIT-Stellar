import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { Recruitments, InterviewSchedule } from '@/content/recruitments';
import { useCountdown } from '@/hooks/useCountdown';
import { useDeadlines } from '@/hooks/useDeadlines';
import { pad } from '@/lib/dateUtils';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { supabase } from '@/lib/supabaseClient';
import { useFeatures } from '@/hooks/useFeatures';
import {
  rememberReturnScroll,
  peekReturnScroll,
  clearReturnScroll,
  holdScrollOnSelector,
} from '@/lib/scrollToSection';

const SECTION_SELECTOR = '#interview-schedule';

// ── Interview Schedule ─────────────────────────────────────────────────────
// Shown below the form once interviews are scheduled (features.interviewSchedule).
// Students sign in with Google and see only the rows linked to their own email.

// Official Google "G" mark for the "Continue with Google" button.
function GoogleIcon() {
  return (
    <svg className="google-signin-icon" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.02l7.73 6c4.51-4.18 7.09-10.36 7.09-17.49z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

// Round profile picture for the signed-in Google account. Falls back to the
// first letter of the name/email if there is no photo or it fails to load.
function AccountAvatar({ url, label }) {
  const [failed, setFailed] = useState(false);
  const initial = (label || '?').trim().charAt(0).toUpperCase();
  return (
    <span className="fest-cert-avatar" aria-hidden="true">
      {url && !failed ? (
        <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}

// Same rule as the Certificates section: only official VIT student accounts.
const ALLOWED_EMAIL_DOMAIN = 'vitstudent.ac.in';
const isAllowedEmail = (email) =>
  typeof email === 'string' && email.toLowerCase().endsWith('@' + ALLOWED_EMAIL_DOMAIN);

// `interview_date` is a plain Postgres date ('YYYY-MM-DD'). Format it in UTC so
// the day never shifts with the visitor's timezone.
function formatInterviewDate(value) {
  if (!value) return '—';
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function InterviewScheduleCard() {
  const [session, setSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(null);

  const [rows, setRows] = useState(null); // null = not loaded yet, [] = loaded, none found
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Pick up the existing session, then stay in sync with sign-in / sign-out
  // (including the redirect back from Google).
  useEffect(() => {
    const applySession = (s) => {
      if (s && !isAllowedEmail(s.user?.email)) {
        setSession(null);
        setSignInError('Please sign in with your official @' + ALLOWED_EMAIL_DOMAIN + ' email address.');
        supabase.auth.signOut();
        return;
      }
      setSession(s);
    };
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
      setSessionChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      applySession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Once signed in, fetch the schedule. RLS on `recruitments_interview` only
  // returns rows whose email matches the signed-in Google account, so this can
  // never return anyone else's interview.
  useEffect(() => {
    if (!session) {
      setRows(null);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    (async () => {
      const { data, error } = await supabase
        .from('recruitments_interview')
        .select('id, reg_number, full_name, domain, interview_date, interview_time')
        .order('interview_date', { ascending: true })
        .order('interview_time', { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error('[InterviewSchedule] Lookup failed:', error.message);
        setLoadError('Could not load your interview schedule. Please try again.');
        setRows([]);
      } else {
        setRows(data ?? []);
      }
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  // Google sign-in leaves the site and comes back at the top of the page.
  // If we left from this section, bring the visitor straight back to it.
  useEffect(() => {
    const selector = peekReturnScroll();
    if (selector !== SECTION_SELECTOR) return;
    return holdScrollOnSelector(selector, { onDone: clearReturnScroll });
  }, []);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setSignInError(null);
    setIsSigningIn(true);
    rememberReturnScroll(SECTION_SELECTOR);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
          // hd is only a UI hint; the real checks are above and in the database.
          queryParams: { hd: ALLOWED_EMAIL_DOMAIN, prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('[InterviewSchedule] Google sign-in failed:', err?.message ?? 'Unknown error');
      clearReturnScroll();
      setSignInError('Something went wrong while signing in. Please try again.');
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="board-app-outer-card">
      <div className="team-form-heading">
        <Icon name="event_available" />
        <span>Interview Schedule</span>
      </div>
      <div className="merch-instructions-box">
        <div className="merch-instructions-title">
          <Icon name="info" />
          <span>Important Instructions</span>
        </div>
        <ul className="merch-instructions-list">
          {InterviewSchedule.instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      {!sessionChecked ? null : !session ? (
        <div className="google-signin-wrap">
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            aria-disabled={isSigningIn}
          >
            <GoogleIcon />
            <span>{isSigningIn ? 'Redirecting…' : 'Continue with Google'}</span>
          </button>
          {signInError && (
            <p className="board-app-field-error" style={{ padding: '10px 0 0', textAlign: 'center' }}>
              {signInError}
            </p>
          )}
        </div>
      ) : (
        <div className="fest-cert-account">
          {(() => {
            const meta = session.user.user_metadata || {};
            const displayName = meta.full_name || meta.name || '';
            const email = session.user.email;
            return (
              <div className="fest-cert-profile">
                <AccountAvatar url={meta.avatar_url || meta.picture} label={displayName || email} />
                <div className="fest-cert-profile-info">
                  <span className="fest-cert-profile-label">Signed in as</span>
                  {displayName && <span className="fest-cert-profile-name">{displayName}</span>}
                  <span className="fest-cert-profile-email">{email}</span>
                </div>
                <button type="button" className="fest-cert-signout-btn" onClick={handleSignOut}>
                  Sign out
                  <Icon name="logout" />
                </button>
              </div>
            );
          })()}

          {isLoading && <p className="fest-cert-status">Looking up your interview schedule…</p>}

          {loadError && (
            <p className="board-app-field-error" style={{ padding: '10px 0' }}>{loadError}</p>
          )}

          {!isLoading && rows && rows.length === 0 && !loadError && (
            <p className="fest-cert-status">
              No interview is scheduled for this email yet. If you have filled the Recruitments form,
              please check back later or reach us through the Contact Us section below.
            </p>
          )}

          {!isLoading && rows && rows.length > 0 && (
            <div className="board-app-card interview-table-wrap">
              <table className="interview-table">
                <thead>
                  <tr>
                    <th>Registration Number</th>
                    <th>Name</th>
                    <th>Domain</th>
                    <th>Interview Date</th>
                    <th>Interview Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Registration Number">{r.reg_number}</td>
                      <td data-label="Name">{r.full_name}</td>
                      <td data-label="Domain">{r.domain}</td>
                      <td data-label="Interview Date">{formatInterviewDate(r.interview_date)}</td>
                      <td data-label="Interview Time">{r.interview_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatRecruitmentsDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function computeRecruitmentsPhase(deadlines) {
  const now = new Date();
  if (now < deadlines.openDate) return 'not_open';
  if (now < deadlines.deadline) return 'applications';
  return 'closed';
}

function RecruitmentsContent({ deadlines }) {
  const { features } = useFeatures();
  const openCountdown = useCountdown(deadlines.openDate);
  const [fullName, setFullName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [vitEmail, setVitEmail] = useState('');
  const [vitEmailTouched, setVitEmailTouched] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [firstPref, setFirstPref] = useState('');
  const [firstWhy, setFirstWhy] = useState('');
  const [secondPref, setSecondPref] = useState('');
  const [secondWhy, setSecondWhy] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 'idle' | 'checking' | 'taken' | 'error' — live check against Supabase,
  // debounced while typing + re-verified on submit as a safety net.
  const [regNumberStatus, setRegNumberStatus] = useState('idle');
  const regNumberCheckSeq = useRef(0);

  const isEmailValid = (value) =>
    /^[^\s@]+@(vitstudent\.ac\.in|vit\.ac\.in)$/i.test(value.trim());
  const isPhoneValid = (value) => /^\d{10}$/.test(value.trim());

  const checkRegNumberAvailability = async () => {
    const reg = regNumber.trim();
    if (!reg) {
      setRegNumberStatus('idle');
      return;
    }
    const seq = ++regNumberCheckSeq.current;
    setRegNumberStatus('checking');
    const { data, error } = await supabase.rpc('recruitment_reg_exists', { p_reg: reg });
    if (seq !== regNumberCheckSeq.current) return; // a newer check superseded this one
    if (error) {
      // Surface this instead of swallowing it — if the RPC function/grant
      // isn't set up in Supabase yet, this is the only place that shows it.
      console.error('[Recruitments] Reg number check failed:', error.message);
      setRegNumberStatus('error');
      return;
    }
    setRegNumberStatus(data ? 'taken' : 'idle');
  };

  // Auto-check 600ms after the user stops typing, so the "taken" message
  // shows up without needing to blur the field first.
  useEffect(() => {
    const reg = regNumber.trim();
    if (!reg) {
      setRegNumberStatus('idle');
      return;
    }
    const timeoutId = setTimeout(() => {
      checkRegNumberAvailability();
    }, 600);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regNumber]);

  const getFieldError = (fieldKey) => {
    if (!showValidation) return null;
    switch (fieldKey) {
      case 'fullName':
        return fullName.trim() === '' ? 'Please fill this field' : null;
      case 'regNumber':
        if (regNumber.trim() === '') return 'Please fill this field';
        // The "already filled the form" message is shown inline next to the
        // field (like the VIT email one), so it isn't repeated here.
        return null;
      case 'vitEmail':
        if (vitEmail.trim() === '') return 'Please fill this field';
        return !isEmailValid(vitEmail) ? 'Please enter a VIT Domain email' : null;
      case 'contactNumber':
        if (contactNumber.trim() === '') return 'Please fill this field';
        return !isPhoneValid(contactNumber) ? 'Please enter a valid 10-digit contact number' : null;
      case 'firstPref':
        return firstPref.trim() === '' ? 'Please select a domain' : null;
      case 'firstWhy':
        return firstWhy.trim() === '' ? 'Please fill this field' : null;
      case 'secondPref':
        return secondPref.trim() === '' ? 'Please select a domain' : null;
      case 'secondWhy':
        return secondWhy.trim() === '' ? 'Please fill this field' : null;
      default:
        return null;
    }
  };

  const isFormValid =
    fullName.trim() !== '' &&
    regNumber.trim() !== '' &&
    regNumberStatus !== 'taken' &&
    isEmailValid(vitEmail) &&
    isPhoneValid(contactNumber) &&
    firstPref.trim() !== '' &&
    firstWhy.trim() !== '' &&
    secondPref.trim() !== '' &&
    secondWhy.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) {
      setShowValidation(true);
      return;
    }
    if (isSubmitting) return;

    // Set immediately (before any await) so fast double taps on mobile
    // can't fire a second submission.
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Final safety net: re-verify right before submitting, in case the
      // debounced/onBlur check hasn't resolved yet.
      const reg = regNumber.trim();
      const { data: stillTaken } = await supabase.rpc('recruitment_reg_exists', {
        p_reg: reg,
      });
      if (stillTaken) {
        setRegNumberStatus('taken');
        setShowValidation(true);
        return;
      }

      const row = {
        full_name: fullName.trim(),
        reg_number: reg,
        vit_email: vitEmail.trim().toLowerCase(),
        contact_number: contactNumber.trim(),
        first_pref: firstPref,
        first_why: firstWhy.trim(),
        second_pref: secondPref,
        second_why: secondWhy.trim(),
      };

      const { error } = await supabase.from('recruitments').insert([row]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      // Log code/details so the real cause is visible in the console
      console.error(
        '[Recruitments] Submission failed:',
        err?.code,
        err?.message,
        err?.details,
        err?.hint
      );
      const msg = String(err?.message || '');
      if (err?.code === '23505') {
        setRegNumberStatus('taken');
        setSubmitError('Registration Number already filled the form');
      } else if (/failed to fetch|network|load failed/i.test(msg)) {
        setSubmitError(
          'Network problem reaching the server. Switch to Wi-Fi or another network (or turn off Data Saver/private DNS) and try again.'
        );
      } else {
        // The real code/message is logged to the console above for debugging
        setSubmitError('Something went wrong while submitting. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const headingIcon = 'hub';
  const phase = computeRecruitmentsPhase(deadlines);

  // After the deadline the form box disappears. The section only stays (heading +
  // interview schedule) while the interview schedule is switched on.
  if (phase === 'closed' && !features.interviewSchedule) return null;

  return (
    <section className="section" id="recruitments">
      <div className="shell shell-board-app">
        <div className="board-app-header">
          <div className="board-app-icon-circle">
            <Icon name={headingIcon} />
          </div>
          <h2 className="board-app-heading">RECRUITMENTS 2026</h2>
        </div>

        {phase === 'not_open' && (
          <div className="board-app-status-card">
            <h3 className="board-app-status-title">Recruitments open on {formatRecruitmentsDate(deadlines.openDate)}</h3>
            <div className="merch-drop-countdown board-app-status-countdown">
              <div className="merch-drop-countdown-cell">
                <span className="merch-drop-countdown-num">{pad(openCountdown.days)}</span>
                <span className="merch-drop-countdown-label">Days</span>
              </div>
              <div className="merch-drop-countdown-cell">
                <span className="merch-drop-countdown-num">{pad(openCountdown.hours)}</span>
                <span className="merch-drop-countdown-label">Hours</span>
              </div>
              <div className="merch-drop-countdown-cell">
                <span className="merch-drop-countdown-num">{pad(openCountdown.minutes)}</span>
                <span className="merch-drop-countdown-label">Mins</span>
              </div>
              <div className="merch-drop-countdown-cell">
                <span className="merch-drop-countdown-num">{pad(openCountdown.seconds)}</span>
                <span className="merch-drop-countdown-label">Secs</span>
              </div>
            </div>
          </div>
        )}

        {phase === 'applications' && (
        <div className="board-app-outer-card">
          <div className="team-form-heading">
            <Icon name="category" />
            <span>Domain Selection</span>
          </div>
          <div className="merch-instructions-box">
            <div className="merch-instructions-title">
              <Icon name="info" />
              <span>Important Instructions</span>
            </div>
            <ul className="merch-instructions-list">
              {Recruitments.formInstructions(deadlines).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="board-app-card">
            <table className="board-app-table">
              <tbody>
                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Full Name</td>
                  <td className="board-app-detail-value">
                    <input
                      id="recruitment-fullname"
                      type="text"
                      className="board-app-detail-input"
                      placeholder="Enter your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    {getFieldError('fullName') && (
                      <p className="board-app-field-error">{getFieldError('fullName')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Registration Number</td>
                  <td className="board-app-detail-value">
                    <div className="board-app-input-row">
                      <input
                        id="recruitment-regnumber"
                        type="text"
                        className="board-app-detail-input"
                        placeholder="Enter your Registration Number"
                        value={regNumber}
                        onChange={(e) => {
                          setRegNumber(e.target.value.toUpperCase());
                          if (regNumberStatus !== 'idle') setRegNumberStatus('idle');
                        }}
                        onBlur={checkRegNumberAvailability}
                        required
                      />
                      {regNumberStatus === 'taken' && (
                        <span className="board-app-inline-status board-app-inline-status--taken">Registration Number already filled the form</span>
                      )}
                      {regNumberStatus === 'error' && (
                        <span className="board-app-inline-status" style={{ color: '#f5a623' }}>
                          Couldn't verify Registration Number — will check again on submit
                        </span>
                      )}
                    </div>
                    {getFieldError('regNumber') && (
                      <p className="board-app-field-error">{getFieldError('regNumber')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">VIT Email</td>
                  <td className="board-app-detail-value">
                    <div className="board-app-input-row">
                      <input
                        id="recruitment-vitemail"
                        type="email"
                        className="board-app-detail-input"
                        placeholder="Enter your VIT Email"
                        value={vitEmail}
                        onChange={(e) => setVitEmail(e.target.value)}
                        onBlur={() => setVitEmailTouched(true)}
                        required
                      />
                      {vitEmailTouched && !showValidation && vitEmail.trim() !== '' && !isEmailValid(vitEmail) && (
                        <span className="board-app-inline-status board-app-inline-status--taken">Please enter a VIT Domain email</span>
                      )}
                    </div>
                    {getFieldError('vitEmail') && (
                      <p className="board-app-field-error">{getFieldError('vitEmail')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Contact Number</td>
                  <td className="board-app-detail-value">
                    <input
                      id="recruitment-contactnumber"
                      type="tel"
                      className="board-app-detail-input"
                      placeholder="Enter your Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      inputMode="numeric"
                      required
                    />
                    {getFieldError('contactNumber') && (
                      <p className="board-app-field-error">{getFieldError('contactNumber')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">First Preference Domain</td>
                  <td className="board-app-detail-value board-app-detail-value--select">
                    <SelectDropdown
                      id="recruitment-firstpref"
                      value={firstPref}
                      onChange={setFirstPref}
                      options={Recruitments.domains}
                      placeholder="Select a domain"
                      required
                    />
                    {getFieldError('firstPref') && (
                      <p className="board-app-field-error">{getFieldError('firstPref')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Why should we consider you for this domain?</td>
                  <td className="board-app-detail-value">
                    <textarea
                      id="recruitment-firstwhy"
                      className="board-app-detail-textarea"
                      placeholder="Tell us why..."
                      rows={3}
                      value={firstWhy}
                      onChange={(e) => setFirstWhy(e.target.value)}
                      required
                    />
                    {getFieldError('firstWhy') && (
                      <p className="board-app-field-error">{getFieldError('firstWhy')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Second Preference Domain</td>
                  <td className="board-app-detail-value board-app-detail-value--select">
                    <SelectDropdown
                      id="recruitment-secondpref"
                      value={secondPref}
                      onChange={setSecondPref}
                      options={Recruitments.domains.filter((d) => d !== firstPref)}
                      placeholder="Select a domain"
                      required
                    />
                    {getFieldError('secondPref') && (
                      <p className="board-app-field-error">{getFieldError('secondPref')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Why should we consider you for this domain?</td>
                  <td className="board-app-detail-value">
                    <textarea
                      id="recruitment-secondwhy"
                      className="board-app-detail-textarea"
                      placeholder="Tell us why..."
                      rows={3}
                      value={secondWhy}
                      onChange={(e) => setSecondWhy(e.target.value)}
                      required
                    />
                    {getFieldError('secondWhy') && (
                      <p className="board-app-field-error">{getFieldError('secondWhy')}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="board-app-outer-footer">
            {submitted ? (
              <span className="board-app-submitted-msg">
                <Icon name="check_circle" />
                <span>Recruitment form submitted!</span>
              </span>
            ) : (
              <div className="board-app-submit-wrap">
                {submitError && (
                  <p className="board-app-field-error merch-submit-error">{submitError}</p>
                )}
                <button
                  type="button"
                  className="board-app-next-btn"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  aria-disabled={!isFormValid || isSubmitting}
                >
                  <span>{isSubmitting ? 'Submitting' : 'Submit'}</span>
                  <Icon
                    name={isSubmitting ? 'progress_activity' : 'check'}
                    className={isSubmitting ? 'icon-spin' : ''}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {features.interviewSchedule && (
          <div id="interview-schedule" className="interview-schedule-block">
            <InterviewScheduleCard />
          </div>
        )}
      </div>
    </section>
  );
}

// Dates come from Supabase; render nothing until they have loaded.
function RecruitmentsSection() {
  const { deadlines } = useDeadlines();
  if (!deadlines?.recruitments) return null;
  return <RecruitmentsContent deadlines={deadlines.recruitments} />;
}

export default RecruitmentsSection;