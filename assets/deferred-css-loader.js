// Deferred CSS Loader
// Loads non-critical CSS files after the initial page render

(function() {
  'use strict';
  
  // Function to load CSS file
  function loadCSS(href) {
    return new Promise(function(resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = function() {
        resolve(link);
      };
      link.onerror = function() {
        reject(new Error('Failed to load CSS: ' + href));
      };
      document.head.appendChild(link);
    });
  }
  
  // Function to load deferred CSS files
  function loadDeferredCSS() {
    var deferredCSSFiles = [
      '{{ "deferred-base-ai.css" | asset_url }}',
      // Add other deferred CSS files here as needed
    ];
    
    // Load each deferred CSS file
    deferredCSSFiles.forEach(function(cssFile) {
      loadCSS(cssFile).catch(function(error) {
        console.warn('CSS loading warning:', error.message);
      });
    });
  }
  
  // Load deferred CSS after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDeferredCSS);
  } else {
    loadDeferredCSS();
  }
  
  // Alternative: Load after a short delay to ensure critical rendering is complete
  setTimeout(loadDeferredCSS, 100);
  
})();
