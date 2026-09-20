import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/Icon';
import { Fest } from '../database/Data';
import { TeamSocialIcon } from './Team';
import { BoardPositionDropdown } from './BoardApplication';
import { supabase } from '../shared/supabaseClient';

// Toggle to control whether the Sponsor section is displayed.
// Set to false to hide the sponsor box entirely.
function shouldShowSponsor() {
  return true;
}

// Toggle to control whether the POC (Point of Contact) section is displayed.
// Set to false to hide the POC cards — the event container above it (the
// premier card + timeline) will still be shown either way.
function shouldShowPoc() {
  return true;
}

function festGetTimeLeft(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function useFestCountdown(target) {
  const [time, setTime] = useState(() => festGetTimeLeft(target));
  useEffect(() => {
    const id = setInterval(() => setTime(festGetTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// Ticking clock used to gate sections on/off around a date window (e.g. the
// team registration form, which should only render between its open and
// close dates). Re-renders every `intervalMs` so the gate flips live without
// a page refresh, the same way useFestCountdown keeps timers current.
export function useFestNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function festPad(n) {
  return String(n).padStart(2, '0');
}

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

  const iso = `${year}-${festPad(month)}-${festPad(dm[1])}T${festPad(hour)}:${tm[2]}:00${FEST_TZ_OFFSET}`;
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
      onSelect && onSelect((activeEventIndex - 1 + eventsCount) % eventsCount);
    } else if (singleEventMobileSwitching) {
      setActivePocIndex((prev) => (prev - 1 + pocs.length) % pocs.length);
    } else if (trackRef.current) {
      trackRef.current.scrollBy({ left: -(250 + 24), behavior: 'smooth' });
    }
  };
  const goNext = () => {
    if (eventsCount > 1) {
      onSelect && onSelect((activeEventIndex + 1) % eventsCount);
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
                onSelect && onSelect(a.eventIndex);
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
                  <TeamSocialIcon type="contact" />
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
          {Fest.teamFormInstructions.map((line, i) => (
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
                <BoardPositionDropdown
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

function FestGalleryUploadSection() {
  const time = useFestCountdown(Fest.shotsUploadDate);

  const isShotsUploadLive = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
  const driveLink = Fest.galleryDriveLink;

  if (!isShotsUploadLive) return null;

  return (
    <section className="fest-section" id="fest-gallery-uploads" style={{ paddingTop: 32 }}>
      <div className="shell shell-board-app">
        <div className="fest-uploads">
          <div className="board-app-outer-card">
            <h2 className="fest-sponsors-heading">Share Your Shots</h2>
            <p className="fest-sponsors-sub">
              {Fest.galleryUploadDesc}
            </p>

            <div className="board-app-card">
              <table className="board-app-table">
                <tbody>
                  <tr className="board-app-detail-item">
                    <td className="board-app-detail-label">Photos / Videos Upload Drive link</td>
                    <td className="board-app-detail-value">
                      <a
                        href={driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fest-upload-drive-link"
                      >
                        {driveLink}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FestSection() {
  const [activeEvent, setActiveEvent] = useState(0);

  // Team registration should only be shown between teamRegOpenDate and
  // teamRegClosingDate — before it opens or after it closes, the whole
  // section (not just the form) stays out of the page.
  const now = useFestNow();
  const isTeamRegOpen = now >= Fest.teamRegOpenDate && now <= Fest.teamRegClosingDate;

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
      <section className="fest-section" id="fest-premier" style={{ paddingTop: 0, paddingBottom: shouldShowPoc() ? 0 : 48 }}>
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
                  {shouldShowPoc() && <div className="events-timeline-connector" />}
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
              {shouldShowPoc() && festPocs.map((_, i) => (
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

          {shouldShowPoc() && (
            <div className="fest-mobile-connector">
              <div className="fest-mobile-line" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>
      {shouldShowPoc() && (
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
      {shouldShowSponsor() && (
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
      <FestGalleryUploadSection />
    </div>
  );
}

export default FestSection;