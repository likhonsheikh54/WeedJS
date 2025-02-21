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
 *  generates dynamic breadcrumbs, and scans connected external domains.
 *  Upon successful integration, a centered success loader is displayed
 *  using the SVG at:
 *  https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/success.svg
 */

(() => {
  'use strict';

  // -------------------------
  // Inline Configuration
  // -------------------------
  const config = {
    gtm: { id: 'GTM-PKCRM67D', async: true },
    indexNow: { apiKey: 'eeacba0eddf742ef8de23c43938d4cb1', submitInterval: 3600 },
    breadcrumbs: { separator: ' › ', containerClass: 'weeddom-breadcrumbs', linkClass: 'weeddom-link' },
    scanner: { enabled: true }
  };

  // Global integration status (for internal use)
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
      gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtm.id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
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
        // For demonstration, using a default URL list.
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

    let breadcrumbsHTML = `<a href="/" class="${config.breadcrumbs.linkClass}">Home</a>`;
    let cumulativePath = '';
    pathArray.forEach(segment => {
      cumulativePath += '/' + segment;
      const displayName = decodeURIComponent(segment)
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      breadcrumbsHTML += ` ${config.breadcrumbs.separator} <a href="${cumulativePath}" class="${config.breadcrumbs.linkClass}">${displayName}</a>`;
    });
    breadcrumbsContainer.innerHTML = breadcrumbsHTML;
    document.body.insertBefore(breadcrumbsContainer, document.body.firstChild);
  };
  generateBreadcrumbs();

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
        } catch (e) { /* ignore invalid URLs */ }
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
  scanConnectedDomains();
  scanBacklinks();

  // -------------------------
  // 5. Success Loader Display
  // -------------------------
  const showSuccessLoader = () => {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    overlay.style.transition = 'opacity 0.5s ease';

    // Create success image element
    const successImg = document.createElement('img');
    successImg.src = 'https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/success.svg';
    successImg.alt = 'Integration Success';
    successImg.style.maxWidth = '200px';
    successImg.style.maxHeight = '200px';

    overlay.appendChild(successImg);
    document.body.appendChild(overlay);

    // After 2 seconds, fade out and remove the overlay
    setTimeout(() => {
      overlay.style.opacity = 0;
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 500);
    }, 2000);
  };

  // -------------------------
  // 6. Finalize Integration
  // -------------------------
  const finalizeIntegration = () => {
    enhancedIndexNowSubmission();
    // After a delay (simulate integration completion), show success loader
    setTimeout(showSuccessLoader, 3000);
  };

  document.addEventListener('DOMContentLoaded', finalizeIntegration);

  // -------------------------
  // Global API Exposure (optional)
  // -------------------------
  window.WeedDOM = {
    gtm: {
      push: (data) => {
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
    scanner: {
      analyze: () => {
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
})();
