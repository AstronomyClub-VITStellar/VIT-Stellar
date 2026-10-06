import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/Icon';
import { useNow } from '@/hooks/useNow';
import { useDeadlines } from '@/hooks/useDeadlines';
import {
  rememberReturnScroll,
  peekReturnScroll,
  clearReturnScroll,
  holdScrollOnSelector,
} from '@/lib/scrollToSection';
import { pad } from '@/lib/dateUtils';
import { useFeatures } from '@/hooks/useFeatures';
import { Fest } from '@/content/fest';
import SocialIcon from '@/components/ui/SocialIcon';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { supabase } from '@/lib/supabaseClient';

// ---------------------------------------------------------------------------
// Event end detection
// Events store `date` ("18 SEPT - 19 SEPT") and `time` ("09:00 AM - 05:00 PM")
// as display strings. An event is over once (END DATE + END TIME) has passed,
// e.g. 19 SEPT 05:00 PM for the example above. Times are treated as IST so the
// switch happens at the same moment for every visitor, whatever their timezone.
// ---------------------------------------------------------------------------
const FEST_YEAR = 2026;
const FEST_TZ_OFFSET = '+05:30';
const FEST_MONTHS = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

function festParseEventEnd(dateStr, timeStr, year = FEST_YEAR) {
  if (!dateStr || !timeStr) return null;

  const endDate = dateStr.split('-').pop().trim();   // "19 SEPT"
  const endTime = timeStr.split('-').pop().trim();   // "05:00 PM"

  const dm = endDate.match(/^(\d{1,2})\s+([A-Za-z]{3})/);
  const tm = endTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!dm || !tm) return null;

  const month = FEST_MONTHS[dm[2].toUpperCase()];
  if (!month) return null;

  let hour = parseInt(tm[1], 10) % 12;
  if (tm[3].toUpperCase() === 'PM') hour += 12;

  const iso = `${year}-${pad(month)}-${pad(dm[1])}T${pad(hour)}:${tm[2]}:00${FEST_TZ_OFFSET}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function FestPocCarousel({ pocs, activeEventIndex = 0, eventsCount, onSelect }) {
  const trackRef = useRef(null);
  const dragInfo = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  // When there's only one event, "active" can't be determined by eventIndex
  // (every poc shares the same eventIndex, so all cards would be marked
  // active at once). Track which poc card is active locally instead — but
  // only matters on mobile, where the layout shows one card at a time.
  // On desktop all poc cards for a single event stay visible together.
  const singleEvent = eventsCount <= 1;
  const [activePocIndex, setActivePocIndex] = useState(0);

  // Mirrors the CSS breakpoint used for the mobile poc-carousel layout.
  const MOBILE_QUERY = '(max-width: 760px)';
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const singleEventMobileSwitching = singleEvent && isMobile && pocs.length > 1;

  useEffect(() => {
    if (activePocIndex >= pocs.length) setActivePocIndex(0);
  }, [pocs.length, activePocIndex]);

  useEffect(() => {
    if (!singleEventMobileSwitching) return;
    const id = setInterval(() => {
      setActivePocIndex((prev) => (prev + 1) % pocs.length);
    }, 10000);
    return () => clearInterval(id);
  }, [singleEventMobileSwitching, pocs.length]);

  const onPointerDown = (e) => {
    const track = trackRef.current;
    if (!track) return;
    dragInfo.current = { active: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    setDragging(true);
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const track = trackRef.current;
    if (!track || !dragInfo.current.active) return;
    const dx = e.clientX - dragInfo.current.startX;
    if (Math.abs(dx) > 4) {
      dragInfo.current.moved = true;
    }
    track.scrollLeft = dragInfo.current.startScroll - dx;
  };

  const endDrag = () => {
    dragInfo.current.active = false;
    setDragging(false);
  };

  const goPrev = () => {
    if (eventsCount > 1) {
      onSelect?.((activeEventIndex - 1 + eventsCount) % eventsCount);
    } else if (singleEventMobileSwitching) {
      setActivePocIndex((prev) => (prev - 1 + pocs.length) % pocs.length);
    } else if (trackRef.current) {
      trackRef.current.scrollBy({ left: -(250 + 24), behavior: 'smooth' });
    }
  };
  const goNext = () => {
    if (eventsCount > 1) {
      onSelect?.((activeEventIndex + 1) % eventsCount);
    } else if (singleEventMobileSwitching) {
      setActivePocIndex((prev) => (prev + 1) % pocs.length);
    } else if (trackRef.current) {
      trackRef.current.scrollBy({ left: 250 + 24, behavior: 'smooth' });
    }
  };
  const showArrows = eventsCount > 1 || pocs.length > 1;

  return (
    <div className="fest-carousel-wrap">
      {showArrows && (
        <button
          type="button"
          className="fest-carousel-arrow fest-carousel-arrow-left"
          onClick={goPrev}
          aria-label="Show previous event"
        >
          <Icon name="arrow_back" />
        </button>
      )}
      <div
        className={`fest-carousel${dragging ? ' dragging' : ''}`}
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {pocs.map((a, i) => {
          const isActive = singleEvent
            ? (singleEventMobileSwitching ? i === activePocIndex : true)
            : a.eventIndex === activeEventIndex;
          const clickable = singleEvent ? singleEventMobileSwitching : !!onSelect;
          return (
          <div
            className={`fest-poc-card${isActive ? ' active' : ' blurred'}`}
            key={`${a.eventIndex}-${a.name}`}
            onClick={() => {
              if (singleEvent) {
                if (singleEventMobileSwitching) setActivePocIndex(i);
              } else {
                onSelect?.(a.eventIndex);
              }
            }}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            <div className="fest-poc-photo">
              <img src={a.image} alt={a.name} draggable="false" loading="lazy" />
            </div>
            <div className="fest-poc-body">
              <p className="fest-poc-name">{a.name}</p>
              <p className="fest-poc-role">{a.eventTitle} POC</p>
              {a.phone && (
                <a
                  className="fest-poc-contact"
                  href={`tel:${a.phone.replace(/\s+/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Call ${a.name}`}
                >
                  <SocialIcon type="contact" />
                  <span>{a.phone}</span>
                </a>
              )}
            </div>
          </div>
          );
        })}
      </div>
      {showArrows && (
        <button
          type="button"
          className="fest-carousel-arrow fest-carousel-arrow-right"
          onClick={goNext}
          aria-label="Show next event"
        >
          <Icon name="arrow_forward" />
        </button>
      )}
    </div>
  );
}

// Team registration form — a solo-registered participant (the team leader)
// fills this in to form their team with friends who have also registered
// solo for the event.
function FestTeamRegistrationForm() {
  const fest = useDeadlines().deadlines.fest;
  const TEAM_SIZE_OPTIONS = ['1', '2', '3', '4', '5'];

  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderReg, setLeaderReg] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [teammateRegs, setTeammateRegs] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Live availability checks against Supabase — 'idle' | 'checking' | 'available' | 'taken'
  const [teamNameStatus, setTeamNameStatus] = useState('idle');
  const [leaderRegStatus, setLeaderRegStatus] = useState('idle');
  const [teammateStatuses, setTeammateStatuses] = useState([]); // one 'idle'|'checking'|'taken' per teammate index
  const teamNameCheckSeq = useRef(0);
  const leaderRegCheckSeq = useRef(0);
  const teammateCheckSeq = useRef([]);

  // Number of teammate (non-leader) registration-number fields to show.
  const teammateCount = teamSize ? Math.max(0, parseInt(teamSize, 10) - 1) : 0;

  const handleTeamSizeChange = (value) => {
    setTeamSize(value);
    const count = Math.max(0, parseInt(value, 10) - 1);
    setTeammateRegs((prev) => {
      const next = prev.slice(0, count);
      while (next.length < count) next.push('');
      return next;
    });
    setTeammateStatuses((prev) => {
      const next = prev.slice(0, count);
      while (next.length < count) next.push('idle');
      return next;
    });
  };

  const handleTeammateRegChange = (index, value) => {
    setTeammateRegs((prev) => {
      const next = [...prev];
      next[index] = value.toUpperCase();
      return next;
    });
    setTeammateStatuses((prev) => {
      if (prev[index] === 'idle' || prev[index] === undefined) return prev;
      const next = [...prev];
      next[index] = 'idle';
      return next;
    });
  };

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isPhoneValid = (value) => /^\d{10}$/.test(value.trim());

  // Checked on blur so we're not firing a request on every keystroke.
  // A sequence ref guards against an older, slower request overwriting a
  // newer result (e.g. user edits the field again before the first check returns).
  //
  // NOTE: these call RPC functions (team_name_exists / registration_number_taken) rather
  // than selecting from team_formation directly. The table has no general SELECT
  // policy (only INSERT, for the form submission), so a direct select from the
  // browser would silently return zero rows even when a match exists — which is
  // exactly the bug this caused. The RPC functions run as SECURITY DEFINER and
  // return only a boolean, so they bypass that restriction without exposing any
  // other row data (leader emails/phones etc.) to the public anon key.
  //
  // registration_number_taken checks a reg number against BOTH the leader_reg_number
  // column and the teammate_reg_numbers array across every team, so it catches someone
  // trying to join a second team either as a leader or as a teammate.
  const checkTeamNameAvailability = async () => {
    const name = teamName.trim();
    if (!name) {
      setTeamNameStatus('idle');
      return;
    }
    const seq = ++teamNameCheckSeq.current;
    setTeamNameStatus('checking');
    const { data, error } = await supabase.rpc('team_name_exists', { p_team_name: name });
    if (seq !== teamNameCheckSeq.current) return; // a newer check superseded this one
    if (error) {
      console.error('[FestTeamRegistrationForm] Team name check failed:', error.message);
      setTeamNameStatus('idle');
      return;
    }
    setTeamNameStatus(data ? 'taken' : 'available');
  };

  const checkLeaderRegAvailability = async () => {
    const reg = leaderReg.trim();
    if (!reg) {
      setLeaderRegStatus('idle');
      return;
    }
    const seq = ++leaderRegCheckSeq.current;
    setLeaderRegStatus('checking');
    const { data, error } = await supabase.rpc('registration_number_taken', { p_reg: reg });
    if (seq !== leaderRegCheckSeq.current) return;
    if (error) {
      console.error('[FestTeamRegistrationForm] Leader reg check failed:', error.message);
      setLeaderRegStatus('idle');
      return;
    }
    setLeaderRegStatus(data ? 'taken' : 'available');
  };

  const checkTeammateRegAvailability = async (index) => {
    const reg = (teammateRegs[index] || '').trim();
    if (!reg) {
      setTeammateStatuses((prev) => {
        const next = [...prev];
        next[index] = 'idle';
        return next;
      });
      return;
    }
    teammateCheckSeq.current[index] = (teammateCheckSeq.current[index] || 0) + 1;
    const seq = teammateCheckSeq.current[index];
    setTeammateStatuses((prev) => {
      const next = [...prev];
      next[index] = 'checking';
      return next;
    });
    const { data, error } = await supabase.rpc('registration_number_taken', { p_reg: reg });
    if (seq !== teammateCheckSeq.current[index]) return;
    if (error) {
      console.error('[FestTeamRegistrationForm] Teammate reg check failed:', error.message);
      setTeammateStatuses((prev) => {
        const next = [...prev];
        next[index] = 'idle';
        return next;
      });
      return;
    }
    setTeammateStatuses((prev) => {
      const next = [...prev];
      next[index] = data ? 'taken' : 'idle'; // no positive "available" shown for teammates, same as leader
      return next;
    });
  };

  const getFieldError = (fieldKey) => {
    if (!showValidation) return null;
    switch (fieldKey) {
      case 'teamName':
        return teamName.trim() === '' ? 'Please fill this field' : null;
      case 'teamSize':
        return teamSize.trim() === '' ? 'Please select your team size' : null;
      case 'leaderName':
        return leaderName.trim() === '' ? 'Please fill this field' : null;
      case 'leaderReg':
        return leaderReg.trim() === '' ? 'Please fill this field' : null;
      case 'leaderEmail':
        if (leaderEmail.trim() === '') return 'Please fill this field';
        return !isEmailValid(leaderEmail) ? 'Please enter a valid email address' : null;
      case 'leaderPhone':
        if (leaderPhone.trim() === '') return 'Please fill this field';
        return !isPhoneValid(leaderPhone) ? 'Please enter a valid 10-digit phone number' : null;
      case 'confirmed':
        return !confirmed ? 'Please confirm before submitting' : null;
      default:
        return null;
    }
  };

  const getTeammateError = (index) => {
    if (!showValidation) return null;
    const value = teammateRegs[index] || '';
    return value.trim() === '' ? 'Please fill this field' : null;
  };

  const allRegNumbers = [leaderReg.trim(), ...teammateRegs.map((v) => v.trim())].filter(Boolean);
  const hasDuplicateWithinForm = new Set(allRegNumbers).size !== allRegNumbers.length;

  const isFormValid =
    teamName.trim() !== '' &&
    teamNameStatus !== 'taken' &&
    teamSize.trim() !== '' &&
    leaderName.trim() !== '' &&
    leaderReg.trim() !== '' &&
    leaderRegStatus !== 'taken' &&
    isEmailValid(leaderEmail) &&
    isPhoneValid(leaderPhone) &&
    teammateRegs.length === teammateCount &&
    teammateRegs.every((v) => v.trim() !== '') &&
    teammateStatuses.every((s) => s !== 'taken') &&
    !hasDuplicateWithinForm &&
    confirmed;

  const handleSubmit = async () => {
    if (!isFormValid) {
      setShowValidation(true);
      return;
    }
    if (isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase.from('team_formation').insert({
        team_name: teamName.trim(),
        team_size: parseInt(teamSize, 10),
        leader_name: leaderName.trim(),
        leader_reg_number: leaderReg.trim(),
        leader_email: leaderEmail.trim(),
        leader_phone: leaderPhone.trim(),
        teammate_reg_numbers: teammateRegs.map((v) => v.trim()),
        confirmed,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      // Log a non-sensitive summary — avoid exposing Supabase internals in production
      console.error('[FestTeamRegistrationForm] Submission failed:', err?.message ?? 'Unknown error');
      if (err && err.code === '23505') {
        // Unique constraint violation — figure out which column tripped it so
        // the right field gets flagged (Postgres includes the constraint/column
        // name in the error message and details).
        const detail = `${err.message || ''} ${err.details || ''}`;
        if (detail.includes('team_name')) {
          setTeamNameStatus('taken');
          setSubmitError('This Team Name is already taken. Please choose a different one.');
        } else if (detail.includes('teammate_reg_numbers')) {
          const match = detail.match(/teammate_reg_numbers:\s*(\S+)/);
          const regValue = match ? match[1] : null;
          if (regValue) {
            const idx = teammateRegs.findIndex((v) => v.trim().toUpperCase() === regValue.toUpperCase());
            if (idx !== -1) {
              setTeammateStatuses((prev) => {
                const next = [...prev];
                next[idx] = 'taken';
                return next;
              });
            }
          }
          setSubmitError('One of the teammate Registration Numbers is already used in another team.');
        } else if (detail.includes('leader_reg_number')) {
          setLeaderRegStatus('taken');
          setSubmitError('Registration Number already part of a team.');
        } else {
          setSubmitError('This entry already exists. Please double-check your Team Name and Registration Number.');
        }
      } else {
        setSubmitError('Something went wrong while submitting. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="board-app-outer-card">
      <div className="team-form-heading">
        <Icon name="groups" />
        <span>{Fest.teamFormEventName} - Team Formation</span>
      </div>
      <div className="merch-instructions-box">
        <div className="merch-instructions-title">
          <Icon name="info" />
          <span>Important Instructions</span>
        </div>
        <ul className="merch-instructions-list">
          {Fest.teamFormInstructions(fest).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="merch-form-row">
        <div className="board-app-card merch-form-card" style={{ flex: '1 1 100%' }}>
          <table className="board-app-table">
            <tbody>
            <tr className="board-app-detail-item">
              <td className="board-app-detail-label">Team Name</td>
              <td className="board-app-detail-value">
                <div className="board-app-input-row">
                  <input
                    id="fest-team-name"
                    type="text"
                    className="board-app-detail-input"
                    placeholder="Enter your Team Name"
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value.toUpperCase());
                      if (teamNameStatus !== 'idle') setTeamNameStatus('idle');
                    }}
                    onBlur={checkTeamNameAvailability}
                    required
                  />
                  {teamNameStatus === 'checking' && (
                    <span className="board-app-inline-status board-app-inline-status--checking">Checking...</span>
                  )}
                  {teamNameStatus === 'taken' && (
                    <span className="board-app-inline-status board-app-inline-status--taken">Team Name Already Taken</span>
                  )}
                  {teamNameStatus === 'available' && (
                    <span className="board-app-inline-status board-app-inline-status--available">Team Name Available</span>
                  )}
                </div>
                {getFieldError('teamName') && (
                  <p className="board-app-field-error">{getFieldError('teamName')}</p>
                )}
              </td>
            </tr>

            <tr className="board-app-detail-item">
              <td className="board-app-detail-label">Team Size</td>
              <td className="board-app-detail-value board-app-detail-value--select">
                <SelectDropdown
                  id="fest-team-size"
                  value={teamSize}
                  onChange={handleTeamSizeChange}
                  options={TEAM_SIZE_OPTIONS}
                  placeholder="Select your Team Size"
                  required
                />
                {getFieldError('teamSize') && (
                  <p className="board-app-field-error">{getFieldError('teamSize')}</p>
                )}
              </td>
            </tr>

            <tr className="board-app-detail-item">
              <td className="board-app-detail-label">Team Leader Name</td>
              <td className="board-app-detail-value">
                <input
                  id="fest-team-leader-name"
                  type="text"
                  className="board-app-detail-input"
                  placeholder="Enter Team Leader's Name"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  required
                />
                {getFieldError('leaderName') && (
                  <p className="board-app-field-error">{getFieldError('leaderName')}</p>
                )}
              </td>
            </tr>

            <tr className="board-app-detail-item">
              <td className="board-app-detail-label">Team Leader Registration Number</td>
              <td className="board-app-detail-value">
                <div className="board-app-input-row">
                  <input
                    id="fest-team-leader-reg"
                    type="text"
                    className="board-app-detail-input"
                    placeholder="Enter Team Leader's Registration Number"
                    value={leaderReg}
                    onChange={(e) => {
                      setLeaderReg(e.target.value.toUpperCase());
                      if (leaderRegStatus !== 'idle') setLeaderRegStatus('idle');
                    }}
                    onBlur={checkLeaderRegAvailability}
                    required
                  />
                  {leaderRegStatus === 'taken' && (
                    <span className="board-app-inline-status board-app-inline-status--taken">Registration Number already part of a team</span>
                  )}
                </div>
                {getFieldError('leaderReg') && (
                  <p className="board-app-field-error">{getFieldError('leaderReg')}</p>
                )}
              </td>
            </tr>

            <tr className="board-app-detail-item">
              <td className="board-app-detail-label">Team Leader VIT Email</td>
              <td className="board-app-detail-value">
                <input
                  id="fest-team-leader-email"
                  type="email"
                  className="board-app-detail-input"
                  placeholder="Enter Team Leader's VIT Email"
                  value={leaderEmail}
                  onChange={(e) => setLeaderEmail(e.target.value)}
                  required
                />
                {getFieldError('leaderEmail') && (
                  <p className="board-app-field-error">{getFieldError('leaderEmail')}</p>
                )}
              </td>
            </tr>

            <tr className="board-app-detail-item">
              <td className="board-app-detail-label">Team Leader Contact Number</td>
              <td className="board-app-detail-value">
                <input
                  id="fest-team-leader-phone"
                  type="tel"
                  className="board-app-detail-input"
                  placeholder="Enter Team Leader's Contact Number"
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                  required
                />
                {getFieldError('leaderPhone') && (
                  <p className="board-app-field-error">{getFieldError('leaderPhone')}</p>
                )}
              </td>
            </tr>

            {teammateRegs.map((value, index) => (
              <tr className="board-app-detail-item" key={`teammate-${index}`}>
                <td className="board-app-detail-label">
                  Registration Number for Teammate {index + 2}
                </td>
                <td className="board-app-detail-value">
                  <div className="board-app-input-row">
                    <input
                      id={`fest-team-mate-reg-${index}`}
                      type="text"
                      className="board-app-detail-input"
                      placeholder={`Enter Teammate ${index + 2}'s Registration Number`}
                      value={value}
                      onChange={(e) => handleTeammateRegChange(index, e.target.value)}
                      onBlur={() => checkTeammateRegAvailability(index)}
                      required
                    />
                    {teammateStatuses[index] === 'taken' && (
                      <span className="board-app-inline-status board-app-inline-status--taken">Registration Number already part of a team</span>
                    )}
                  </div>
                  {getTeammateError(index) && (
                    <p className="board-app-field-error">{getTeammateError(index)}</p>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>

          {showValidation && hasDuplicateWithinForm && (
            <p className="board-app-field-error" style={{ padding: '14px 28px 0' }}>
              Each teammate must have a different Registration Number, and it can't match the Team Leader's.
            </p>
          )}

          <div className="team-confirm-row">
            <label className="team-confirm-label" htmlFor="fest-team-confirm">
              <input
                id="fest-team-confirm"
                type="checkbox"
                className="team-confirm-checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>
                I confirm all listed members have agreed to form this team and already
                registered for the event.
              </span>
            </label>
            {getFieldError('confirmed') && (
              <p className="board-app-field-error">{getFieldError('confirmed')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="board-app-outer-footer">
        {submitted ? (
          <span className="board-app-submitted-msg">
            <Icon name="check_circle" />
            <span>Team registered!</span>
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
  );
}

// Official Google "G" mark, used only on the sign-in button below.
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

// Certificate download — a duplicate of the Team Formation box, but with a
// single "Continue with Google" sign-in action in place of form fields.
// Signing in with Google identifies the participant so their certificate
// (issued/looked up on the backend) can be served to them.
// Popup that previews a certificate. Same look and open/close behaviour as the
// "Roles & Responsibilities" popup in Board Applications.
function CertificatePreviewModal({ open, src, title, onClose }) {
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf1;
    let raf2;
    let timeout;
    if (open) {
      setShouldRender(true);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      timeout = setTimeout(() => setShouldRender(false), 260);
    }
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (timeout) clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shouldRender, onClose]);

  if (!shouldRender || !src) return null;

  return (
    <div
      className={`size-chart-overlay${visible ? ' is-visible' : ''}`}
      onClick={onClose}
    >
      <div className="size-chart-modal roles-responsibilities-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="size-chart-close"
          onClick={onClose}
          aria-label="Close certificate preview"
        >
          <Icon name="close" />
        </button>
        <iframe
          className="roles-responsibilities-pdf"
          src={src}
          title={title}
        />
      </div>
    </div>
  );
}

// Only official VIT student accounts may sign in for certificates.
const ALLOWED_EMAIL_DOMAIN = 'vitstudent.ac.in';
const isAllowedEmail = (email) =>
  typeof email === 'string' && email.toLowerCase().endsWith('@' + ALLOWED_EMAIL_DOMAIN);

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

function FestCertificatesSection() {
  const fest = useDeadlines().deadlines.fest;
  const [session, setSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(null);

  const [certs, setCerts] = useState(null); // null = not loaded yet, [] = loaded, none found
  const [isLoadingCerts, setIsLoadingCerts] = useState(false);
  const [certsError, setCertsError] = useState(null);
  const [busy, setBusy] = useState(null); // { id, kind: 'view' | 'download' }
  const [preview, setPreview] = useState({ open: false, src: null, title: '' });
  // Downloaded certificate files kept as in-memory blob URLs, so viewing and
  // then downloading the same certificate only fetches it once.
  const blobCache = useRef({});

  const clearBlobCache = () => {
    Object.values(blobCache.current).forEach((u) => URL.revokeObjectURL(u));
    blobCache.current = {};
  };
  useEffect(() => clearBlobCache, []);

  // Pick up the existing session on mount, then stay in sync with sign-in /
  // sign-out (including the redirect back from Google).
  useEffect(() => {
    // Reject any session whose email is not an official VIT student email:
    // sign it out immediately and show a clear message.
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

  // Once signed in, look up certificates issued to this email. RLS on the
  // `certificates` table restricts every row to the caller's own email, so
  // this query can only ever return the signed-in user's own certificates.
  useEffect(() => {
    if (!session) {
      setCerts(null);
      setCertsError(null);
      setPreview({ open: false, src: null, title: '' });
      clearBlobCache();
      return;
    }
    let cancelled = false;
    setIsLoadingCerts(true);
    setCertsError(null);
    (async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('id, event_name, certificate_path')
        .order('issued_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('[FestCertificatesSection] Certificate lookup failed:', error.message);
        setCertsError('Could not load your certificates. Please try again.');
        setCerts([]);
      } else {
        setCerts(data ?? []);
      }
      setIsLoadingCerts(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  // Google sign-in leaves the site and comes back at the top of the page.
  // If we left from this section, bring the visitor straight back to it.
  useEffect(() => {
    const selector = peekReturnScroll();
    if (!selector) return;
    return holdScrollOnSelector(selector, { onDone: clearReturnScroll });
  }, []);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setSignInError(null);
    setIsSigningIn(true);
    rememberReturnScroll('#fest-certificates');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
          // hd = hint to Google to show only vitstudent.ac.in accounts.
          // It is only a UI hint; the real checks are above and in the database.
          queryParams: { hd: ALLOWED_EMAIL_DOMAIN, prompt: 'select_account' },
        },
      });
      if (error) throw error;
      // On success the browser is redirected to Google, so there's nothing
      // further to do here — control returns to the app after the OAuth
      // round-trip completes.
    } catch (err) {
      console.error('[FestCertificatesSection] Google sign-in failed:', err?.message ?? 'Unknown error');
      clearReturnScroll();
      setSignInError('Something went wrong while signing in. Please try again.');
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // The bucket is private, so the file is fetched with the signed-in user's
  // session (the storage policy only lets them read their own certificates)
  // and turned into a local blob URL for previewing / downloading.
  const getCertificateUrl = async (cert) => {
    if (blobCache.current[cert.id]) return blobCache.current[cert.id];
    const { data, error } = await supabase.storage
      .from('certificates')
      .download(cert.certificate_path);
    if (error || !data) throw error ?? new Error('Empty response');
    const file = data.type === 'application/pdf' ? data : new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(file);
    blobCache.current[cert.id] = url;
    return url;
  };

  const handleView = async (cert) => {
    if (busy) return;
    setBusy({ id: cert.id, kind: 'view' });
    setCertsError(null);
    try {
      const url = await getCertificateUrl(cert);
      setPreview({ open: true, src: url, title: `${cert.event_name} Certificate` });
    } catch (err) {
      console.error('[FestCertificatesSection] Could not open certificate:', err?.message ?? 'Unknown error');
      setCertsError('Could not open that certificate. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const handleDownload = async (cert) => {
    if (busy) return;
    setBusy({ id: cert.id, kind: 'download' });
    setCertsError(null);
    try {
      const url = await getCertificateUrl(cert);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.event_name} Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('[FestCertificatesSection] Could not download certificate:', err?.message ?? 'Unknown error');
      setCertsError('Could not download that certificate. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="board-app-outer-card">
      <div className="team-form-heading">
        <Icon name="workspace_premium" />
        <span>Certificates</span>
      </div>
      <div className="merch-instructions-box">
        <div className="merch-instructions-title">
          <Icon name="info" />
          <span>Important Instructions</span>
        </div>
        <ul className="merch-instructions-list">
          {Fest.certificateInstructions(fest).map((line, i) => (
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

          {isLoadingCerts && <p className="fest-cert-status">Looking up your certificates…</p>}

          {certsError && (
            <p className="board-app-field-error" style={{ padding: '10px 0' }}>{certsError}</p>
          )}

          {!isLoadingCerts && certs && certs.length === 0 && !certsError && (
            <p className="fest-cert-status">
              No certificate found for this email yet. If you attended the event, please check back
              later or reach us through the Contact Us section below.
            </p>
          )}

          {!isLoadingCerts && certs && certs.length > 0 && (
            <div className="board-app-card">
              <table className="board-app-table">
                <tbody>
                  {certs.map((c) => {
                    const viewing = busy?.id === c.id && busy.kind === 'view';
                    const downloading = busy?.id === c.id && busy.kind === 'download';
                    return (
                      <tr key={c.id} className="board-app-detail-item">
                        <td className="board-app-detail-label">{c.event_name}</td>
                        <td className="board-app-detail-value">
                          <div className="fest-cert-actions">
                            <button
                              type="button"
                              className="fest-cert-btn"
                              onClick={() => handleView(c)}
                              disabled={!!busy}
                              aria-label={`View ${c.event_name} certificate`}
                            >
                              <Icon name={viewing ? 'progress_activity' : 'visibility'} className={viewing ? 'icon-spin' : ''} />
                              <span>{viewing ? 'Opening…' : 'View Certificate'}</span>
                            </button>
                            <button
                              type="button"
                              className="fest-cert-btn"
                              onClick={() => handleDownload(c)}
                              disabled={!!busy}
                              aria-label={`Download ${c.event_name} certificate`}
                            >
                              <Icon name={downloading ? 'progress_activity' : 'download'} className={downloading ? 'icon-spin' : ''} />
                              <span>{downloading ? 'Downloading…' : 'Download Certificate'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <CertificatePreviewModal
        open={preview.open}
        src={preview.src}
        title={preview.title}
        onClose={() => setPreview((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}

// Anonymous post-event feedback — a duplicate of the Team Formation box,
// but with no name/email/phone fields at all, so a submission can never be
// traced back to a participant. Gated open/closed the same way as Team
// Formation and Certificates (see isFeedbackOpen in FestSection).
const FEEDBACK_RATING_LABELS = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

// Clickable 1-5 star picker used for the Overall Rating field below.
function FestStarRating({ id, value, onChange, max = 5 }) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div
      id={id}
      className="fest-star-rating"
      role="radiogroup"
      aria-label="Overall rating"
      onMouseLeave={() => setHoverValue(0)}
    >
      <div className="fest-star-rating-stars">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}${FEEDBACK_RATING_LABELS[star - 1] ? ' - ' + FEEDBACK_RATING_LABELS[star - 1] : ''}`}
            className={`fest-star-btn${star <= displayValue ? ' filled' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onFocus={() => setHoverValue(star)}
            onBlur={() => setHoverValue(0)}
          >
            <Icon name={star <= displayValue ? 'star' : 'star_border'} />
          </button>
        ))}
      </div>
      {displayValue > 0 && (
        <span className="fest-star-rating-label">{FEEDBACK_RATING_LABELS[displayValue - 1]}</span>
      )}
    </div>
  );
}

function FestFeedbackSection() {
  const fest = useDeadlines().deadlines.fest;
  const feedbackEventOptions = Fest.events.map((ev) => ev.eventTitle);

  const [eventName, setEventName] = useState('');
  const [rating, setRating] = useState(0);
  const [highlights, setHighlights] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const getFieldError = (fieldKey) => {
    if (!showValidation) return null;
    switch (fieldKey) {
      case 'eventName':
        return eventName.trim() === '' ? 'Please select an event' : null;
      case 'rating':
        return rating === 0 ? 'Please select a rating' : null;
      case 'highlights':
        return highlights.trim() === '' ? 'Please fill this field' : null;
      case 'suggestions':
        return suggestions.trim() === '' ? 'Please fill this field' : null;
      case 'confirmed':
        return !confirmed ? 'Please confirm before submitting' : null;
      default:
        return null;
    }
  };

  const isFormValid =
    eventName.trim() !== '' &&
    rating > 0 &&
    highlights.trim() !== '' &&
    suggestions.trim() !== '' &&
    confirmed;

  const handleSubmit = async () => {
    if (!isFormValid) {
      setShowValidation(true);
      return;
    }
    if (isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase.from('event_feedback').insert({
        event_name: eventName,
        rating: String(rating),
        highlights: highlights.trim(),
        suggestions: suggestions.trim(),
      });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      console.error('[FestFeedbackSection] Submission failed:', err?.message ?? 'Unknown error');
      setSubmitError('Something went wrong while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="board-app-outer-card">
      <div className="team-form-heading">
        <Icon name="feedback" />
        <span>Feedback</span>
      </div>
      <div className="merch-instructions-box">
        <div className="merch-instructions-title">
          <Icon name="info" />
          <span>Important Instructions</span>
        </div>
        <ul className="merch-instructions-list">
          {Fest.feedbackInstructions(fest).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="merch-form-row">
        <div className="board-app-card merch-form-card" style={{ flex: '1 1 100%' }}>
          <table className="board-app-table">
            <tbody>
              <tr className="board-app-detail-item">
                <td className="board-app-detail-label">Which event is this feedback for</td>
                <td className="board-app-detail-value board-app-detail-value--select">
                  <SelectDropdown
                    id="fest-feedback-event"
                    value={eventName}
                    onChange={setEventName}
                    options={feedbackEventOptions}
                    placeholder="Select the event"
                    required
                  />
                  {getFieldError('eventName') && (
                    <p className="board-app-field-error">{getFieldError('eventName')}</p>
                  )}
                </td>
              </tr>

              <tr className="board-app-detail-item">
                <td className="board-app-detail-label">Overall Rating</td>
                <td className="board-app-detail-value">
                  <FestStarRating id="fest-feedback-rating" value={rating} onChange={setRating} />
                  {getFieldError('rating') && (
                    <p className="board-app-field-error">{getFieldError('rating')}</p>
                  )}
                </td>
              </tr>

              <tr className="board-app-detail-item">
                <td className="board-app-detail-label">What did you enjoy the most?</td>
                <td className="board-app-detail-value">
                  <textarea
                    id="fest-feedback-highlights"
                    className="board-app-detail-textarea"
                    placeholder="Tell us what you enjoyed the most"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    required
                  />
                  {getFieldError('highlights') && (
                    <p className="board-app-field-error">{getFieldError('highlights')}</p>
                  )}
                </td>
              </tr>

              <tr className="board-app-detail-item">
                <td className="board-app-detail-label">What can we improve for future events?</td>
                <td className="board-app-detail-value">
                  <textarea
                    id="fest-feedback-suggestions"
                    className="board-app-detail-textarea"
                    placeholder="Tell us what we can improve"
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    required
                  />
                  {getFieldError('suggestions') && (
                    <p className="board-app-field-error">{getFieldError('suggestions')}</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="team-confirm-row">
            <label className="team-confirm-label" htmlFor="fest-feedback-confirm">
              <input
                id="fest-feedback-confirm"
                type="checkbox"
                className="team-confirm-checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>
                I understand this feedback is submitted anonymously and cannot be linked back to me.
              </span>
            </label>
            {getFieldError('confirmed') && (
              <p className="board-app-field-error">{getFieldError('confirmed')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="board-app-outer-footer">
        {submitted ? (
          <span className="board-app-submitted-msg">
            <Icon name="check_circle" />
            <span>Thank you for your feedback!</span>
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
  );
}

function FestContent() {
  const fest = useDeadlines().deadlines.fest;
  const { features } = useFeatures();
  const [activeEvent, setActiveEvent] = useState(0);

  // Team registration should only be shown between teamRegOpenDate and
  // teamRegClosingDate — before it opens or after it closes, the whole
  // section (not just the form) stays out of the page.
  const now = useNow();
  const isTeamRegOpen = now >= fest.teamRegOpenDate && now <= fest.teamRegClosingDate;

  // Certificates should only be shown between certificatesOpenDate and
  // certificatesClosingDate — before they open or after they close, the
  // whole section (sign-in box included) stays out of the page.
  const isCertificatesOpen = now >= fest.certificatesOpenDate && now <= fest.certificatesClosingDate;

  // Feedback should only be shown between feedbackOpenDate and
  // feedbackClosingDate — before it opens or after it closes, the whole
  // section (form included) stays out of the page.
  const isFeedbackOpen = now >= fest.feedbackOpenDate && now <= fest.feedbackClosingDate;

  // Once the active event's end date + end time has passed, the Register button
  // is replaced by the final registration count (event.regCount, e.g. "80/80").
  const currentEvent = Fest.events[activeEvent];
  const eventEnd = festParseEventEnd(currentEvent.date, currentEvent.time);
  const isEventOver = eventEnd ? now >= eventEnd : false;

  const festPocs = Fest.events.flatMap((ev, eventIndex) =>
    (ev.pocs || []).map((poc) => ({
      ...poc,
      eventIndex,
      eventTitle: ev.eventTitle,
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setActiveEvent((prev) => (prev + 1) % Fest.events.length);
    }, 10000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once — functional updater doesn't need activeEvent in deps

  const titleRowRef = useRef(null);

  const touchState = useRef({ x: 0, y: 0, tracking: false });
  const SWIPE_THRESHOLD = 40;

  const handlePremierTouchStart = (e) => {
    const t = e.touches[0];
    touchState.current = { x: t.clientX, y: t.clientY, tracking: true };
  };

  const handlePremierTouchMove = () => {};

  const handlePremierTouchEnd = (e) => {
    if (!touchState.current.tracking) return;
    touchState.current.tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchState.current.x;
    const dy = t.clientY - touchState.current.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

    setActiveEvent((prev) => {
      const count = Fest.events.length;
      if (dx < 0)
        return (prev + 1) % count;
      return (prev - 1 + count) % count;
    });
  };

  return (
    <div className="fest-wrap" id="fest">
      <section className="fest-hero" id="fest-hero">
        <div className="fest-hero-content">
          <h1 className="fest-hero-title">
            <span className="fest-title-row" ref={titleRowRef}>
              <img className="fest-title-logo" src={Fest.logo} alt="Fest 2026 logo" />
            </span>
          </h1>
        </div>

      </section>
      <section className="fest-section" id="fest-premier" style={{ paddingTop: 0, paddingBottom: features.festPoc ? 0 : 48 }}>
        <div className="fest-shell">
          <div
            className="fest-premier-card"
            onTouchStart={handlePremierTouchStart}
            onTouchMove={handlePremierTouchMove}
            onTouchEnd={handlePremierTouchEnd}
          >
            <div className="fest-premier-media">
              <img src={Fest.events[activeEvent].eventImage} alt={Fest.events[activeEvent].eventTitle} loading="lazy" />
            </div>

            <div className="fest-premier-content">
              <div className="fest-premier-top">
                <div>
                  <h2 className="fest-premier-title">
                    {Fest.events[activeEvent].eventTitle}
                  </h2>
                  <p className="fest-premier-subtitle">{Fest.events[activeEvent].org}</p>
                </div>
                {Fest.events[activeEvent].tag && (
                  <span className="fest-premier-tag">{Fest.events[activeEvent].tag}</span>
                )}
              </div>

              <div className="fest-premier-rule" />

              <p className="fest-premier-sub">{Fest.events[activeEvent].eventDesc}</p>

              <div className="fest-premier-rule" />

              <div className="fest-premier-info-row">
                <div className="fest-premier-info-cell">
                  <Icon name="schedule" />
                  <span>{Fest.events[activeEvent].time}</span>
                </div>
                <div className="fest-premier-info-cell">
                  <Icon name="calendar_month" />
                  <span>{Fest.events[activeEvent].date}</span>
                </div>
                <div className="fest-premier-info-cell">
                  <Icon name="groups" />
                  <span>{Fest.events[activeEvent].teamSize}</span>
                </div>
                {isEventOver ? (
                  <div className="fest-premier-info-cell">
                    <Icon name="how_to_reg" />
                    <span>
                      {currentEvent.regCount
                        ? `${currentEvent.regCount} Registered`
                        : 'Registration Closed'}
                    </span>
                  </div>
                ) : (
                  <a
                    href={currentEvent.registerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="fest-premier-info-cell fest-premier-register-cell"
                  >
                    <span>Register Now</span>
                    <Icon name="arrow_forward" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {Fest.events.length > 1 ? (
            <div
              className="events-timeline"
              style={{ width: `${Fest.events.length * 250 + (Fest.events.length - 1) * 24}px` }}
            >
              <div className="events-timeline-line" />
              <div className="events-timeline-end events-timeline-end-left" />
              <div className="events-timeline-end events-timeline-end-right" />
              {Fest.events.map((ev, i) => (
                <button
                  type="button"
                  className="events-timeline-item"
                  key={i}
                  onClick={() => setActiveEvent(i)}
                  aria-pressed={activeEvent === i}
                  aria-label={`Show ${ev.eventTitle} event`}
                  style={{ left: `${i * (250 + 24) + 250 / 2}px`, transform: 'translateX(-50%)' }}
                >
                  <div className="events-timeline-label">
                    <span>{ev.eventTitle}</span>
                  </div>
                  <div className={`events-timeline-marker${activeEvent === i ? ' active' : ''}`} />
                  {features.festPoc && <div className="events-timeline-connector" />}
                </button>
              ))}
            </div>
          ) : festPocs.length > 1 ? (
            <div
              className="events-timeline-fork"
              style={{ width: `${festPocs.length * 250 + (festPocs.length - 1) * 24}px` }}
              aria-hidden="true"
            >
              <div className="events-timeline-fork-trunk" />
              <div className="events-timeline-fork-bar" />
              {features.festPoc && festPocs.map((_, i) => (
                <div
                  key={i}
                  className="events-timeline-fork-branch"
                  style={{ left: `${i * (250 + 24) + 250 / 2}px` }}
                />
              ))}
            </div>
          ) : (
            <div className="events-timeline-single" aria-hidden="true" />
          )}

          {features.festPoc && (
            <div className="fest-mobile-connector">
              <div className="fest-mobile-line" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>
      {features.festPoc && (
        <section className="fest-section" id="fest-featured" style={{ paddingTop: 44, paddingBottom: 32 }}>
          <FestPocCarousel
            pocs={festPocs}
            activeEventIndex={activeEvent}
            eventsCount={Fest.events.length}
            onSelect={setActiveEvent}
          />
          {Fest.events.length > 1 && (
            <div className="fest-mobile-dots">
              {Fest.events.map((ev, i) => (
                <button
                  type="button"
                  key={i}
                  className={`fest-mobile-dot${activeEvent === i ? ' active' : ''}`}
                  onClick={() => setActiveEvent(i)}
                  aria-pressed={activeEvent === i}
                  aria-label={`Show ${ev.eventTitle} event`}
                />
              ))}
            </div>
          )}
        </section>
      )}
      {features.festSponsor && (
        <section className="fest-section" id="fest-partners" style={{ paddingTop: 32 }}>
          <div className="fest-shell">
            <div className="fest-sponsors">
              <h2 className="fest-sponsors-heading">Sponsor</h2>
              <p className="fest-sponsors-sub">{Fest.sponsorsSubtext}</p>

              <div className="fest-sponsor-single-wrap">
                <div className="fest-sponsor-single">
                  <div className="partners-cell-top">
                    <span className="partners-name">{Fest.sponsor.name}</span>
                  </div>
                  <div className="partners-cell-logo">
                    <img src={Fest.sponsor.logo} alt={Fest.sponsor.name} loading="lazy" />
                  </div>
                  <div className="partners-cell-bottom">
                    <a
                      className="partners-view-btn"
                      href={Fest.sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View website <Icon name="north_east" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {isTeamRegOpen && (
        <section className="fest-section" id="fest-team-registration" style={{ paddingTop: 32 }}>
          <div className="shell shell-board-app">
            <FestTeamRegistrationForm />
          </div>
        </section>
      )}
      {isCertificatesOpen && (
        <section className="fest-section" id="fest-certificates" style={{ paddingTop: 32 }}>
          <div className="shell shell-board-app">
            <FestCertificatesSection />
          </div>
        </section>
      )}
      {isFeedbackOpen && (
        <section className="fest-section" id="fest-feedback" style={{ paddingTop: 32 }}>
          <div className="shell shell-board-app">
            <FestFeedbackSection />
          </div>
        </section>
      )}
    </div>
  );
}

// Dates come from Supabase; render nothing until they have loaded.
function FestSection() {
  const { deadlines } = useDeadlines();
  if (!deadlines?.fest) return null;
  return <FestContent />;
}

export default FestSection;