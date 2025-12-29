import { SlideLayout } from '@pitch/types/pitch.types';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, PageBreak } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.vfs;

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

type Margin = [number, number, number, number];
export type Theme = 'light' | 'dark';

export type SlideBlock =
	| { type: 'title'; text: string }
	| { type: 'subtitle'; text: string }
	| {
			type: 'text';
			text: string;
			size?: number;
			muted?: boolean;
			accent?: boolean;
	  }
	| {
			type: 'bullets';
			items: string[];
	  }
	| { type: 'highlight'; left: string; right: string };

/* ---------------------------------- */
/* Theme tokens                       */
/* ---------------------------------- */

const THEMES: Record<
	Theme,
	{
		bg: string;
		text: string;
		muted: string;
		accent: string;
	}
> = {
	light: {
		bg: '#ffffff',
		text: '#111827',
		muted: '#6b7280',
		accent: '#2563eb',
	},
	dark: {
		bg: '#0f172a',
		text: '#f8fafc',
		muted: '#94a3b8',
		accent: '#38bdf8',
	},
};

/* ---------------------------------- */
/* PDF Builder                        */
/* ---------------------------------- */

export const buildPitchPDF = (
	slides: SlideLayout[],
	theme: Theme = 'light',
) => {
	const t = THEMES[theme];
	const PAD: Margin = [80, 80, 80, 80];

	const renderBlock = (block: SlideBlock): Content => {
		switch (block.type) {
			case 'title':
				return {
					text: block.text,
					fontSize: 42,
					bold: true,
					color: t.text,
					margin: [0, 0, 0, 24],
					tocItem: false,
				};

			case 'subtitle':
				return {
					text: block.text,
					fontSize: 28,
					color: t.muted,
					margin: [0, 0, 0, 20],
					tocItem: false,
				};

			case 'text':
				return {
					text: block.text,
					fontSize: 22,
					color: t.text,
					lineHeight: 1.4,
					margin: [0, 0, 0, 14],
					tocItem: false,
				};

			case 'bullets':
				return {
					ul: block.items,
					fontSize: 22,
					color: t.text,
					margin: [0, 6, 0, 0],
				};

			case 'highlight':
				return {
					columns: [
						{
							text: block.left,
							fontSize: 32,
							bold: true,
							color: t.accent,
							width: 'auto',
						},
						{
							text: block.right,
							fontSize: 22,
							color: t.muted,
							margin: [16, 6, 0, 0],
							width: '*',
						},
					],
					columnGap: 16,
					margin: [0, 20, 0, 0],
				};

			default:
				return {} as Content;
		}
	};

	const renderSlide = (slide: SlideLayout, isLast: boolean): Content[] => [
		// Background
		{
			canvas: [
				{
					type: 'rect',
					x: 0,
					y: 0,
					w: 1280,
					h: 720,
					color: t.bg,
				},
			],
			absolutePosition: { x: 0, y: 0 },
		},

		// Foreground content
		{
			stack: [
				slide.kicker && {
					text: slide.kicker.toUpperCase(),
					fontSize: 14,
					bold: true,
					color: t.accent,
					margin: [0, 0, 0, 8],
				},

				{
					text: slide.title,
					fontSize: 42,
					bold: true,
					color: t.text,
					margin: [0, 0, 0, 24],
				},

				...slide.blocks.map(renderBlock),
			].filter(Boolean) as Content[],
			margin: PAD,
		},

		// Page break
		...(isLast ? [] : [{ text: '', pageBreak: 'after' as PageBreak }]),
	];

	return {
		pageSize: { width: 1280, height: 720 },
		pageMargins: [0, 0, 0, 0] as Margin,
		defaultStyle: {
			fontSize: 22,
			color: t.text,
		},
		content: slides.flatMap((slide, i) =>
			renderSlide(slide, i === slides.length - 1),
		),
	};
};
