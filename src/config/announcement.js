// The capsule shown just under the header pill.
// Point ANNOUNCEMENT at one of the presets below (or add a new one).
// Set `show: false` on the active one to hide the capsule.
const ANNOUNCEMENTS = {
  merchandise: {
    show: true,
    icon: 'shopping_bag',
    text: 'MERCHANDISE 2026 IS LIVE',
    href: '#merchandise',
  },
  certificates: {
    show: true,
    icon: 'workspace_premium',
    text: 'GRAVITAS 2026 CERTIFICATES',
    href: '#fest-certificates',
  },
  fest: {
    show: true,
    icon: 'festival',
    text: 'GRAVITAS 2026',
    href: '#fest',
  },
  teamFormation: {
    show: true,
    icon: 'groups',
    text: ' TEAM FORMATION',
    href: '#fest-team-registration',
  },
  boardApplication: {
    show: true,
    icon: 'how_to_reg',
    text: 'BOARD APPLICATION 2027',
    href: '#fest',
  },
};

export const ANNOUNCEMENT = ANNOUNCEMENTS.certificates;
