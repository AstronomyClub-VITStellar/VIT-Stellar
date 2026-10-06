import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import SocialIcon from '@/components/ui/SocialIcon';
import { Team } from '@/content/team';

const TEAM_YEARS = Object.keys(Team).map(Number).sort((a, b) => b - a);

function TeamCard({ member, showSocials = false }) {
  return (
    <div className={`team-card team-card-${member.offset || "none"}`}>
      <div className="team-card-photo">
        <img src={member.photo} alt={member.name} loading="lazy" />
      </div>
      <div className={`team-card-body${showSocials ? " team-card-body-social" : ""}`}>
        <div className="team-card-name">{member.name}</div>
        <div className="team-card-role">{member.role}</div>
        {member.desc && <p className="team-card-desc">{member.desc}</p>}
        {showSocials && (
          <div className="team-card-socials">
            
            {member.links?.linkedin && (
              <a
                className="team-social-btn team-social-linkedin"
                href={member.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} LinkedIn`}
              >
                <SocialIcon type="linkedin" />
              </a>
            )}
            {member.links?.github && (
              <a
                className="team-social-btn team-social-github"
                href={member.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} GitHub`}
              >
                <SocialIcon type="github" />
              </a>
            )}
            {member.links?.website && (
              <a
                className="team-social-btn team-social-website"
                href={member.links.website}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} website`}
              >
                <SocialIcon type="website" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamYearDropdown({ year, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <span className="team-year-dropdown" ref={ref}>
      <button
        type="button"
        className="team-year-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {year}
        <Icon name="expand_more" className={`team-year-chevron${open ? " open" : ""}`} />
      </button>

      {open && (
        <ul className="team-year-menu" role="listbox" aria-label="Select board year">
          {TEAM_YEARS.map((y) => (
            <li key={y}>
              <button
                type="button"
                role="option"
                aria-selected={y === year}
                className={`team-year-option${y === year ? " active" : ""}`}
                onClick={() => {
                  onChange(y);
                  setOpen(false);
                }}
              >
                {y}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

function TeamSection() {
  const [teamYear, setTeamYear] = useState(TEAM_YEARS[0]);
  const activeBoard = Team[teamYear];

  return (
    <section className="section" id="team">
      <div className="shell">
        <div className="team-header">
          <h2 className="team-heading">
            MEET THE TEAM <TeamYearDropdown year={teamYear} onChange={setTeamYear} />
          </h2>
        </div>

        <div className="team-stage">

          {activeBoard.team.map((member) => (
            <TeamCard
              member={member}
              showSocials={member.name !== ""}
              key={`${teamYear}-${member.name}`}
            />
          ))}
        </div>

        <div className="team-grid team-grid-close">
          {activeBoard.grid1.map((member) => (
            <TeamCard member={member} showSocials key={`${teamYear}-grid1-${member.name}`} />
          ))}
        </div>

        <div className="team-grid">
          {activeBoard.grid2.map((member) => (
            <TeamCard member={member} showSocials key={`${teamYear}-grid2-${member.name}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;