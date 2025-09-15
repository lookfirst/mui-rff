import { fireEvent, getNodeText, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it } from 'vitest';
import { object, setLocale, string, type ValidationError } from 'yup';

import { makeValidateSync, TextField } from '../src';
import type { Translator } from '../src/Validation';

setLocale({
	mixed: {
		required: ({ path }: any) => ({
			key: 'field_required',
			field: path,
		}),
	},
	string: {
		min: ({ path }: any) => ({
			key: 'field_too_short',
			field: path,
		}),
		email: ({ path }: any) => ({
			key: 'field_not_email',
			field: path,
		}),
	},
});

const myTranslatorFunction: Translator = ({ message }: ValidationError) => {
	const error = message as any;
	// use some kind of translation library to actually translate the objects to strings (like i18next)
	return `${error.key}: ${error.field}`;
};

const myExtendedTranslatorFunction: Translator = ({
	message,
}: ValidationError) => {
	const error = message as any;
	// use some kind of translation library to actually translate the objects to strings (like i18next)
	return (
		<span data-testid="error_field" key={error.key}>
			{error.key}: {error.field}
		</span>
	);
};

type ComponentProps = {
	initialValues: FormData;
	validator?: any;
	onSubmit?: any;
};

type FormData = {
	hello: string;
};

describe('Validate', () => {
	describe('multiple validation errors', () => {
		const initialValues: FormData = {
			hello: '',
		};

		function TextFieldComponent({
			initialValues: initialVals,
			validator,
		}: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			return (
				<Form
					initialValues={initialVals}
					onSubmit={onSubmit}
					render={({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<TextField
								label="Test"
								name="hello"
								required={true}
								slotProps={{
									htmlInput: { 'data-testid': 'textfield' },
								}}
							/>
						</form>
					)}
					validate={validator}
				/>
			);
		}

		it('with YUP localisation mingles objects when no translator', () => {
			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required().min(10).email(),
				})
			);

			const dataFaulty = {
				hello: '',
			};

			const errors = validateSchema(dataFaulty as any);

			expect(errors).toStrictEqual({
				hello: [
					{ field: 'hello', key: 'field_required' },
					{ field: 'hello', key: 'field_too_short' },
				],
			});
		});

		it('with YUP localisation doesnt mingle objects with a translator', () => {
			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required().min(10).email(),
				}),
				myTranslatorFunction
			);

			const dataFaulty = {
				hello: '',
			};

			const errors = validateSchema(dataFaulty as any);

			expect(errors).toEqual({
				hello: ['field_required: hello', 'field_too_short: hello'],
			});
		});

		it('can render multiple errors', async () => {
			const message = 'field_too_short: hellofield_not_email: hello';

			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required().min(10).email(),
				}),
				myTranslatorFunction
			);

			const { findByText, container } = render(
				<TextFieldComponent
					initialValues={initialValues}
					validator={validateSchema}
				/>
			);
			const input = container.querySelector('input') as HTMLInputElement;

			// ensure the validation is made and errors are rendered
			fireEvent.focus(input);
			fireEvent.change(input, {
				target: { value: 'no email' },
			});
			fireEvent.blur(input);

			// find element with errors
			// biome-ignore lint/performance/useTopLevelRegex: test
			const error = await findByText(/field_not_email/); // validation is async, so we have to await
			expect(error.innerHTML).toContain(message);

			expect(container).toMatchSnapshot();
		});

		it('can render multiple errors in separate elements', async () => {
			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required().min(10).email(),
				}),
				myExtendedTranslatorFunction
			);

			const { findAllByTestId, container } = render(
				<TextFieldComponent
					initialValues={initialValues}
					validator={validateSchema}
				/>
			);
			const input = container.querySelector('input') as HTMLInputElement;

			// ensure the validation is made and errors are rendered
			fireEvent.focus(input);
			fireEvent.change(input, {
				target: { value: 'no email' },
			});
			fireEvent.blur(input);

			// find error fields
			const errors = await findAllByTestId('error_field'); // validation is async, so we have to await
			expect(errors).toHaveLength(2);
			expect(getNodeText(errors[0])).toContain('field_too_short: hello');
			expect(getNodeText(errors[1])).toContain('field_not_email: hello');

			expect(container).toMatchSnapshot();
		});

		it('can render multiple errors in nested form fields structure', async () => {
			function TextFieldComponent2({ validator }: { validator?: any }) {
				return (
					<Form
						// biome-ignore lint/suspicious/noEmptyBlockStatements: test
						onSubmit={() => {}}
						render={({ handleSubmit }) => (
							<form noValidate onSubmit={handleSubmit}>
								<TextField
									label="Test with parent"
									name="parent.hello"
									required={true}
								/>
							</form>
						)}
						validate={validator}
					/>
				);
			}
			const validateSchema = makeValidateSync(
				object().shape({
					parent: object().shape({
						hello: string().required().min(10).email(),
					}),
				}),
				myExtendedTranslatorFunction
			);

			const { findAllByTestId, container } = render(
				<TextFieldComponent2 validator={validateSchema} />
			);
			const input = container.querySelector('input') as HTMLInputElement;

			// ensure the validation is made and errors are rendered
			fireEvent.focus(input);
			fireEvent.change(input, {
				target: { value: 'no email' },
			});
			fireEvent.blur(input);

			// find error fields
			const errors = await findAllByTestId('error_field'); // validation is async, so we have to await
			expect(errors).toHaveLength(2);
			expect(getNodeText(errors[0])).toContain(
				'field_too_short: parent.hello'
			);
			expect(getNodeText(errors[1])).toContain(
				'field_not_email: parent.hello'
			);

			expect(container).toMatchSnapshot();
		});
	});
});
