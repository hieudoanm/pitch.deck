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
		...validateProduct(data),
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

	const problems = data.problems;

	// --- Section-level validation ---
	if (!problems || typeof problems !== 'object') {
		errors.push({
			path: 'problems',
			message: 'Problems section is missing or invalid',
			hint: 'Define problems with a title and items list.',
		});
		return errors;
	}

	if (typeof problems.title !== 'string') {
		errors.push({
			path: 'problems.title',
			message: 'Problems title is required',
		});
	}

	if (problems.subtitle && typeof problems.subtitle !== 'string') {
		errors.push({
			path: 'problems.subtitle',
			message: 'Problems subtitle must be a string',
		});
	}

	// --- Items validation ---
	if (!Array.isArray(problems.items)) {
		errors.push({
			path: 'problems.items',
			message: 'Problems items must be a list',
			hint: 'Use a YAML list under problems.items.',
		});
		return errors;
	}

	if (problems.items.length === 0) {
		errors.push({
			path: 'problems.items',
			message: 'Problem list is empty',
			hint: 'Add at least one problem.',
		});
		return errors;
	}

	problems.items.forEach((p, i) => {
		if (!p || typeof p !== 'object') {
			errors.push({
				path: `problems.items[${i}]`,
				message: 'Each problem must be an object',
			});
			return;
		}

		if (typeof p.title !== 'string') {
			errors.push({
				path: `problems.items[${i}].title`,
				message: 'Problem title is required',
			});
		}

		if (typeof p.description !== 'string') {
			errors.push({
				path: `problems.items[${i}].description`,
				message: 'Problem description is required',
			});
		}

		if (p.emoji && typeof p.emoji !== 'string') {
			errors.push({
				path: `problems.items[${i}].emoji`,
				message: 'Emoji must be a string',
			});
		}

		if (p.severity && !['low', 'medium', 'high'].includes(p.severity)) {
			errors.push({
				path: `problems.items[${i}].severity`,
				message: 'Severity must be low, medium, or high',
			});
		}
	});

	return errors;
};

const validateSolutions = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	const solutions = data.solutions;

	if (!solutions || typeof solutions !== 'object') {
		errors.push({
			path: 'solutions',
			message: 'Solutions section is required',
			hint: 'Provide solutions with title, subtitle, and items.',
		});
		return errors;
	}

	// Section title
	if (!solutions.title || typeof solutions.title !== 'string') {
		errors.push({
			path: 'solutions.title',
			message: 'Solutions title is required',
		});
	}

	// Section subtitle (optional — remove this block if optional)
	if (!solutions.subtitle || typeof solutions.subtitle !== 'string') {
		errors.push({
			path: 'solutions.subtitle',
			message: 'Solutions subtitle is required',
		});
	}

	// Steps array
	if (!Array.isArray(solutions.items)) {
		errors.push({
			path: 'solutions.items',
			message: 'Solutions must have items',
			hint: 'Provide an array of solution items.',
		});
		return errors;
	}

	if (solutions.items.length === 0) {
		errors.push({
			path: 'solutions.items',
			message: 'Solution items are empty',
		});
		return errors;
	}

	solutions.items.forEach((s: Step, i) => {
		if (typeof s.step !== 'number') {
			errors.push({
				path: `solutions.items[${i}].step`,
				message: 'Step number must be a number',
			});
		}

		if (!s.emoji || typeof s.emoji !== 'string') {
			errors.push({
				path: `solutions.items[${i}].emoji`,
				message: 'Step emoji is required',
			});
		}

		if (!s.title || typeof s.title !== 'string') {
			errors.push({
				path: `solutions.items[${i}].title`,
				message: 'Step title is required',
			});
		}

		if (!s.description || typeof s.description !== 'string') {
			errors.push({
				path: `solutions.items[${i}].description`,
				message: 'Step description is required',
			});
		}
	});

	return errors;
};

const validateProduct = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	const product = data.product;

	// --- Section-level validation ---
	if (!product || typeof product !== 'object') {
		errors.push({
			path: 'product',
			message: 'Product section is missing or invalid',
		});
		return errors;
	}

	if (typeof product.title !== 'string') {
		errors.push({
			path: 'product.title',
			message: 'Product title is required',
		});
	}

	if (product.subtitle && typeof product.subtitle !== 'string') {
		errors.push({
			path: 'product.subtitle',
			message: 'Product subtitle must be a string',
		});
	}

	// --- Features list validation ---
	if (!Array.isArray(product.features)) {
		errors.push({
			path: 'product.features',
			message: 'Product features must be a list',
			hint: 'Use a YAML list under product.features.',
		});
		return errors;
	}

	if (product.features.length === 0) {
		errors.push({
			path: 'product.features',
			message: 'No product features provided',
			hint: 'Add at least one feature.',
		});
		return errors;
	}

	product.features.forEach((f, i) => {
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

	if (typeof data.pricing.title !== 'string') {
		errors.push({
			path: 'pricing.title',
			message: 'Pricing title is required',
		});
	}

	if (data.pricing.subtitle && typeof data.pricing.subtitle !== 'string') {
		errors.push({
			path: 'pricing.subtitle',
			message: 'Pricing subtitle must be a string',
		});
	}

	// Validate currency
	if (typeof data.pricing.currency !== 'string') {
		errors.push({
			path: 'pricing.symbol',
			message: 'Pricing symbol is required',
		});
	}

	// Validate plans
	if (!Array.isArray(data.pricing.plans) || data.pricing.plans.length === 0) {
		errors.push({
			path: 'pricing.plans',
			message: 'At least one pricing plan is required',
		});
		return errors;
	}

	data.pricing.plans.forEach((plan, index) => {
		const basePath = `pricing.plans[${index}]`;

		if (typeof plan.name !== 'string') {
			errors.push({
				path: `${basePath}.name`,
				message: 'Plan name is required',
			});
		}

		if (typeof plan.amount !== 'number') {
			errors.push({
				path: `${basePath}.amount`,
				message: 'Plan amount must be a number',
			});
		}

		if (typeof plan.frequency !== 'string') {
			errors.push({
				path: `${basePath}.frequency`,
				message: 'Plan frequency is required',
			});
		}
	});

	return errors;
};
