import { PitchDeck, SlideLayout } from '@pitch/types/pitch.types';
import { FC, ReactNode } from 'react';
import { CenterBlock, TextBlock } from '../Block';
import { formatCurrency } from '@pitch/utils/number';

export const mapYamlToSlides = (data: PitchDeck): SlideLayout[] => [
	{
		kicker: 'Introduction',
		blocks: [
			{
				type: 'center',
				blocks: [
					{ type: 'title', text: data.title.product },
					{ type: 'subtitle', text: data.title.tagline },
					{ type: 'text', text: data.title.audience },
				],
			},
		],
	},
	{
		kicker: 'Problems',
		blocks: [
			{ type: 'title', text: data.problems.title },
			{ type: 'subtitle', text: data.problems.subtitle },
			{
				type: 'bullets',
				items: data.problems.items.map((p) => ({
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
			{ type: 'title', text: data.solutions.title },
			{ type: 'subtitle', text: data.solutions.subtitle },
			{
				type: 'bullets',
				items: data.solutions.items.map((item) => ({
					emoji: item.emoji,
					title: item.title,
					description: item.description,
				})),
			},
		],
	},
	{
		kicker: 'Product',
		blocks: [
			{ type: 'title', text: data.product.title },
			{ type: 'subtitle', text: data.product.subtitle },
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
		kicker: 'Pricing Model',
		blocks: [
			{
				type: 'center',
				blocks: [
					{ type: 'title', text: data.pricing.title },
					{ type: 'subtitle', text: data.pricing.subtitle },
					...data.pricing.plans.map((plan) => ({
						type: 'pricing-plan' as const,
						name: plan.name,
						price: formatCurrency(plan.amount, data.pricing.currency),
						frequency: plan.frequency,
					})),
				],
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

			<div className="flex items-start justify-between">
				{/* kicker */}
				{slide.kicker && (
					<div className="text-secondary mb-8 text-lg font-semibold uppercase">
						<Text>{slide.kicker}</Text>
					</div>
				)}
				{/* slide index */}
				<div className="text-base-content font-mono text-lg">
					<Text>{index + 1} / 5</Text>
				</div>
			</div>

			<div className="flex h-full flex-col">
				{slide.blocks.map((block, i) => {
					switch (block.type) {
						case 'title':
							return (
								<TextBlock
									key={i}
									text={block.text}
									className="text-base-content mb-8 text-5xl font-bold"
								/>
							);

						case 'subtitle':
							return (
								<TextBlock
									key={i}
									text={block.text}
									className="text-primary mb-8 text-2xl font-semibold"
								/>
							);

						case 'text':
							return (
								<TextBlock
									key={i}
									text={block.text}
									className="text-neutral-content text-2xl"
								/>
							);

						case 'center': {
							const pricingPlans = block.blocks.filter(
								(b) => b.type === 'pricing-plan'
							);

							const contentBlocks = block.blocks.filter(
								(b) => b.type !== 'pricing-plan'
							);

							return (
								<div className="-mt-16 flex h-full flex-col items-center justify-center text-center">
									{/* Text content (title, subtitle, etc.) */}
									{contentBlocks.map((child, i) => (
										<CenterBlock key={`text-${i}`} block={child} />
									))}

									{/* Pricing plans row */}
									{pricingPlans.length > 0 && (
										<div className="mt-12 flex items-center justify-center">
											{pricingPlans.map((plan, i) => (
												<div key={i} className="flex items-start">
													<CenterBlock key={plan.frequency} block={plan} />

													{i < pricingPlans.length - 1 && (
														<span className="text-base-100 mx-12 text-9xl font-light">
															|
														</span>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							);
						}

						case 'bullets':
							return (
								<ul key={i} className="space-y-6">
									{block.items.map((item, j) => (
										<li key={j} className="flex gap-4">
											<span className="text-3xl">{item.emoji}</span>
											<div>
												<div className="text-base-content text-2xl font-bold">
													<TextBlock text={item.title ?? ''} />
												</div>
												{item.description && (
													<div className="text-neutral-content text-xl">
														<TextBlock text={item.description ?? ''} />
													</div>
												)}
											</div>
										</li>
									))}
								</ul>
							);

						default:
							return null;
					}
				})}
			</div>
		</div>
	);
};
