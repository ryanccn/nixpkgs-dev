import { config } from '@ryanccn/eslint-config';

export default config({
	rules: {
		'unicorn/no-top-level-side-effects': 'off',
		'unicorn/name-replacements': 'off',
	},
});
