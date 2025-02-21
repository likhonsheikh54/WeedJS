/**
 * WeedDOM 🌿 - Advanced Web Integration & Domain Analytics Toolkit
 * Version: 1.1.0
 * Repository: https://github.com/likhonsheikh54/WeedJS
 *
 * Author: likhonsheikh54 (GitHub: likhon sheikh)
 * Powered by: https://t.me/RecentCoders & https://www.v4os.org
 * Co-powered by: https://vortexcybersecurity.org
 */

(() => {
  'use strict';

  // -------------------------
  // Enhanced Configuration
  // -------------------------
  const config = {
    gtm: { id: 'GTM-PKCRM67D', async: true },
    indexNow: { 
      apiKey: 'eeacba0eddf742ef8de23c43938d4cb1', 
      submitInterval: 3600,
      retryAttempts: 3
    },
    breadcrumbs: { 
      separator: ' › ', 
      containerClass: 'weeddom-breadcrumbs', 
      linkClass: 'weeddom-link',
      showHome: true
    },
    scanner: { 
      enabled: true,
      scanInterval: 3600000, // 1 hour
      maxDomains: 100
    },
    loader: {
      showOnce: true,
      duration: 2000,
      fadeOutDuration: 500,
      style: 'modern' // 'modern' or 'classic'
    }
  };

  // -------------------------
  // Global State Management
  // -------------------------
  const integrationStatus = {
    gtmMounted: false,
    sitemapFound: false,
    indexNowSubmission: 'Pending',
    connectedDomains: [],
    backlinksData: null,
    initialized: false,
    lastScan: null,
    errors: []
  };

  // Prevent multiple executions
  if (window.WEEDDOM_LOADED) return;
  window.WEEDDOM_LOADED = true;

  // -------------------------
  // Storage Management
  // -------------------------
  const storage = {
    prefix: 'weeddom_',
    get: (key) => {
      try {
        return localStorage.getItem(storage.prefix + key);
      } catch (e) {
        console.error('[WeedDOM] Storage error:', e);
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(storage.prefix + key, value);
      } catch (e) {
        console.error('[WeedDOM] Storage error:', e);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(storage.prefix + key);
      } catch (e) {
        console.error('[WeedDOM] Storage error:', e);
      }
    },
    clear: () => {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(storage.prefix))
          .forEach(key => localStorage.removeItem(key));
      } catch (e) {
        console.error('[WeedDOM] Storage clear error:', e);
      }
    }
  };

  // -------------------------
  // Error Handling
  // -------------------------
  const errorHandler = {
    log: (error, context) => {
      const errorObj = {
        timestamp: new Date().toISOString(),
        error: error.message || error,
        context,
        stack: error.stack
      };
      integrationStatus.errors.push(errorObj);
      console.error(`[WeedDOM] Error in ${context}:`, error);
    },
    getErrors: () => integrationStatus.errors,
    clearErrors: () => {
      integrationStatus.errors = [];
    }
  };

  // -------------------------
  // GTM Integration
  // -------------------------
  const mountGTM = () => {
    try {
      if (!config.gtm.id) {
        throw new Error('GTM ID not configured');
      }

      // Check for existing GTM
      if (document.querySelector(`script[src*="${config.gtm.id}"]`)) {
        console.log('[WeedDOM] GTM already mounted.');
        integrationStatus.gtmMounted = true;
        return;
      }

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];

      // Create and append GTM script
      const gtmScript = document.createElement('script');
      gtmScript.async = config.gtm.async;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtm.id}`;
      gtmScript.onerror = () => errorHandler.log(new Error('GTM script failed to load'), 'GTM');
      document.head.appendChild(gtmScript);

      // Add noscript iframe
      document.addEventListener('DOMContentLoaded', () => {
        const gtmNoScript = document.createElement('noscript');
        gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtm.id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(gtmNoScript, document.body.firstChild);
      });

      integrationStatus.gtmMounted = true;
      console.log('[WeedDOM] GTM mounted:', config.gtm.id);
    } catch (error) {
      errorHandler.log(error, 'GTM mounting');
    }
  };

  // -------------------------
  // IndexNow Integration
  // -------------------------
  const DOMAIN = window.location.hostname;
  const INDEXNOW_KEY_LOCATION = `https://${DOMAIN}/${config.indexNow.apiKey}.txt`;

  const checkSitemap = async () => {
    try {
      const sitemapURL = `https://${DOMAIN}/sitemap.xml`;
      const response = await fetch(sitemapURL, { method: 'HEAD' });
      
      integrationStatus.sitemapFound = response.ok;
      console.log('[WeedDOM] Sitemap status:', response.ok ? 'Found' : 'Not found');
      
      return response.ok;
    } catch (error) {
      errorHandler.log(error, 'Sitemap check');
      integrationStatus.sitemapFound = false;
      return false;
    }
  };

  const submitIndexNow = async (urlList) => {
    try {
      const requestBody = {
        host: DOMAIN,
        key: config.indexNow.apiKey,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList
      };

      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      integrationStatus.indexNowSubmission = 'Success';
      console.log('[WeedDOM] IndexNow Response:', data);
      return data;
    } catch (error) {
      errorHandler.log(error, 'IndexNow submission');
      integrationStatus.indexNowSubmission = 'Error';
      throw error;
    }
  };

  const alternativeIndexNowSubmission = () => {
    try {
      const anchors = document.getElementsByTagName('a');
      const urlSet = new Set();
      
      for (let i = 0; i < anchors.length; i++) {
        const href = anchors[i].href;
        if (href && href.includes(DOMAIN)) {
          urlSet.add(href);
        }
      }

      const urlList = Array.from(urlSet);
      if (urlList.length === 0) {
        console.log('[WeedDOM] No internal URLs found for alternative submission.');
        integrationStatus.indexNowSubmission = 'No URLs found';
        return Promise.resolve();
      }

      console.log('[WeedDOM] Alternative URL list generated:', urlList);
      return submitIndexNow(urlList);
    } catch (error) {
      errorHandler.log(error, 'Alternative IndexNow submission');
      return Promise.reject(error);
    }
  };

  const enhancedIndexNowSubmission = async () => {
    try {
      const hasSitemap = await checkSitemap();
      
      if (!hasSitemap) {
        return alternativeIndexNowSubmission();
      }

      const defaultURLs = [
        window.location.href,
        `https://${DOMAIN}/`,
        `https://${DOMAIN}/sitemap.xml`
      ];

      return submitIndexNow(defaultURLs);
    } catch (error) {
      errorHandler.log(error, 'Enhanced IndexNow submission');
    }
  };

  // -------------------------
  // Dynamic Breadcrumbs
  // -------------------------
  const generateBreadcrumbs = () => {
    try {
      const pathArray = window.location.pathname.split('/').filter(el => el);
      const breadcrumbsContainer = document.createElement('nav');
      
      breadcrumbsContainer.setAttribute('aria-label', 'breadcrumb');
      breadcrumbsContainer.className = config.breadcrumbs.containerClass;
      breadcrumbsContainer.style.cssText = `
        padding: 10px;
        background-color: #f8f9fa;
        font-size: 14px;
        margin-bottom: 15px;
        border-radius: 4px;
      `;

      let breadcrumbsHTML = config.breadcrumbs.showHome ? 
        `<a href="/" class="${config.breadcrumbs.linkClass}">Home</a>` : '';

      let cumulativePath = '';
      pathArray.forEach((segment, index) => {
        cumulativePath += '/' + segment;
        const displayName = decodeURIComponent(segment)
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        
        if (index === 0 || breadcrumbsHTML !== '') {
          breadcrumbsHTML += config.breadcrumbs.separator;
        }
        
        breadcrumbsHTML += `<a href="${cumulativePath}" class="${config.breadcrumbs.linkClass}">${displayName}</a>`;
      });

      breadcrumbsContainer.innerHTML = breadcrumbsHTML;
      document.body.insertBefore(breadcrumbsContainer, document.body.firstChild);
    } catch (error) {
      errorHandler.log(error, 'Breadcrumbs generation');
    }
  };

  // -------------------------
  // Domain Scanner
  // -------------------------
  const scanConnectedDomains = () => {
    try {
      const anchors = document.getElementsByTagName('a');
      const externalDomains = new Set();
      
      for (let i = 0; i < anchors.length; i++) {
        const href = anchors[i].href;
        if (href && !href.includes(DOMAIN)) {
          try {
            const urlObj = new URL(href);
            externalDomains.add(urlObj.hostname);
          } catch (e) {
            // Ignore invalid URLs
          }
        }
      }

      integrationStatus.connectedDomains = Array.from(externalDomains)
        .slice(0, config.scanner.maxDomains);
      
      console.log('[WeedDOM] External domains found:', integrationStatus.connectedDomains);
      integrationStatus.lastScan = new Date().toISOString();
    } catch (error) {
      errorHandler.log(error, 'Domain scanning');
    }
  };

  const scanBacklinks = () => {
    try {
      console.log('[WeedDOM] Initiating backlinks scan...');
      
      // Simulated backlinks scan
      setTimeout(() => {
        integrationStatus.backlinksData = {
          totalBacklinks: 1234,
          referringDomains: 56,
          details: [
            { domain: 'example1.com', backlinks: 234 },
            { domain: 'example2.com', backlinks: 100 }
          ],
          lastUpdated: new Date().toISOString()
        };
        
        console.log('[WeedDOM] Backlinks data:', integrationStatus.backlinksData);
      }, 2000);
    } catch (error) {
      errorHandler.log(error, 'Backlinks scanning');
    }
  };

  // -------------------------
  // Success Loader
  // -------------------------
  const showSuccessLoader = () => {
    try {
      if (config.loader.showOnce && storage.get('loader_shown') === 'true') {
        console.log('[WeedDOM] Loader already shown in this session.');
        return;
      }

      // Create and style overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity ${config.loader.fadeOutDuration}ms ease;
      `;

      // Create success image
      const successImg = document.createElement('img');
      successImg.src = 'https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/success.svg';
      successImg.alt = 'Integration Success';
      successImg.style.cssText = `
        max-width: 200px;
        max-height: 200px;
        animation: weeddom-pulse 2s infinite;
      `;

      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes weeddom-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);

      overlay.appendChild(successImg);
      document.body.appendChild(overlay);

      // Mark loader as shown
      storage.set('loader_shown', 'true');

      // Handle loader removal
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, config.loader.fadeOutDuration);
      }, config.loader.duration);
    } catch (error) {
      errorHandler.log(error, 'Success loader');
    }
  };

  // -------------------------
  // Initialization
  // -------------------------
  const initialize = async () => {
    try {
      if (integrationStatus.initialized) return;

      mountGTM();
      await enhancedIndexNowSubmission();
      generateBreadcrumbs();
      
      if (config.scanner.enabled) {
        scanConnectedDomains();
        scanBacklinks();
      }

      integrationStatus.initialized = true;
      setTimeout(showSuccessLoader, 1000);

      // Set up periodic scanning if enabled
      if (config.scanner.enabled && config.scanner.scanInterval) {
        setInterval(() => {
          scanConnectedDomains();
          scanBacklinks();
        }, config.scanner.scanInterval);
      }
    } catch (error) {
      errorHandler.log(error, 'Initialization');
    }
  };

// Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // -------------------------
  // Global API
  // -------------------------
  window.WeedDOM = {
    // GTM Methods
    gtm: {
      push: (data) => {
        try {
          if (window.dataLayer && Array.isArray(window.dataLayer)) {
            window.dataLayer.push(data);
            console.log('[WeedDOM] GTM event pushed:', data);
            return true;
          }
          console.warn('[WeedDOM] dataLayer not found.');
          return false;
        } catch (error) {
          errorHandler.log(error, 'GTM push');
          return false;
        }
      }
    },

    // IndexNow Methods
    indexNow: {
      submit: async (urls) => {
        try {
          if (!Array.isArray(urls)) {
            throw new Error('URLs must be provided as an array');
          }
          return await submitIndexNow(urls);
        } catch (error) {
          errorHandler.log(error, 'IndexNow API');
          throw error;
        }
      },
      getStatus: () => integrationStatus.indexNowSubmission
    },

    // Scanner Methods
    scanner: {
      analyze: () => {
        return new Promise(resolve => {
          try {
            scanConnectedDomains();
            scanBacklinks();
            setTimeout(() => {
              resolve({
                domains: integrationStatus.connectedDomains,
                backlinks: integrationStatus.backlinksData,
                lastScan: integrationStatus.lastScan
              });
            }, 2500);
          } catch (error) {
            errorHandler.log(error, 'Scanner analysis');
            resolve({
              error: error.message,
              timestamp: new Date().toISOString()
            });
          }
        });
      },
      getDomains: () => integrationStatus.connectedDomains,
      getBacklinks: () => integrationStatus.backlinksData
    },

    // Configuration Methods
    config: {
      get: () => ({ ...config }),
      update: (newConfig) => {
        try {
          Object.keys(newConfig).forEach(key => {
            if (config.hasOwnProperty(key)) {
              Object.assign(config[key], newConfig[key]);
            }
          });
          console.log('[WeedDOM] Configuration updated');
          return true;
        } catch (error) {
          errorHandler.log(error, 'Config update');
          return false;
        }
      }
    },

    // Status Methods
    status: {
      get: () => ({ ...integrationStatus }),
      getErrors: () => errorHandler.getErrors(),
      clearErrors: () => errorHandler.clearErrors()
    },

    // Session Management
    session: {
      reset: () => {
        try {
          storage.clear();
          console.log('[WeedDOM] Session storage reset');
          return true;
        } catch (error) {
          errorHandler.log(error, 'Session reset');
          return false;
        }
      },
      getData: () => {
        try {
          return {
            loaderShown: storage.get('loader_shown') === 'true',
            lastReset: storage.get('last_reset')
          };
        } catch (error) {
          errorHandler.log(error, 'Session data retrieval');
          return null;
        }
      }
    },

    // Utility Methods
    utils: {
      showLoader: () => {
        try {
          showSuccessLoader();
          return true;
        } catch (error) {
          errorHandler.log(error, 'Manual loader display');
          return false;
        }
      },
      refreshBreadcrumbs: () => {
        try {
          const existing = document.querySelector(`.${config.breadcrumbs.containerClass}`);
          if (existing) {
            existing.remove();
          }
          generateBreadcrumbs();
          return true;
        } catch (error) {
          errorHandler.log(error, 'Breadcrumbs refresh');
          return false;
        }
      }
    },

    // Version Info
    version: '1.1.0',
    
    // Initialize/Reinitialize
    init: () => {
      try {
        initialize();
        return true;
      } catch (error) {
        errorHandler.log(error, 'Manual initialization');
        return false;
      }
    }
  };
})();
