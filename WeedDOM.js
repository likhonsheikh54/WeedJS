/**
 * WeedDOM 🌿 - Advanced Web Integration & Domain Analytics Toolkit
 * Version: 1.0.0
 * Repository: https://github.com/likhonsheikh54/WeedJS
 *
 * Author: likhonsheikh54 (GitHub: likhon sheikh)
 * Powered by: https://t.me/RecentCoders & https://www.v4os.org
 * Co-powered by: https://vortexcybersecurity.org
 *
 * Description:
 *  WeedDOM automatically integrates GTM, handles IndexNow URL submissions,
 *  generates dynamic breadcrumbs, scans connected external domains, simulates
 *  backlinks analysis, and provides a client-side integration status dashboard
 *  accessible at the `/integration/status` route.
 */

(() => {
  'use strict';

  // -------------------------
  // Merge Default & User Config
  // -------------------------
  const defaultConfig = {
    gtm: {
      id: '',
      async: true
    },
    indexNow: {
      apiKey: '',
      submitInterval: 3600
    },
    analytics: {
      enabled: false,
      dashboard: {
        position: 'bottom-right',
        theme: 'dark'
      }
    },
    breadcrumbs: {
      separator: ' › ',
      containerClass: 'weeddom-breadcrumbs',
      linkClass: 'weeddom-link'
    },
    scanner: {
      enabled: true
    }
  };

  const config = Object.assign({}, defaultConfig, window.WEEDDOM_CONFIG || {});

  // -------------------------
  // Global Integration Status
  // -------------------------
  const integrationStatus = {
    gtmMounted: false,
    sitemapFound: false,
    indexNowSubmission: 'Pending',
    connectedDomains: [],
    backlinksData: null
  };

  // Prevent multiple executions
  if (window.WEEDDOM_LOADED) return;
  window.WEEDDOM_LOADED = true;

  // -------------------------
  // 1. GTM Integration
  // -------------------------
  const mountGTM = () => {
    if (!config.gtm.id) {
      console.warn('[WeedDOM] GTM ID not configured.');
      return;
    }
    const gtmScript = document.createElement('script');
    gtmScript.async = config.gtm.async;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtm.id}`;
    document.head.appendChild(gtmScript);

    document.addEventListener('DOMContentLoaded', () => {
      const gtmNoScript = document.createElement('noscript');
      gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtm.id}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(gtmNoScript, document.body.firstChild);
    });
    integrationStatus.gtmMounted = true;
    console.log('[WeedDOM] GTM mounted:', config.gtm.id);
  };

  mountGTM();

  // -------------------------
  // 2. IndexNow API Integration
  // -------------------------
  const DOMAIN = window.location.hostname;
  const INDEXNOW_KEY_LOCATION = `https://${DOMAIN}/${config.indexNow.apiKey}.txt`;

  const checkSitemap = () => {
    const sitemapURL = `https://${DOMAIN}/sitemap.xml`;
    return fetch(sitemapURL, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('[WeedDOM] Sitemap found at:', sitemapURL);
          integrationStatus.sitemapFound = true;
          return true;
        }
        console.warn('[WeedDOM] Sitemap not found at:', sitemapURL);
        integrationStatus.sitemapFound = false;
        return false;
      })
      .catch(error => {
        console.error('[WeedDOM] Error checking sitemap:', error);
        integrationStatus.sitemapFound = false;
        return false;
      });
  };

  const submitIndexNow = (urlList) => {
    const requestBody = {
      host: DOMAIN,
      key: config.indexNow.apiKey,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList
    };

    return fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        integrationStatus.indexNowSubmission = 'Success';
        console.log('[WeedDOM] IndexNow Response:', data);
      })
      .catch(error => {
        integrationStatus.indexNowSubmission = 'Error';
        console.error('[WeedDOM] IndexNow submission error:', error);
      });
  };

  const alternativeIndexNowSubmission = () => {
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
  };

  const enhancedIndexNowSubmission = () => {
    checkSitemap().then(hasSitemap => {
      if (!hasSitemap) {
        alternativeIndexNowSubmission();
      } else {
        // In a real-world scenario, you might parse the sitemap.
        // For demonstration, we use a default URL list.
        const defaultURLs = [
          window.location.href,
          `https://${DOMAIN}/url1`,
          `https://${DOMAIN}/folder/url2`,
          `https://${DOMAIN}/url3`
        ];
        submitIndexNow(defaultURLs);
      }
    });
  };

  // -------------------------
  // 3. Dynamic Breadcrumbs
  // -------------------------
  const generateBreadcrumbs = () => {
    const pathArray = window.location.pathname.split('/').filter(el => el);
    const breadcrumbsContainer = document.createElement('nav');
    breadcrumbsContainer.setAttribute('aria-label', 'breadcrumb');
    breadcrumbsContainer.className = config.breadcrumbs.containerClass;
    breadcrumbsContainer.style.padding = '10px';
    breadcrumbsContainer.style.backgroundColor = '#f8f9fa';
    breadcrumbsContainer.style.fontSize = '14px';
    breadcrumbsContainer.style.marginBottom = '15px';

    let breadcrumbsHTML = '<a href="/" class="' + config.breadcrumbs.linkClass + '">Home</a>';
    let cumulativePath = '';
    pathArray.forEach(segment => {
      cumulativePath += '/' + segment;
      const displayName = segment.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      breadcrumbsHTML += ` ${config.breadcrumbs.separator} <a href="${cumulativePath}" class="${config.breadcrumbs.linkClass}">${displayName}</a>`;
    });

    breadcrumbsContainer.innerHTML = breadcrumbsHTML;
    document.body.insertBefore(breadcrumbsContainer, document.body.firstChild);
  };

  // -------------------------
  // 4. External Domain & Backlinks Scanner (Simulated)
  // -------------------------
  const scanConnectedDomains = () => {
    const anchors = document.getElementsByTagName('a');
    const externalDomains = new Set();
    for (let i = 0; i < anchors.length; i++) {
      const href = anchors[i].href;
      if (href && !href.includes(DOMAIN)) {
        try {
          const urlObj = new URL(href);
          externalDomains.add(urlObj.hostname);
        } catch (e) {
          // ignore invalid URLs
        }
      }
    }
    integrationStatus.connectedDomains = Array.from(externalDomains);
    console.log('[WeedDOM] External domains found:', integrationStatus.connectedDomains);
  };

  const scanBacklinks = () => {
    console.log('[WeedDOM] Initiating backlinks scan...');
    // Simulated asynchronous backlinks scan
    setTimeout(() => {
      integrationStatus.backlinksData = {
        totalBacklinks: 1234,
        referringDomains: 56,
        details: [
          { domain: 'example1.com', backlinks: 234 },
          { domain: 'example2.com', backlinks: 100 }
        ]
      };
      console.log('[WeedDOM] Backlinks data:', integrationStatus.backlinksData);
    }, 2000);
  };

  // -------------------------
  // 5. Analytics Dashboard Rendering (Optional)
  // -------------------------
  const renderDashboard = () => {
    if (!config.analytics.enabled) return;
    const dashboardContainer = document.createElement('div');
    dashboardContainer.id = 'weeddom-dashboard';
    dashboardContainer.style.position = 'fixed';
    dashboardContainer.style.bottom = '0';
    dashboardContainer.style.right = '0';
    dashboardContainer.style.backgroundColor = config.analytics.dashboard.theme === 'dark' ? 'rgba(0,0,0,0.8)' : '#fff';
    dashboardContainer.style.color = config.analytics.dashboard.theme === 'dark' ? '#fff' : '#000';
    dashboardContainer.style.padding = '15px';
    dashboardContainer.style.zIndex = '1000';
    dashboardContainer.style.fontFamily = 'Arial, sans-serif';
    dashboardContainer.style.maxWidth = '300px';
    dashboardContainer.style.fontSize = '12px';
    dashboardContainer.style.borderTopLeftRadius = '8px';

    // Example dummy metrics; replace with live data as needed.
    const dashboardData = {
      DR: 14,
      UR: 0,
      AR: '16,920,674 Backlinks',
      Backlinks: 0,
      RefDomains: 0,
      OrganicKeywords: 0,
      Top3Traffic: 0,
      OrganicTraffic: 0,
      PaidKeywords: 0,
      PaidTraffic: 0
    };

    dashboardContainer.innerHTML = `
      <h4 style="margin:0 0 10px 0;">Domain Overview</h4>
      <ul style="list-style: none; padding:0; margin:0;">
          <li><strong>DR:</strong> ${dashboardData.DR}</li>
          <li><strong>UR:</strong> ${dashboardData.UR}</li>
          <li><strong>AR:</strong> ${dashboardData.AR}</li>
          <li><strong>Backlinks:</strong> ${dashboardData.Backlinks}</li>
          <li><strong>Ref. Domains:</strong> ${dashboardData.RefDomains}</li>
          <li><strong>Organic Keywords:</strong> ${dashboardData.OrganicKeywords}</li>
          <li><strong>Top 3 Traffic:</strong> ${dashboardData.Top3Traffic}</li>
          <li><strong>Organic Traffic:</strong> ${dashboardData.OrganicTraffic}</li>
          <li><strong>Paid Keywords:</strong> ${dashboardData.PaidKeywords}</li>
          <li><strong>Paid Traffic:</strong> ${dashboardData.PaidTraffic}</li>
      </ul>
      <div style="margin-top:10px; font-size:10px;">
        Data compiled from crawled data and backlink profiles.
      </div>
    `;
    document.body.appendChild(dashboardContainer);
  };

  // -------------------------
  // 6. Integration Status Route Renderer
  // -------------------------
  const renderIntegrationStatus = () => {
    // Clear the page content and render a full-page status report.
    document.body.innerHTML = '';
    const statusContainer = document.createElement('div');
    statusContainer.style.padding = '20px';
    statusContainer.style.fontFamily = 'Arial, sans-serif';

    statusContainer.innerHTML = `
      <h1>Integration Status</h1>
      <p><strong>GTM Mounted:</strong> ${integrationStatus.gtmMounted ? 'Yes' : 'No'}</p>
      <p><strong>Sitemap Found:</strong> ${integrationStatus.sitemapFound ? 'Yes' : 'No'}</p>
      <p><strong>IndexNow Submission:</strong> ${integrationStatus.indexNowSubmission}</p>
      <p><strong>Connected External Domains:</strong> ${integrationStatus.connectedDomains.length > 0 ? integrationStatus.connectedDomains.join(', ') : 'None'}</p>
      <p><strong>Backlinks Data:</strong> ${integrationStatus.backlinksData ? JSON.stringify(integrationStatus.backlinksData) : 'Not available'}</p>
      <hr>
      <p><a href="/">Return Home</a></p>
    `;
    document.body.appendChild(statusContainer);
  };

  // -------------------------
  // 7. Global API Exposure
  // -------------------------
  window.WeedDOM = {
    gtm: {
      push: (data) => {
        // Custom event push for GTM (if available)
        if (window.dataLayer && Array.isArray(window.dataLayer)) {
          window.dataLayer.push(data);
          console.log('[WeedDOM] GTM event pushed:', data);
        } else {
          console.warn('[WeedDOM] dataLayer not found.');
        }
      }
    },
    indexNow: {
      submit: (urls) => submitIndexNow(urls)
    },
    analytics: {
      track: (metric, data) => {
        // Placeholder for custom metric tracking
        console.log(`[WeedDOM] Tracking metric "${metric}":`, data);
      }
    },
    breadcrumbs: {
      configure: (options) => {
        // Merge custom options into the breadcrumbs config
        Object.assign(config.breadcrumbs, options);
        console.log('[WeedDOM] Breadcrumbs configuration updated:', config.breadcrumbs);
      }
    },
    scanner: {
      analyze: () => {
        // Returns a Promise with simulated scan results
        return new Promise(resolve => {
          scanConnectedDomains();
          scanBacklinks();
          setTimeout(() => {
            resolve({
              domains: integrationStatus.connectedDomains,
              backlinks: integrationStatus.backlinksData
            });
          }, 2500);
        });
      }
    }
  };

  // -------------------------
  // 8. Initialize on DOM Ready
  // -------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // If the URL path is "/integration/status", render the status dashboard.
    if (window.location.pathname === '/integration/status') {
      renderIntegrationStatus();
      return;
    }
    generateBreadcrumbs();
    renderDashboard();
    scanConnectedDomains();
    scanBacklinks();
    enhancedIndexNowSubmission();
  });
})();
