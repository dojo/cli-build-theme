var theme = theme.default;

if (theme && typeof window !== 'undefined') {
	if (!window.dojoce) {
		window.dojoce = {};
	}

	if (!window.dojoce.themes) {
		window.dojoce.themes = {
			noTheme: {}
		};
	}

	window.dojoce.themes[THEME_NAME] = theme;

	if (!window.dojoce.hasOwnProperty('theme')) {
		Object.defineProperty(window.dojoce, 'theme', {
			set: function(value) {
				value = value === '' ? 'noTheme' : value;
				if (value === window.dojoce.theme) {
					return;
				}
				if (window.dojoce.themes[value]) {
					window.dojoce._theme = value;
					window.dispatchEvent(new CustomEvent('dojo-theme-set', {}));
				}
			},
			get: function() {
				return window.dojoce._theme;
			}
		});
	}
	if (!window.dojoce.hasOwnProperty('variant')) {
		Object.defineProperty(window.dojoce, 'variant', {
			set: function(value) {
				value = value === '' ? 'noVariant' : value;
				if (value === window.dojoce.variant) {
					return;
				}
				if (
					window.dojoce.themes[window.dojoce.theme] &&
					window.dojoce.themes[window.dojoce.theme].variants &&
					window.dojoce.themes[window.dojoce.theme].variants[value]
				) {
					window.dojoce._variant = value;
					window.dispatchEvent(new CustomEvent('dojo-theme-set', {}));
				}
			},
			get: function() {
				return window.dojoce._variant;
			}
		});
	}
	window.dojoce.theme = THEME_NAME;
}

