/*************************************************
 * FINPLAN PRO - PWA INSTALLER
 * Install Prompt & Service Worker Registration
 *************************************************/

let deferredPrompt = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('✅ Service Worker registered:', reg.scope);
        
        // Check for updates
        reg.onupdatefound = () => {
          const newWorker = reg.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          };
        };
      })
      .catch(err => console.error('❌ Service Worker registration failed:', err));
  });
}

// Capture install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

// Show install button
function showInstallButton() {
  const installBtn = document.getElementById('btnInstallPWA');
  if (installBtn) {
    installBtn.style.display = 'block';
  }
}

// Install PWA
window.installPWA = async function() {
  if (!deferredPrompt) {
    alert('App sudah ter-install atau browser tidak support install.');
    return;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('✅ User accepted install');
  }
  
  deferredPrompt = null;
  const installBtn = document.getElementById('btnInstallPWA');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
};

// Show update notification
function showUpdateNotification() {
  if (confirm('🎉 Update baru tersedia! Refresh untuk update?')) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
}

// Detect if running as installed app
function isInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Track app install
window.addEventListener('appinstalled', () => {
  console.log('✅ FinPlan Pro installed successfully!');
  deferredPrompt = null;
});

console.log('📱 PWA Installer ready');
console.log('🏠 Running as installed app:', isInstalled());
