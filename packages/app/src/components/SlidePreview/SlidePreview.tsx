import { PitchDeck, SlideLayout } from '@pitch/types/pitch.types';
import { FC } from 'react';

export const mapYamlToSlides = (data: PitchDeck): SlideLayout[] => [
	{
		kicker: 'Product',
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
				left: data.businessModel.pricing,
				right: data.businessModel.model,
			},
		],
	},
];

export const SlidePreview: FC<{ slide: SlideLayout; index: number }> = ({
	slide,
	index,
}) => (
	<div className="group border-base-300 bg-base-100 relative aspect-video w-full cursor-default rounded-2xl border p-14 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
		<div className="from-primary/5 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

		<div className="absolute top-6 right-6 font-mono text-xs tracking-widest opacity-40">
			{index + 1} / 5
		</div>

		{slide.kicker && (
			<div className="text-primary/80 mb-4 text-xs font-semibold tracking-widest uppercase">
				{slide.kicker}
			</div>
		)}

		{/* deck title */}
		{slide.title && (
			<h2 className="mb-4 text-4xl leading-tight font-bold tracking-tight">
				{slide.title}
			</h2>
		)}

		<div className="flex flex-col gap-6">
			{slide.blocks.map((b, i) => {
				switch (b.type) {
					case 'title':
						return (
							<h2
								key={i}
								className="text-4xl leading-tight font-bold tracking-tight">
								{b.text}
							</h2>
						);

					case 'subtitle':
						return (
							<p key={i} className="text-base-content/90 text-2xl font-medium">
								{b.text}
							</p>
						);

					case 'text':
						return (
							<p
								key={i}
								className="text-base-content/70 max-w-xl text-lg leading-relaxed">
								{b.text}
							</p>
						);

					case 'bullets':
						return (
							<ul key={i} className="space-y-4">
								{b.items.map((item, j) => (
									<li key={j} className="flex items-start gap-4 text-lg">
										<span className="text-primary mt-1">●</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						);

					case 'highlight':
						return (
							<div
								key={i}
								className="bg-base-200 flex items-center gap-6 rounded-xl p-6">
								<div className="text-primary text-4xl font-extrabold">
									{b.left}
								</div>
								<div className="text-base-content/70 text-lg">{b.right}</div>
							</div>
						);
				}
			})}
		</div>
	</div>
);
