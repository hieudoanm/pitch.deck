import { SlideBlock } from '@pitch/types/pitch.types';
import { FC } from 'react';

export const TextBlock: FC<{ text: string; className?: string }> = ({
	text,
	className = '',
}) => (
	<div className={className}>
		<pre className="m-0 inline pb-8 break-words whitespace-pre-wrap">
			{text}
		</pre>
	</div>
);

export const PricingPlanBlock: FC<{
	name: string;
	price: string;
}> = ({ name, price }) => (
	<div className="mt-8 flex w-full max-w-sm flex-col items-center">
		<div className="text-base-content mb-8 text-xl font-bold">
			<TextBlock text={name}></TextBlock>
		</div>
		<div className="text-primary mb-8 text-6xl font-extrabold">
			<TextBlock text={price}></TextBlock>
		</div>
	</div>
);

export const CenterBlock: FC<{ key: string; block: SlideBlock }> = ({
	key,
	block,
}) => {
	switch (block.type) {
		case 'title':
			return (
				<TextBlock
					key={key}
					text={block.text}
					className="text-base-content mb-8 text-5xl font-bold"
				/>
			);

		case 'subtitle':
			return (
				<TextBlock
					key={key}
					text={block.text}
					className="text-primary mb-8 text-3xl font-semibold"
				/>
			);

		case 'text':
			return (
				<TextBlock
					key={key}
					text={block.text}
					className="text-neutral-content mb-8 text-xl"
				/>
			);

		case 'pricing-plan':
			return (
				<PricingPlanBlock key={key} name={block.name} price={block.price} />
			);

		default:
			return <></>;
	}
};
