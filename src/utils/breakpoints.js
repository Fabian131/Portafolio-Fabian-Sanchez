/**
 * Single source of truth for responsive breakpoints.
 * Must stay in sync with Tailwind config: sm=640, md=768, lg=1024
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
};

export const MEDIA_QUERIES = {
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
};

/** Max viewport width to consider "mobile" (exclusive). */
export const MOBILE_MAX = BREAKPOINTS.MD - 1;
