import { PitchDeck, SlideLayout } from '@pitch/types/pitch.types';
import { FC, ReactNode } from 'react';

export const mapYamlToSlides = (data: PitchDeck): SlideLayout[] => [
	{
		kicker: 'Introduction',
		blocks: [
			{ type: 'title', text: data.title.product },
			{ type: 'subtitle', text: data.title.tagline },
			{ type: 'text', text: data.title.audience },
		],
	},
	{
		kicker: 'Problems',
		blocks: [
			{ type: 'title', text: 'Problems' },
			{
				type: 'bullets',
				items: data.problems.map((p) => ({
					emoji: p.emoji,
					title: p.title,
					description: p.description,
				})),
			},
		],
	},
	{
		kicker: 'Solution',
		blocks: [
			{ type: 'title', text: 'Solution' },
			{
				type: 'bullets',
				items: data.solutions.map((step) => ({
					emoji: step.emoji,
					title: step.title,
					description: step.description,
				})),
			},
		],
	},
	{
		kicker: 'Product',
		blocks: [
			{ type: 'title', text: 'Product' },
			{
				type: 'bullets',
				items: data.product.features.map((feature) => ({
					emoji: feature.emoji,
					title: feature.title,
					description: feature.description,
				})),
			},
		],
	},
	{
		kicker: 'Business Model',
		blocks: [
			{ type: 'title', text: 'Pricing' },
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
				<div className="mb-8 text-lg font-semibold text-purple-400 uppercase">
					<Text>{slide.kicker}</Text>
				</div>
			)}

			<div className="flex flex-col">
				{slide.blocks.map((b, i) => {
					switch (b.type) {
						case 'title':
							return (
								<div
									key={i}
									className="mb-8 text-5xl leading-tight font-bold text-white">
									<Text>{b.text}</Text>
								</div>
							);

						case 'subtitle':
							return (
								<div
									key={i}
									className="mb-8 text-3xl leading-snug font-medium text-neutral-300">
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
								<ul className="space-y-6">
									{b.items.map((item, j) => (
										<li key={j} className="flex items-center items-start gap-4">
											{/* Emoji */}
											<span className="text-3xl">{item.emoji}</span>
											<div className="flex flex-col gap-2">
												{/* Title */}
												<div className="text-2xl font-bold text-white">
													<Text>{item.title}</Text>
												</div>
												{/* Description */}
												{item.description && (
													<div className="text-xl text-neutral-300">
														<Text>{item.description}</Text>
													</div>
												)}
											</div>
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
