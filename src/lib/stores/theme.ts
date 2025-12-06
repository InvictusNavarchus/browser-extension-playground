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
					const html = document.documentElement;
					if (newTheme === 'dark') {
						html.classList.add('dark');
					} else {
						html.classList.remove('dark');
					}
				}
				
				return newTheme;
			});
		},
	};
}

export const theme = createThemeStore();

