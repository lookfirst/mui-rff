import { describe, expect, it } from 'vitest';
import * as Yup from 'yup';

import { makeRequired } from '../src';

describe('Require', () => {
	describe('makeRequired', () => {
		it('extracts the required fields', () => {
			const schema = Yup.object().shape({
				string: Yup.string().required(),
				stringNotDeclared: Yup.string(),
				stringNot: Yup.string().notRequired(),
			});

			const required = makeRequired(schema);
			expect(required).toMatchSnapshot();
		});

		it('extracts the required fields when deeply nested', () => {
			const schema = Yup.object().shape({
				string: Yup.string().required(),
				stringNotDeclared: Yup.string(),
				stringNot: Yup.string().notRequired(),
				deep: Yup.object().shape({
					string: Yup.string().required(),
					stringNotDeclared: Yup.string(),
					stringNot: Yup.string().notRequired(),
					deeper: Yup.object().shape({
						num: Yup.number().required(),
					}),
				}),
			});

			const required = makeRequired(schema);
			expect(required).toMatchSnapshot();
		});
	});
});
