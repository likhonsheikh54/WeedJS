// weeddom.config.js
window.WEEDDOM_CONFIG = {
  gtm: {
    id: 'GTM-PKCRM67D', // Your actual GTM container ID
    async: true
  },
  indexNow: {
    apiKey: 'eeacba0eddf742ef8de23c43938d4cb1', // Your actual IndexNow API key
    submitInterval: 3600 // seconds between automatic submissions
  },
  analytics: {
    enabled: true,
    dashboard: {
      position: 'bottom-right', // Options: 'bottom-right', 'bottom-left', etc.
      theme: 'dark' // Options: 'dark' or 'light'
    }
  },
  breadcrumbs: {
    separator: ' › ',
    containerClass: 'weeddom-breadcrumbs',
    linkClass: 'weeddom-link'
  },
  scanner: {
    enabled: true
  },
  integration: {
    statusEndpoint: '/integration/status', // Client-side status route
    scriptURL: 'https://weed-js.vercel.app/WeedDOM.js' // URL to the WeedDOM script (for reference)
  }
};
