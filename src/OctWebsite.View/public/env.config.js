// Runtime environment overrides for the Angular app.
// Set window.__env.apiUrl to point the dashboard at the desired API host without rebuilding.
// Example:
//   window.__env = { apiUrl: 'https://eshoptest.octimsbd.com' };
(function applyRuntimeEnv(global) {
  global.__env = global.__env || {};
})(this);
