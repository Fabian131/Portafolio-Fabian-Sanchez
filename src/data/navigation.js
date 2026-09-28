/**
 * Navigation section IDs — Single Source of Truth for DOM anchors.
 * Labels are resolved via i18n as t(`nav.${id}`) in the consuming hook.
 * DO NOT add label/labelKey here — that belongs in translations/.
 */
export const navigationLinks = [
  { id: 'home'     },
  { id: 'about'    },
  { id: 'skills'   },
  { id: 'projects' },
  { id: 'contact'  },
];
