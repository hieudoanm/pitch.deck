import { PitchDeck, SlideLayout } from '@pitch/types/pitch.types';
import { FC, ReactNode } from 'react';

export const mapYamlToSlides = (data: PitchDeck): SlideLayout[] => [
	{
		kicker: 'Introduction',
		title: data.title.product,
		blocks: [
			{ type: 'subtitle', text: data.title.tagline },
			{ type: 'text', text: data.title.audience },
		],
	},
	{
		kicker: 'Problem',
		title: 'Problem',
		blocks: [{ type: 'bullets', items: data.problem }],
	},
	{
		kicker: 'Solution',
		title: 'Solution',
		blocks: [{ type: 'text', text: data.solution.description }],
	},
	{
		kicker: 'Product',
		title: 'Product',
		blocks: [{ type: 'bullets', items: data.product.features }],
	},
	{
		kicker: 'Business Model',
		title: 'Pricing',
		blocks: [
			{
				type: 'highlight',
				text: `${data.pricing.symbol}${data.pricing.amount}`,
				subtext: `${data.pricing.frequency}`,
			},
		],
	},
];

const Text: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<pre className="m-0 inline pb-8 break-words whitespace-pre-wrap">
			{children}
		</pre>
	);
};

export const SlidePreview: FC<{ slide: SlideLayout; index: number }> = ({
	slide,
	index,
}) => {
	return (
		<div className="group bg-base-100 border-base-100 relative aspect-video h-[720px] w-[1280px] cursor-default border p-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
			{/* hover gradient overlay */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500 to-transparent opacity-0 transition-opacity group-hover:opacity-20" />

			{/* slide index */}
			<div className="absolute top-6 right-6 font-mono text-lg text-neutral-400">
				{index + 1} / 5
			</div>

			{/* kicker */}
			{slide.kicker && (
				<div className="mb-6 text-lg font-semibold text-purple-400 uppercase">
					<Text>{slide.kicker}</Text>
				</div>
			)}

			{/* deck title */}
			{slide.title && (
				<div className="mb-6 text-6xl leading-tight font-bold text-white">
					<Text>{slide.title}</Text>
				</div>
			)}

			<div className="flex flex-col gap-6">
				{slide.blocks.map((b, i) => {
					switch (b.type) {
						case 'title':
							return (
								<div
									key={i}
									className="text-5xl leading-tight font-bold text-white">
									<Text>{b.text}</Text>
								</div>
							);

						case 'subtitle':
							return (
								<div
									key={i}
									className="text-3xl leading-snug font-medium text-neutral-300">
									<Text>{b.text}</Text>
								</div>
							);

						case 'text':
							return (
								<div
									key={i}
									className="text-2xl leading-relaxed text-neutral-400">
									<Text>{b.text}</Text>
								</div>
							);

						case 'bullets':
							return (
								<ul className="list-inside list-disc space-y-4 pl-10 text-2xl leading-relaxed text-neutral-200 marker:text-purple-400">
									{b.items.map((item, j) => (
										<li key={j}>
											<Text>{item}</Text>
										</li>
									))}
								</ul>
							);

						case 'highlight':
							return (
								<div key={i} className="flex items-start gap-8 pb-8">
									{/* big number */}
									<div className="flex flex-shrink-0 items-baseline gap-2 text-purple-400">
										{b.text && (
											<span className="text-8xl font-extrabold">{b.text}</span>
										)}
										{b.text && b.subtext && <span className="text-6xl">/</span>}
										{b.subtext && <span className="text-4xl">{b.subtext}</span>}
									</div>
								</div>
							);
					}
				})}
			</div>
		</div>
	);
};
