const policies = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
    '*.openstreetmap.org',
    'https://api.mapbox.com/*',
  ],
  'child-src': ["'self'", 'blob:*'],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:*',
    'https://*.stripe.com',
    'https://raw.githubusercontent.com',
    'https://*.openstreetmap.org',
  ],
  'font-src': ["'self'"],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://*.openstreetmap.org',
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://api.stripe.com',
    'https://maps.googleapis.com',
    'https://*.openstreetmap.org',
    'https://*.tiles.mapbox.com',
    'https://api.mapbox.com',
    'https://events.mapbox.com',
  ],
  'worker-src': ['blob:'],
};

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`;
    }
    return '';
  })
  .join('; ');
