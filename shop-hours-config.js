/* Local regular schedule, NOT a live Google Maps feed.
 * Source: exact Google Maps listing, manually checked on 2026-10-16.
 * Exact Maps link resolves to D&S Automotive Repair Solutions, 3027 S High St,
 * Columbus, OH 43207. All seven daily hours matched TASK 010.
 * Manual snapshot stored locally. No holiday hours are assumed.
 * null = unknown; [] = closed; exceptions use Columbus YYYY-MM-DD.
 */
(function (root) {
  const config = {
    timeZone: 'America/New_York',
    source: 'https://maps.app.goo.gl/gat129U5YUDfvwSGA?g_st=ic',
    googleMapsVerified: true,
    sourceStatus: 'Exact listing name, address and all seven daily hours manually verified',
    verifiedAt: '2026-10-16',
    weekly: {
      Monday: [['08:30', '17:30']],
      Tuesday: [['08:30', '17:30']],
      Wednesday: [['08:30', '17:30']],
      Thursday: [['08:30', '17:30']],
      Friday: [['08:30', '17:30']],
      Saturday: [['09:00', '13:00']],
      Sunday: []
    },
    exceptions: {}
  };
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.SHOP_HOURS_CONFIG = config;
})(globalThis);
