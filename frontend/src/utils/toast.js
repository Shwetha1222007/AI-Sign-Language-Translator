/**
 * Simple Lightweight Notification Toast System
 */
class ToastManager {
  constructor() {
    this.container = null;
  }

  init() {
    if (this.container || typeof document === 'undefined') return;
    this.container = document.createElement('div');
    this.container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    this.init();
    if (!this.container) return;

    const toast = document.createElement('div');
    
    const colorStyles = {
      success: 'bg-primary-900/90 border-green-500/50 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      error: 'bg-primary-900/90 border-red-500/50 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      info: 'bg-primary-900/90 border-accent-blue/50 text-accent-blue shadow-[0_0_20px_rgba(0,212,255,0.3)]',
      warning: 'bg-primary-900/90 border-yellow-500/50 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    };

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    };

    toast.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 ${colorStyles[type] || colorStyles.info}`;
    
    toast.innerHTML = `
      <span className="text-base font-bold flex-shrink-0">${icons[type] || 'ℹ'}</span>
      <span className="flex-1">${message}</span>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  success(msg, duration) { this.show(msg, 'success', duration); }
  error(msg, duration) { this.show(msg, 'error', duration); }
  info(msg, duration) { this.show(msg, 'info', duration); }
  warning(msg, duration) { this.show(msg, 'warning', duration); }
}

export const toast = new ToastManager();
