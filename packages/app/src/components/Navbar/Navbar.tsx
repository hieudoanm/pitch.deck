import { INITIAL_THEME, THEMES } from '@pitch/constants/app';
import { FC, useEffect, useState } from 'react';

export const Navbar: FC = () => {
	const [theme, setTheme] = useState(() => {
		if (typeof window === 'undefined') return INITIAL_THEME;
		return localStorage.getItem('theme') ?? INITIAL_THEME;
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	return (
		<div className="navbar border-base-300 border-b px-6">
			<div className="flex-1">
				<span className="text-lg font-bold">Pitch Deck Generator</span>
			</div>

			<div className="flex-none">
				<select
					className="select select-sm select-bordered bg-base-100"
					value={theme}
					onChange={(e) => setTheme(e.target.value)}>
					{Object.entries(
						THEMES.reduce<Record<string, string[]>>((acc, t) => {
							acc[t.group] ??= [];
							acc[t.group].push(t.theme);
							return acc;
						}, {})
					).map(([group, themes]) => (
						<optgroup key={group} label={group}>
							{themes.map((t) => (
								<option key={t} value={t}>
									{t.charAt(0).toUpperCase() + t.slice(1)}
								</option>
							))}
						</optgroup>
					))}
				</select>
			</div>
		</div>
	);
};
