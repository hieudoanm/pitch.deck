// Layout

export type SlideBlock =
	| { type: 'title'; text: string }
	| { type: 'subtitle'; text: string }
	| { type: 'text'; text: string }
	| { type: 'bullets'; items: string[] }
	| { type: 'highlight'; left: string; right: string };

export type SlideLayout = {
	kicker?: string;
	title?: string;
	blocks: SlideBlock[];
};

// Content

export type TitleSlide = {
	product: string;
	tagline: string;
	audience: string;
};

export type ProblemSlide = string[];

export type SolutionSlide = {
	description: string;
};

export type ProductSlide = {
	features: string[];
};

export type BusinessModelSlide = {
	pricing: string;
	model: 'Subscription' | 'One-time' | 'Freemium' | string;
};

// Overall

export type PitchDeck = {
	title: TitleSlide;
	problem: ProblemSlide;
	solution: SolutionSlide;
	product: ProductSlide;
	businessModel: BusinessModelSlide;
};
