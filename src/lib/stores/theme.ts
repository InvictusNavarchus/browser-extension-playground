import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
	let initialTheme: Theme = 'light';

	// Only run in browser
	if (typeof window !== 'undefined') {
		const savedTheme = localStorage.getItem('theme') as Theme | null;
		
		if (savedTheme) {
			initialTheme = savedTheme;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			initialTheme = 'dark';
		}
	}

	const { subscribe, update } = writable<Theme>(initialTheme);

	return {
		subscribe,
		toggle: () => {
			update((theme: Theme) => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				if (typeof window !== 'undefined') {
					localStorage.setItem('theme', newTheme);
					updateHtmlClass(newTheme);
				}
				return newTheme;
			});
		},
		set: (theme: Theme) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', theme);
				updateHtmlClass(theme);
			}
		},
	};
}

function updateHtmlClass(theme: Theme) {
	if (typeof document !== 'undefined') {
		const html = document.documentElement;
		if (theme === 'dark') {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}
}

export const theme = createThemeStore();

// Initialize on client
if (typeof window !== 'undefined') {
	theme.subscribe((t) => {
		updateHtmlClass(t);
	});
}
