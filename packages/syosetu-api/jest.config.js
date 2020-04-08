const { requestPromise } = require('jest-transform-stealthy-require/dist/presets');
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
	clearMocks: true,
	moduleFileExtensions: ['ts', 'js'],
//	moduleFileExtensions: ['js'],
	testEnvironment: 'node',
	//testMatch: ['**/*.test.ts', '**/*.spec.ts'],
	testRegex: ['\\.(test|spec)\\.(ts|tsx)$'],
//	testRegex: ['\\.(test|spec)\\.(js|jsx)$'],
	//testRunner: 'jest-circus/runner',
	transform: {
//		'^.+\\.ts$': 'ts-jest',
		...requestPromise.transform,
		...tsjPreset.transform,
	},
	transformIgnorePatterns: [requestPromise.transformIgnorePattern],
	verbose: true,
	collectCoverage: true,
	"globals": {
		"ts-jest": {
			"diagnostics": false,
		},
	},
}
