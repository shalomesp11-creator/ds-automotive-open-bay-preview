/* Local schedule, NOT a live Google feed. No opening times have been verified.
 * null = unknown; [] = confirmed closed; [['08:00', '17:00']] = example format ONLY.
 * Replace null only after verifying the exact linked Columbus business.
 * Sunday closure is supplied by the project owner, not verified from Google.
 * Dates in exceptions use Columbus YYYY-MM-DD; null means hours need confirmation.
 * No holiday dates or hours are assumed. Missing exceptions use regular hours.
 */
(function (root) {
  const config = {
    timeZone: 'America/New_York',
    source: 'https://maps.app.goo.gl/gat129U5YUDfvwSGA?g_st=ic',
    googleMapsVerified: false,
    verifiedAt: null,
    weekly: {
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      Saturday: null,
      Sunday: []
    },
    exceptions: {}
  };
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.SHOP_HOURS_CONFIG = config;
})(globalThis);
