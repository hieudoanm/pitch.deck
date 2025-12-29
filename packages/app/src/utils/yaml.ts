import { PitchDeck, Step } from '@pitch/types/pitch.types';

export type ValidationError = {
	path: string;
	message: string;
	hint?: string;
};

export const validate = (data: PitchDeck): ValidationError[] => {
	if (!data || typeof data !== 'object') {
		return [
			{
				path: '',
				message: 'Root YAML must be an object',
				hint: 'Make sure your YAML starts with keys like `title`, `problems`, etc.',
			},
		];
	}

	return [
		...validateTitle(data),
		...validateProblems(data),
		...validateSolutions(data),
		...validateProductFeatures(data),
		...validatePricing(data),
	];
};

const validateTitle = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!data.title) {
		errors.push({
			path: 'title',
			message: 'Missing title section',
			hint: 'Add a `title:` section with product, tagline, and audience.',
		});
		return errors;
	}

	if (typeof data.title.product !== 'string') {
		errors.push({
			path: 'title.product',
			message: 'Product name is required',
			hint: 'Example: product: InvoiceMate',
		});
	}

	if (typeof data.title.tagline !== 'string') {
		errors.push({
			path: 'title.tagline',
			message: 'Tagline is required',
			hint: 'Example: tagline: Simple invoicing for indie founders',
		});
	}

	if (typeof data.title.audience !== 'string') {
		errors.push({
			path: 'title.audience',
			message: 'Audience is required',
			hint: 'Example: audience: Indie founders & freelancers',
		});
	}

	return errors;
};

const validateProblems = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!Array.isArray(data.problems)) {
		errors.push({
			path: 'problems',
			message: 'Problems must be a list',
			hint: 'Use a YAML list of problem objects.',
		});
		return errors;
	}

	if (data.problems.length === 0) {
		errors.push({
			path: 'problems',
			message: 'Problem list is empty',
			hint: 'Add at least one problem.',
		});
		return errors;
	}

	data.problems.forEach((p, i) => {
		if (!p || typeof p !== 'object') {
			errors.push({
				path: `problems[${i}]`,
				message: 'Each problem must be an object',
			});
			return;
		}

		if (typeof p.title !== 'string') {
			errors.push({
				path: `problems[${i}].title`,
				message: 'Problem title is required',
			});
		}

		if (typeof p.description !== 'string') {
			errors.push({
				path: `problems[${i}].description`,
				message: 'Problem description is required',
			});
		}

		if (p.emoji && typeof p.emoji !== 'string') {
			errors.push({
				path: `problems[${i}].emoji`,
				message: 'Emoji must be a string',
			});
		}

		if (p.severity && !['low', 'medium', 'high'].includes(p.severity)) {
			errors.push({
				path: `problems[${i}].severity`,
				message: 'Severity must be low, medium, or high',
			});
		}
	});

	return errors;
};

const validateSolutions = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!Array.isArray(data.solutions)) {
		errors.push({
			path: 'solution.steps',
			message: 'Solution must have steps',
			hint: 'Provide an array of steps.',
		});
		return errors;
	}

	if (data.solutions.length === 0) {
		errors.push({
			path: 'solution.steps',
			message: 'Solution steps are empty',
		});
		return errors;
	}

	data.solutions.forEach((s: Step, i) => {
		if (typeof s.step !== 'number') {
			errors.push({
				path: `solution.steps[${i}].step`,
				message: 'Step number must be a number',
			});
		}

		if (!s.emoji || typeof s.emoji !== 'string') {
			errors.push({
				path: `solution.steps[${i}].emoji`,
				message: 'Step emoji is required',
			});
		}

		if (!s.title || typeof s.title !== 'string') {
			errors.push({
				path: `solution.steps[${i}].title`,
				message: 'Step title is required',
			});
		}

		if (!s.description || typeof s.description !== 'string') {
			errors.push({
				path: `solution.steps[${i}].description`,
				message: 'Step description is required',
			});
		}
	});

	return errors;
};

const validateProductFeatures = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!data.product || !Array.isArray(data.product.features)) {
		errors.push({
			path: 'product.features',
			message: 'Product features must be a list',
		});
		return errors;
	}

	if (data.product.features.length === 0) {
		errors.push({
			path: 'product.features',
			message: 'No product features provided',
		});
		return errors;
	}

	data.product.features.forEach((f, i) => {
		if (!f || typeof f !== 'object') {
			errors.push({
				path: `product.features[${i}]`,
				message: 'Each feature must be an object',
			});
			return;
		}

		if (typeof f.title !== 'string') {
			errors.push({
				path: `product.features[${i}].title`,
				message: 'Feature title is required',
			});
		}

		if (typeof f.description !== 'string') {
			errors.push({
				path: `product.features[${i}].description`,
				message: 'Feature description is required',
			});
		}

		if (f.emoji && typeof f.emoji !== 'string') {
			errors.push({
				path: `product.features[${i}].emoji`,
				message: 'Emoji must be a string',
			});
		}
	});

	return errors;
};

const validatePricing = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!data.pricing) {
		errors.push({
			path: 'pricing',
			message: 'Pricing section is missing',
		});
		return errors;
	}

	if (typeof data.pricing.symbol !== 'string') {
		errors.push({
			path: 'pricing.symbol',
			message: 'Symbol is required',
		});
	}

	if (typeof data.pricing.amount !== 'number') {
		errors.push({
			path: 'pricing.amount',
			message: 'Amount is required',
		});
	}

	if (typeof data.pricing.frequency !== 'string') {
		errors.push({
			path: 'pricing.frequency',
			message: 'Frequency is required',
		});
	}

	return errors;
};
