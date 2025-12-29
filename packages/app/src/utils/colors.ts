export const oklchToHex = (oklch: string): string => {
	// Match: oklch(L C H)
	const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
	if (!match) return '#000000';

	const [, L, C] = match.map(Number);
	let [, , , H] = match.map(Number);

	H = (H * Math.PI) / 180;

	// OKLCH → OKLab
	const a = C * Math.cos(H);
	const b = C * Math.sin(H);

	// OKLab → linear RGB
	let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	let s_ = L - 0.0894841775 * a - 1.291485548 * b;

	l_ = l_ ** 3;
	m_ = m_ ** 3;
	s_ = s_ ** 3;

	let r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
	let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
	let b2 = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

	// Linear → sRGB
	const toSRGB = (x: number) =>
		x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

	r = Math.min(255, Math.max(0, toSRGB(r) * 255));
	g = Math.min(255, Math.max(0, toSRGB(g) * 255));
	b2 = Math.min(255, Math.max(0, toSRGB(b2) * 255));

	return (
		'#' +
		[r, g, b2].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
	);
};

// Converts CIE Lab to sRGB and then to hex
export const labToHex = (lab: string): string => {
	// Parse "lab(L C H)" string
	const match = lab.match(/lab\(\s*([\d.]+)\s*([\d.-]+)\s*([\d.-]+)\s*\)/i);
	if (!match) return '#000000';

	const L = parseFloat(match[1]);
	const a = parseFloat(match[2]);
	const b = parseFloat(match[3]);

	// Convert Lab -> XYZ
	let y = (L + 16) / 116;
	let x = a / 500 + y;
	let z = y - b / 200;

	const xyzPivot = (t: number) =>
		t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;

	x = xyzPivot(x) * 0.95047; // reference white D65
	y = xyzPivot(y) * 1.0;
	z = xyzPivot(z) * 1.08883;

	// Convert XYZ -> linear sRGB
	let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	let b_ = x * 0.0557 + y * -0.204 + z * 1.057;

	// Gamma correction
	const gamma = (u: number) =>
		u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;

	r = Math.min(1, Math.max(0, gamma(r)));
	g = Math.min(1, Math.max(0, gamma(g)));
	b_ = Math.min(1, Math.max(0, gamma(b_)));

	// Convert to hex
	const toHex = (v: number) =>
		Math.round(v * 255)
			.toString(16)
			.padStart(2, '0');

	return `#${toHex(r)}${toHex(g)}${toHex(b_)}`;
};
