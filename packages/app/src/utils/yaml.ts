import { PitchDeck } from '@pitch/types/pitch.types';

type ValidationError = {
	path: string; // e.g. "title.product"
	message: string; // what's wrong
	hint?: string; // how to fix it
};

export const validate = (data: PitchDeck): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!data || typeof data !== 'object') {
		return [
			{
				path: '',
				message: 'Root YAML must be an object',
				hint: 'Make sure your YAML starts with keys like `title`, `problem`, etc.',
			},
		];
	}

	// --- Title ---
	if (!data.title) {
		errors.push({
			path: 'title',
			message: 'Missing title section',
			hint: 'Add a `title:` section with product, tagline, and audience.',
		});
	} else {
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
	}

	// --- Problem ---
	if (!Array.isArray(data.problem)) {
		errors.push({
			path: 'problem',
			message: 'Problem must be a list',
			hint: 'Use a YAML list with 2–4 clear pain points.',
		});
	} else if (data.problem.length === 0) {
		errors.push({
			path: 'problem',
			message: 'Problem list is empty',
			hint: 'Add at least one problem statement.',
		});
	} else {
		data.problem.forEach((p: string, i: number) => {
			if (typeof p !== 'string') {
				errors.push({
					path: `problem[${i}]`,
					message: 'Each problem must be a string',
					hint: 'Example: - Creating invoices is slow',
				});
			}
		});
	}

	// --- Solution ---
	if (!data.solution || typeof data.solution.description !== 'string') {
		errors.push({
			path: 'solution.description',
			message: 'Solution description is required',
			hint: 'Explain how you solve the problem in one sentence.',
		});
	}

	// --- Product ---
	if (!data.product || !Array.isArray(data.product.features)) {
		errors.push({
			path: 'product.features',
			message: 'Product features must be a list',
			hint: 'Example: features: [Fast setup, Stripe sync]',
		});
	} else if (data.product.features.length === 0) {
		errors.push({
			path: 'product.features',
			message: 'No product features provided',
			hint: 'Add 2–5 short feature bullets.',
		});
	}

	// --- Business Model ---
	if (!data.businessModel) {
		errors.push({
			path: 'businessModel',
			message: 'Business model section is missing',
			hint: 'Add pricing and revenue model.',
		});
	} else {
		if (typeof data.businessModel.pricing !== 'string') {
			errors.push({
				path: 'businessModel.pricing',
				message: 'Pricing is required',
				hint: 'Example: pricing: $9/month',
			});
		}

		if (typeof data.businessModel.model !== 'string') {
			errors.push({
				path: 'businessModel.model',
				message: 'Business model is required',
				hint: 'Example: model: Subscription SaaS',
			});
		}
	}

	return errors;
};
