import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// The generated entities import the package by name: it resolves to the sources under test.
const alias = { 'gobl-utils-ts': fileURLToPath(new URL('./src/index.ts', import.meta.url)) };

export default defineConfig({
	test: {
		projects: [
			{
				resolve: { alias },
				test: { name: 'unit', include: ['tests/unit/**/*.test.ts'] },
			},
			{
				resolve: { alias },
				// Against what Gobl really generates: `make test-integration` runs the generator first.
				test: { name: 'integration', include: ['tests/integration/**/*.test.ts'] },
			},
		],
	},
});
