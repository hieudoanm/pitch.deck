// Code Editor
import { yaml as yamlLang } from '@codemirror/lang-yaml';
import CodeMirror from '@uiw/react-codemirror';

// Components
import { Navbar } from '@pitch/components/Navbar';
import {
	mapYamlToSlides,
	SlidePreview,
} from '@pitch/components/SlidePreview/SlidePreview';
import { Toast, useToast } from '@pitch/components/Toast';

// Constants
import { INITIAL_CONTENT } from '@pitch/constants/app';

// Utils
import { labToHex } from '@pitch/utils/colors';
import { applyExportSafeColors, inlineTailwindStyles } from '@pitch/utils/dom';
import { logger } from '@pitch/utils/logger';
import { validate } from '@pitch/utils/yaml';

// HTML to PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import yaml from 'yaml';
import { Landing } from '@pitch/components/Landing';

const getInitialInput = () => {
	if (typeof window === 'undefined') return INITIAL_CONTENT;
	const yamlParam = new URLSearchParams(location.search).get('yaml');
	return yamlParam ? decodeURIComponent(yamlParam) : INITIAL_CONTENT;
};

const HomePage: NextPage = () => {
	const { toasts, show, dismiss } = useToast();

	const [{ input = getInitialInput(), showInput = false }, setState] =
		useState<{
			input: string;
			showInput: boolean;
		}>({
			input: getInitialInput(),
			showInput: false,
		});

	// Sync YAML → URL (shareable link)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const encoded = encodeURIComponent(input);
		if (encoded.length > 4000) {
			logger.warn('YAML too long for URL 🚧', encoded.length);
			return;
		}

		const url = `${location.pathname}?yaml=${encoded}`;
		window.history.replaceState(null, '', url);

		logger.info('URL synced 🔄', encoded.length);
	}, [input]);

	const parsed = useMemo(() => {
		try {
			logger.info('Parsing YAML ✍️');
			const result = yaml.parse(input);
			const errors = validate(result);

			if (errors.length > 0) {
				logger.warn('YAML validation errors 🧪', errors);
			} else {
				logger.success('YAML valid ✅');
			}

			return { data: result, errors: validate(result) };
		} catch (error) {
			logger.error('YAML parsing failed 💥', error);
			return { data: null, errors: [{ path: '', message: 'Invalid YAML' }] };
		}
	}, [input]);

	const slides = useMemo(
		() => (parsed.data ? mapYamlToSlides(parsed.data) : []),
		[parsed.data]
	);

	const exportPDF = async () => {
		logger.info('PDF export requested 📄');

		if (!parsed.data || parsed.errors.length > 0) {
			logger.warn('PDF export blocked — YAML errors 🧯', parsed.errors);
			show('error', 'Fix YAML errors before exporting');
			return;
		}

		const loadingId = show('loading', 'Generating PDF…');

		try {
			const preview = document.getElementById('pitch-preview');
			if (!preview) throw new Error('#pitch-preview not found');

			const styleSheets = Array.from(document.styleSheets)
				.map((sheet) => {
					try {
						return Array.from(sheet.cssRules)
							.map((rule) => rule.cssText)
							.join('\n');
					} catch {
						return '';
					}
				})
				.join('\n');

			const styleTag = document.createElement('style');
			styleTag.textContent = styleSheets;

			// Clone preview for export
			const exportContainer = preview.cloneNode(true) as HTMLElement;
			exportContainer.style.position = 'fixed';
			exportContainer.style.top = '-9999px';
			exportContainer.style.left = '-9999px';
			exportContainer.style.width = '100%';
			exportContainer.style.height = '100%';
			exportContainer.prepend(styleTag);
			document.body.appendChild(exportContainer);

			// Convert Tailwind classes to inline styles
			inlineTailwindStyles(exportContainer);

			const originalHtmlBg = getComputedStyle(
				document.documentElement
			).backgroundColor;
			const originalBodyBg = getComputedStyle(document.body).backgroundColor;

			// Force export-safe backgrounds
			document.documentElement.style.backgroundColor = originalHtmlBg.includes(
				'lab('
			)
				? labToHex(originalHtmlBg)
				: originalHtmlBg; // fallback hex / rgb
			document.body.style.backgroundColor = originalBodyBg.includes('lab(')
				? labToHex(originalBodyBg)
				: originalBodyBg; // fallback hex / rgb

			// Apply export-safe colors to clone
			const restoreColors = applyExportSafeColors(exportContainer);

			const slides = Array.from(
				exportContainer.querySelectorAll<HTMLElement>('.aspect-video')
			);

			if (slides.length === 0)
				throw new Error('No slides found inside preview');

			logger.info('Rendering slides 🖼️', { count: slides.length });

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'px',
				format: [1280, 720],
			});

			for (let i = 0; i < slides.length; i++) {
				const slide = slides[i];

				const canvas = await html2canvas(slide, {
					scale: 2,
					useCORS: true,
					backgroundColor: null,
					width: 1280,
					height: 720,
					windowWidth: 1280,
					windowHeight: 720,
				});

				const imgData = canvas.toDataURL('image/png');

				if (i > 0) pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720);
			}

			// Cleanup
			restoreColors();
			document.body.removeChild(exportContainer);

			pdf.save(`${parsed.data.title.product}.pdf`);

			logger.success('PDF exported 🎉', parsed.data.title.product);
			show('success', 'PDF exported successfully');
		} catch (err) {
			logger.error('PDF export failed ❌', err);
			show('error', 'PDF export failed');
		} finally {
			dismiss(loadingId);
		}
	};

	const shareURL = () => {
		logger.info('Share link requested 🔗');

		const encoded = encodeURIComponent(input);

		if (encoded.length > 4000) {
			logger.error('Shareable link too long ❌', { length: encoded.length });
			show('error', 'Shareable link is too long to copy (max 4000 chars)');
			return;
		}

		const url = `${location.origin}?yaml=${encoded}`;
		navigator.clipboard.writeText(url);

		logger.success('Shareable link copied 📋', { length: encoded.length });
		show('success', 'Shareable link copied');
	};

	const isNotExportable: boolean = !parsed.data || parsed.errors.length > 0;
	const isSharable: boolean = encodeURIComponent(input).length <= 4000;

	return (
		<>
			{toasts && <Toast toasts={toasts} onDismiss={dismiss} />}
			<div className="bg-base-200 flex h-screen w-screen flex-col overflow-hidden">
				<Navbar />
				<div className="h-full grow overflow-hidden">
					<div className="divide-primary-content grid h-full w-full grid-cols-24 divide-x">
						<div className="col-span-1 flex h-full flex-col items-center justify-start gap-2 p-2">
							{/* Toggle YAML */}
							<div
								className="tooltip tooltip-right"
								data-tip={showInput ? 'Hide YAML Editor' : 'Show YAML Editor'}>
								<button
									className={`btn btn-xs rounded ${showInput ? 'btn-accent' : 'bg-base-300'}`}
									onClick={() =>
										setState((previous) => ({
											...previous,
											showInput: !previous.showInput,
										}))
									}>
									📝
								</button>
							</div>

							{/* Export PDF */}
							<div className="tooltip tooltip-right" data-tip="Export PDF">
								<button
									className="btn btn-xs btn-primary rounded"
									disabled={isNotExportable}
									onClick={exportPDF}>
									📄
								</button>
							</div>

							{/* Copy Shareable Link */}
							<div
								className="tooltip tooltip-right"
								data-tip="Copy Shareable Link">
								<button
									className="btn btn-xs btn-secondary rounded"
									disabled={!isSharable}
									onClick={shareURL}>
									🔗
								</button>
							</div>
						</div>

						{/* YAML input */}
						{showInput && (
							<div className="col-span-11 h-full overflow-auto">
								<div className="bg-base-100 border-primary-content h-full">
									<CodeMirror
										value={input}
										height="100%"
										className="h-full"
										extensions={[yamlLang()]}
										onChange={(value) =>
											setState((prev) => ({ ...prev, input: value }))
										}
										theme="dark"
									/>
								</div>
							</div>
						)}

						{/* Slides preview */}
						<div
							className={`${showInput ? 'col-span-12' : 'col-span-23'} overflow-hidden`}>
							<div className="h-full w-full overflow-auto p-8">
								<div className="flex flex-col gap-y-8">
									{!parsed && (
										<div className="alert alert-error">Invalid YAML</div>
									)}

									{parsed && (
										<>
											{parsed.errors.length > 0 && (
												<div className="alert alert-error">
													<ul className="list-disc space-y-1 pl-4 text-sm">
														{parsed.errors.map((e, i) => (
															<li key={i}>
																<strong>{e.path || 'YAML'}:</strong> {e.message}
																{e.hint && (
																	<span className="opacity-70">
																		{' '}
																		— {e.hint}
																	</span>
																)}
															</li>
														))}
													</ul>
												</div>
											)}

											<div className="tabs tabs-box w-full">
												<input
													type="radio"
													name="pitch_deck_landing_page"
													className="checked:border-primary-content tab w-1/2 rounded border transition-all duration-200"
													aria-label="Pitch Desk"
													defaultChecked
												/>
												{/* Pitch Deck Content */}
												<div className="tab-content mt-8">
													<div
														id="pitch-preview"
														className="flex flex-col gap-8">
														{slides.map((slide, i) => (
															<SlidePreview
																key={slide.kicker}
																index={i}
																slide={slide}
															/>
														))}
													</div>
												</div>

												<input
													type="radio"
													name="pitch_deck_landing_page"
													className="checked:border-primary-content tab w-1/2 rounded border transition-all duration-200"
													aria-label="Landing Page"
												/>
												{/* Landing Page Content */}
												<div className="tab-content mt-8">
													<div className="border-primary-content overflow-hidden rounded border shadow-2xl">
														<Landing data={parsed.data} />
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
