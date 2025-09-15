import { describe, expect, it } from 'vitest';
import { number, object, string } from 'yup';

import { makeRequired } from '../src';

describe('Require', () => {
	describe('makeRequired', () => {
		it('extracts the required fields', () => {
			const schema = object().shape({
				string: string().required(),
				stringNotDeclared: string(),
				stringNot: string().notRequired(),
			});

			const required = makeRequired(schema);
			expect(required).toMatchSnapshot();
		});

		it('extracts the required fields when deeply nested', () => {
			const schema = object().shape({
				string: string().required(),
				stringNotDeclared: string(),
				stringNot: string().notRequired(),
				deep: object().shape({
					string: string().required(),
					stringNotDeclared: string(),
					stringNot: string().notRequired(),
					deeper: object().shape({
						num: number().required(),
					}),
				}),
			});

			const required = makeRequired(schema);
			expect(required).toMatchSnapshot();
		});
	});
});
