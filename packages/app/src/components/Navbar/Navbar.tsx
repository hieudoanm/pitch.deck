import { INITIAL_THEME, THEMES } from '@pitch/constants/app';
import { FC, useState } from 'react';

const getInitialTheme = () => {
	if (typeof window === 'undefined') return INITIAL_THEME;
	return localStorage.getItem('theme') ?? INITIAL_THEME;
};

export const Navbar: FC = () => {
	const [theme, setTheme] = useState<string>(getInitialTheme);

	const handleThemeChange = (nextTheme: string) => {
		setTheme(nextTheme);
		localStorage.setItem('theme', nextTheme);
		document.documentElement.setAttribute('data-theme', nextTheme);
	};

	return (
		<div className="navbar bg-base-100 border-base-300 border-b px-6">
			<div className="flex-1">
				<span className="text-lg font-bold">5-Slide Pitch Deck Generator</span>
			</div>

			<div className="flex-none gap-2">
				<select
					className="select select-bordered select-sm"
					value={theme}
					onChange={(e) => handleThemeChange(e.target.value)}>
					{THEMES.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
