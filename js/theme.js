/* ==========================================================================
   APU DANCE CLUB — theme.js
   Adds a theme section inside the "Others" dropdown: Current / Light / Dark.
   Persists choice in localStorage and applies it on every page load.
   ========================================================================== */
(function () {
  var STORAGE_KEY = 'apu-theme';
  var THEMES = ['current', 'light', 'dark'];
  var LABELS = { current: 'Current Theme', light: 'Light Theme', dark: 'Dark Theme' };

  function getStoredTheme() {
    var t = localStorage.getItem(STORAGE_KEY);
    return THEMES.indexOf(t) !== -1 ? t : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'current') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    document.querySelectorAll('.theme-option').forEach(function (b) {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }

  // Apply immediately (before full paint) to avoid a flash of the wrong theme
  applyTheme(getStoredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('nav-others-menu');
    if (!menu) return;

    var li = document.createElement('li');
    li.className = 'theme-menu-item';

    var label = document.createElement('span');
    label.className = 'theme-menu-label';
    label.textContent = 'Theme';
    li.appendChild(label);

    var wrap = document.createElement('div');
    wrap.className = 'theme-option-group';

    THEMES.forEach(function (theme) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-option';
      btn.dataset.theme = theme;
      btn.textContent = LABELS[theme];
      if (getStoredTheme() === theme) btn.classList.add('active');

      btn.addEventListener('click', function () {
        applyTheme(theme);
      });

      wrap.appendChild(btn);
    });

    li.appendChild(wrap);
    menu.appendChild(li);
  });
})();
