// Layout

export type SlideBlock =
	| { type: 'title'; text: string }
	| { type: 'subtitle'; text: string }
	| { type: 'text'; text: string }
	| {
			type: 'bullets';
			items: { emoji?: string; title?: string; description?: string }[];
	  }
	| { type: 'highlight'; text: string; subtext: string };

export type SlideLayout = {
	kicker?: string;
	blocks: SlideBlock[];
};

// Content

export type TitleSlide = {
	product: string;
	tagline: string;
	audience: string;
};

export type Problem = {
	emoji: string;
	title: string;
	description: string;
	impact: string;
	severity: string;
	userType: string;
};

export type ProblemsSlide = Problem[];

export type Step = {
	step: number;
	emoji: string;
	title: string;
	description: string;
};

export type SolutionSlide = Step[];

export type Feature = { emoji: string; title: string; description: string };

export type ProductSlide = {
	features: Feature[];
};

export type PricingSlide = {
	symbol: string;
	amount: number;
	frequency: string;
};

// Overall

export type PitchDeck = {
	title: TitleSlide;
	problems: ProblemsSlide;
	solutions: SolutionSlide;
	product: ProductSlide;
	pricing: PricingSlide;
};
