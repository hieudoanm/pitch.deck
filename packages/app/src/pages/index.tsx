import { Landing } from '@pitch/components/Landing';
import { INITIAL_CONTENT } from '@pitch/constants/app';
import { logger } from '@pitch/utils/logger';
import { validate } from '@pitch/utils/yaml';
import { NextPage } from 'next';
import { parse } from 'yaml';

const parseContent = (content: string) => {
	try {
		logger.info('Parsing YAML ✍️');
		const result = parse(content);
		const errors = validate(result);

		if (errors.length > 0) {
			logger.warn('YAML validation errors 🧪', errors);
		} else {
			logger.success('YAML valid ✅');
		}

		return { data: result, errors: validate(result) };
	} catch (error) {
		logger.error('YAML parsing failed 💥', error);
		return { data: null, errors: [{ path: '', message: 'Invalid YAML' }] };
	}
};

const HomePage: NextPage = () => {
	const parsed = parseContent(INITIAL_CONTENT);

	const { data } = parsed;

	return <Landing data={data} />;
};

export default HomePage;
