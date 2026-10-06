import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { DomainSelection } from '@/content/domainSelection';
import { useCountdown } from '@/hooks/useCountdown';
import { useDeadlines } from '@/hooks/useDeadlines';
import { pad } from '@/lib/dateUtils';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { supabase } from '@/lib/supabaseClient';

function formatDomainSelectionDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function computeDomainSelectionPhase(deadlines) {
  const now = new Date();
  if (now < deadlines.openDate) return 'not_open';
  if (now < deadlines.deadline) return 'applications';
  return 'closed';
}

function DomainSelectionContent({ deadlines }) {
  const openCountdown = useCountdown(deadlines.openDate);
  const [fullName, setFullName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [vitEmail, setVitEmail] = useState('');
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

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isPhoneValid = (value) => /^\d{10}$/.test(value.trim());

  const checkRegNumberAvailability = async () => {
    const reg = regNumber.trim();
    if (!reg) {
      setRegNumberStatus('idle');
      return;
    }
    const seq = ++regNumberCheckSeq.current;
    setRegNumberStatus('checking');
    const { data, error } = await supabase.rpc('domain_selection_reg_exists', { p_reg: reg });
    if (seq !== regNumberCheckSeq.current) return; // a newer check superseded this one
    if (error) {
      // Surface this instead of swallowing it — if the RPC function/grant
      // isn't set up in Supabase yet, this is the only place that shows it.
      console.error('[DomainSelection] Reg number check failed:', error.message);
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
        return regNumberStatus === 'taken' ? 'Registration Number Already filled form' : null;
      case 'vitEmail':
        if (vitEmail.trim() === '') return 'Please fill this field';
        return !isEmailValid(vitEmail) ? 'Please enter a valid email address' : null;
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

    // Final safety net: re-verify right before submitting, in case the
    // debounced/onBlur check hasn't resolved yet.
    const reg = regNumber.trim();
    const { data: stillTaken, error: checkError } = await supabase.rpc(
      'domain_selection_reg_exists',
      { p_reg: reg }
    );
    if (!checkError && stillTaken) {
      setRegNumberStatus('taken');
      setShowValidation(true);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const row = {
        full_name: fullName.trim(),
        reg_number: regNumber.trim(),
        vit_email: vitEmail.trim(),
        contact_number: contactNumber.trim(),
        first_pref: firstPref,
        first_why: firstWhy.trim(),
        second_pref: secondPref,
        second_why: secondWhy.trim(),
      };

      const { error } = await supabase.from('domain_selections').insert([row]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      // Log a non-sensitive summary — avoid exposing Supabase internals in production
      console.error('[DomainSelection] Submission failed:', err?.message ?? 'Unknown error');
      if (err && err.code === '23505') {
        setRegNumberStatus('taken');
        setSubmitError('Registration Number Already filled form');
      } else {
        setSubmitError('Something went wrong while submitting. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const headingIcon = 'hub';
  const phase = computeDomainSelectionPhase(deadlines);

  return (
    <section className="section" id="domain-selection">
      <div className="shell shell-board-app">
        <div className="board-app-header">
          <div className="board-app-icon-circle">
            <Icon name={headingIcon} />
          </div>
          <h2 className="board-app-heading">DOMAIN SELECTION 2026</h2>
        </div>

        {phase === 'not_open' && (
          <div className="board-app-status-card">
            <h3 className="board-app-status-title">Domain Selection opens on {formatDomainSelectionDate(deadlines.openDate)}</h3>
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
          <div className="merch-instructions-box">
            <div className="merch-instructions-title">
              <Icon name="info" />
              <span>Important Instructions</span>
            </div>
            <ul className="merch-instructions-list">
              {DomainSelection.formInstructions(deadlines).map((line, i) => (
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
                      id="domain-select-fullname"
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
                        id="domain-select-regnumber"
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
                        <span className="board-app-inline-status board-app-inline-status--taken">Registration Number Already filled form</span>
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
                    <input
                      id="domain-select-vitemail"
                      type="email"
                      className="board-app-detail-input"
                      placeholder="Enter your VIT Email"
                      value={vitEmail}
                      onChange={(e) => setVitEmail(e.target.value)}
                      required
                    />
                    {getFieldError('vitEmail') && (
                      <p className="board-app-field-error">{getFieldError('vitEmail')}</p>
                    )}
                  </td>
                </tr>

                <tr className="board-app-detail-item">
                  <td className="board-app-detail-label">Contact Number</td>
                  <td className="board-app-detail-value">
                    <input
                      id="domain-select-contactnumber"
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
                      id="domain-select-firstpref"
                      value={firstPref}
                      onChange={setFirstPref}
                      options={DomainSelection.domains}
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
                      id="domain-select-firstwhy"
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
                      id="domain-select-secondpref"
                      value={secondPref}
                      onChange={setSecondPref}
                      options={DomainSelection.domains.filter((d) => d !== firstPref)}
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
                      id="domain-select-secondwhy"
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
                <span>Domain selection submitted!</span>
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

        {phase === 'closed' && (
          <div className="board-app-status-card">
            <div className="board-app-status-icon">
              <Icon name="event_busy" />
            </div>
            <h3 className="board-app-status-title">Domain Selection Closed!</h3>
          </div>
        )}
      </div>
    </section>
  );
}

// Dates come from Supabase; render nothing until they have loaded.
function DomainSelectionSection() {
  const { deadlines } = useDeadlines();
  if (!deadlines?.domainSelection) return null;
  return <DomainSelectionContent deadlines={deadlines.domainSelection} />;
}

export default DomainSelectionSection;