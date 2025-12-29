// Layout

export type SlideBlock =
	| { type: 'title'; text: string }
	| { type: 'subtitle'; text: string }
	| { type: 'text'; text: string }
	| {
			type: 'bullets';
			items: {
				emoji?: string;
				title?: string;
				description?: string;
			}[];
	  }
	| {
			type: 'highlight';
			text?: string;
			subtext?: string;
	  }
	| {
			type: 'pricing-plan';
			name: string;
			price: string;
			frequency: string;
	  }
	| {
			type: 'center';
			blocks: SlideBlock[];
	  };

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

export type ProblemsSlide = {
	title: string;
	subtitle: string;
	items: Problem[];
};

export type Step = {
	step: number;
	emoji: string;
	title: string;
	description: string;
};

export type SolutionSlide = { title: string; subtitle: string; items: Step[] };

export type Feature = { emoji: string; title: string; description: string };

export type ProductSlide = {
	title: string;
	subtitle: string;
	features: Feature[];
};

export type PricingPlan = {
	name: string;
	amount: number;
	frequency: 'one-time' | 'month' | 'year';
	description?: string;
	features?: string[];
};

export type PricingSlide = {
	title: string;
	subtitle: string;
	model: 'one-time' | 'subscription' | 'freemium' | 'usage-based';
	currency: string;
	plans: PricingPlan[];
};

// Overall

export type PitchDeck = {
	title: TitleSlide;
	problems: ProblemsSlide;
	solutions: SolutionSlide;
	product: ProductSlide;
	pricing: PricingSlide;
};
