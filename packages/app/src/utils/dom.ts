import { labToHex, oklchToHex } from './colors';

export const applyExportSafeColors = (root: HTMLElement) => {
	const modified: Array<{ element: HTMLElement; style: string }> = [];

	// All elements in subtree including root
	const htmlElements = Array.from(
		root.querySelectorAll<HTMLElement>('*')
	).concat(root);

	htmlElements.forEach((el) => {
		const style = getComputedStyle(el);

		// Loop through all properties
		for (let i = 0; i < style.length; i++) {
			const prop = style[i];
			const value = style.getPropertyValue(prop);

			if (!value) continue;

			if (value.includes('oklch(')) {
				modified.push({ element: el, style: el.getAttribute('style') || '' });
				el.style.setProperty(prop, oklchToHex(value));
			} else if (value.includes('lab(')) {
				modified.push({ element: el, style: el.getAttribute('style') || '' });
				el.style.setProperty(prop, labToHex(value));
			} else if (value.includes('color(')) {
				// generic "color()" fallback
				modified.push({ element: el, style: el.getAttribute('style') || '' });
				el.style.setProperty(prop, '#000000'); // fallbackColor returns hex
			}
		}
	});

	// Special case: document background
	const bodyStyle = getComputedStyle(document.body);
	const docBg = bodyStyle.backgroundColor;
	if (docBg.includes('oklch('))
		document.body.style.backgroundColor = oklchToHex(docBg);
	else if (docBg.includes('lab('))
		document.body.style.backgroundColor = labToHex(docBg);

	// Return restore function
	return () => {
		modified.forEach(({ element, style }) => {
			if (style) element.setAttribute('style', style);
			else element.removeAttribute('style');
		});
	};
};

export const inlineTailwindStyles = (root: HTMLElement) => {
	const props = [
		'width',
		'height',
		'minWidth',
		'minHeight',
		'padding',
		'paddingTop',
		'paddingBottom',
		'paddingLeft',
		'paddingRight',
		'margin',
		'marginTop',
		'marginBottom',
		'marginLeft',
		'marginRight',
		'gap',
		'fontSize',
		'fontWeight',
		'lineHeight',
		'letterSpacing',
		'color',
		'backgroundColor',
		'borderColor',
		'borderWidth',
		'borderRadius',
		'backgroundImage', // for gradients
	];

	const allElements = root.querySelectorAll<HTMLElement>('*');

	allElements.forEach((el) => {
		const computed = getComputedStyle(el);

		props.forEach((prop) => {
			let value = computed.getPropertyValue(prop);
			if (!value) return;

			// Convert oklch() or lab() colors to hex if needed
			if (value.includes('oklch(')) value = oklchToHex(value);
			if (value.includes('lab(')) value = labToHex(value);

			el.style.setProperty(
				prop.replace(/([A-Z])/g, '-$1').toLowerCase(), // camelCase → kebab-case
				value
			);
		});
	});
};
