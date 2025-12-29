import { Navbar } from '@pitch/components/Navbar';
import {
	mapYamlToSlides,
	SlidePreview,
} from '@pitch/components/SlidePreview/SlidePreview';
import { Toast, useToast } from '@pitch/components/Toast';
import { logger } from '@pitch/utils/logger';
import { buildPitchPDF, Theme } from '@pitch/utils/pdf';
import { validate } from '@pitch/utils/yaml';
import { NextPage } from 'next';
import pdfMake from 'pdfmake/build/pdfmake';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import yaml from 'yaml';

const CONTENT = `title:
  product: InvoiceMate
  tagline: Simple invoicing for indie founders
  audience: Indie founders & freelancers

problem:
  - Creating invoices is slow and repetitive
  - Existing tools are bloated and expensive

solution:
  description: A lightweight invoice generator that connects to Stripe and exports PDFs in one click.

product:
  features:
    - Create invoices in under 30 seconds
    - Stripe sync
    - Clean professional templates

businessModel:
  pricing: $9/month
  model: Subscription SaaS
`;

const getInitialInput = () => {
	if (typeof window === 'undefined') return CONTENT;
	const yamlParam = new URLSearchParams(location.search).get('yaml');
	return yamlParam ? decodeURIComponent(yamlParam) : CONTENT;
};

const Slide: FC<{
	title: string;
	kicker?: string;
	index?: number;
	children: ReactNode;
}> = ({ title, kicker, children, index }) => (
	<div className="group border-base-300 bg-base-100 relative flex aspect-video flex-col justify-center rounded-2xl border p-14 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
		{/* ✨ Hover gradient overlay */}
		<div className="from-primary/5 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

		{/* Slide index */}
		{typeof index === 'number' && (
			<div className="absolute top-6 right-6 font-mono text-sm opacity-40">
				{index + 1}/5
			</div>
		)}

		{/* Kicker */}
		{kicker && (
			<div className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase opacity-80">
				{kicker}
			</div>
		)}

		<h2 className="mb-6 text-4xl leading-tight font-bold tracking-tight">
			{title}
		</h2>

		<div className="text-base-content/90 text-lg leading-relaxed">
			{children}
		</div>
	</div>
);

const HomePage: NextPage = () => {
	const { toasts, show, dismiss } = useToast();

	const [{ input }, setState] = useState<{ input: string }>({
		input: getInitialInput(),
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
		[parsed.data],
	);

	const exportPDF = () => {
		logger.info('PDF export requested 📄');

		if (!parsed.data || parsed.errors.length > 0) {
			logger.warn('PDF export blocked — YAML errors 🧯', parsed.errors);
			show('error', 'Fix YAML errors before exporting');
			return;
		}

		// Loading toast
		const loadingId = show('loading', 'Generating PDF…');

		const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

		logger.info('Building PDF 🎨', { theme });

		const slides = mapYamlToSlides(parsed.data);
		const docDefinition = buildPitchPDF(slides, theme as Theme);

		pdfMake
			.createPdf(docDefinition)
			.download(`${parsed.data.title.product}.pdf`);

		dismiss(loadingId);
		logger.success('PDF exported 🎉', parsed.data.title.product);
		show('success', 'PDF exported successfully');
	};

	const shareURL = () => {
		logger.info('Share link requested 🔗');

		const encoded = encodeURIComponent(input);
		const url = `${location.origin}?yaml=${encoded}`;

		navigator.clipboard.writeText(url);

		logger.success('Shareable link copied 📋', { length: encoded.length });
		show('success', 'Shareable link copied');
	};

	return (
		<>
			{toasts && <Toast toasts={toasts} onDismiss={dismiss} />}
			<div className="bg-base-200 flex h-screen w-screen flex-col overflow-hidden">
				<Navbar />
				<div className="h-full grow">
					<div className="divide-base-300 grid h-full w-full grid-cols-2 divide-x">
						{/* YAML input */}
						<div className="col-span-1">
							<textarea
								id="input"
								name="input"
								placeholder="Input YAML"
								className="bg-base-100 h-full w-full p-8 font-mono text-sm focus:outline-none"
								value={input}
								onChange={(event) => {
									setState({ input: event.target.value });
								}}
							/>
						</div>

						{/* Slides preview */}
						<div className="col-span-1 overflow-hidden">
							<div className="h-full w-full overflow-auto p-8">
								<div className="flex flex-col gap-y-8">
									<div className="flex justify-end gap-x-8">
										<button className="btn btn-accent" onClick={shareURL}>
											🔗 Copy Shareable Link
										</button>

										<button
											className="btn btn-primary"
											disabled={!parsed.data || parsed.errors.length > 0}
											onClick={exportPDF}>
											📄 Export PDF
										</button>
									</div>

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

											{slides.map((slide, i) => (
												<SlidePreview
													key={slide.kicker}
													index={i}
													slide={slide}
												/>
											))}
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
