import React from 'react';

import * as Yup from 'yup';
import { Form } from 'react-final-form';

import { TextField, makeValidateSync } from '../src';
import { Translator } from '../src/Validation';
import { fireEvent, getNodeText, render } from '@testing-library/react';

Yup.setLocale({
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

const myTranslatorFunction: Translator = ({ message }: Yup.ValidationError) => {
	const error = message as any;
	// use some kind of translation library to actually translate the objects to strings (like i18next)
	return `${error.key}: ${error.field}`;
};

const myExtendedTranslatorFunction: Translator = ({ message }: Yup.ValidationError) => {
	const error = message as any;
	// use some kind of translation library to actually translate the objects to strings (like i18next)
	return (
		<span data-testid="error_field" key={error.key}>
			{error.key}: {error.field}
		</span>
	);
};

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
	onSubmit?: any;
}

interface FormData {
	hello: string;
}

describe('Validate', () => {
	describe('multiple validation errors', () => {
		const initialValues: FormData = {
			hello: '',
		};

		function TextFieldComponent({ initialValues, validator }: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validator}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<TextField
								label="Test"
								name="hello"
								required={true}
								inputProps={{ 'data-testid': 'textfield' }}
							/>
						</form>
					)}
				/>
			);
		}

		it('with YUP localisation mingles objects when no translator', async () => {
			const validateSchema = makeValidateSync(
				Yup.object().shape({
					hello: Yup.string().required().min(10).email(),
				}),
			);

			const dataFaulty = {
				hello: '',
			};

			const errors = await validateSchema(dataFaulty as any);

			expect(errors).toStrictEqual({
				hello: [
					{ field: 'hello', key: 'field_required' },
					{ field: 'hello', key: 'field_too_short' },
				],
			});
		});

		it('with YUP localisation doesnt mingle objects with a translator', async () => {
			const validateSchema = makeValidateSync(
				Yup.object().shape({
					hello: Yup.string().required().min(10).email(),
				}),
				myTranslatorFunction,
			);

			const dataFaulty = {
				hello: '',
			};

			const errors = await validateSchema(dataFaulty as any);

			expect(errors).toEqual({ hello: ['field_required: hello', 'field_too_short: hello'] });
		});

		it('can render multiple errors', async () => {
			const message = 'field_too_short: hellofield_not_email: hello';

			const validateSchema = makeValidateSync(
				Yup.object().shape({
					hello: Yup.string().required().min(10).email(),
				}),
				myTranslatorFunction,
			);

			const { findByText, container } = render(
				<TextFieldComponent validator={validateSchema} initialValues={initialValues} />,
			);
			const input = container.querySelector('input') as HTMLInputElement;

			// ensure the validation is made and errors are rendered
			fireEvent.focus(input);
			fireEvent.change(input, {
				target: { value: 'no email' },
			});
			fireEvent.blur(input);

			// find element with errors
			const error = await findByText(/field_not_email/); // validation is async, so we have to await
			expect(error.innerHTML).toContain(message);

			expect(container).toMatchSnapshot();
		});

		it('can render multiple errors in separate elements', async () => {
			const validateSchema = makeValidateSync(
				Yup.object().shape({
					hello: Yup.string().required().min(10).email(),
				}),
				myExtendedTranslatorFunction,
			);

			const { findAllByTestId, container } = render(
				<TextFieldComponent validator={validateSchema} initialValues={initialValues} />,
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
			function TextFieldComponent({ validator }: { validator?: any }) {
				return (
					<Form
						onSubmit={jest.fn}
						validate={validator}
						render={({ handleSubmit }) => (
							<form onSubmit={handleSubmit} noValidate>
								<TextField label="Test with parent" name="parent.hello" required={true} />
							</form>
						)}
					/>
				);
			}
			const validateSchema = makeValidateSync(
				Yup.object().shape({
					parent: Yup.object().shape({
						hello: Yup.string().required().min(10).email(),
					}),
				}),
				myExtendedTranslatorFunction,
			);

			const { findAllByTestId, container } = render(<TextFieldComponent validator={validateSchema} />);
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
			expect(getNodeText(errors[0])).toContain('field_too_short: parent.hello');
			expect(getNodeText(errors[1])).toContain('field_not_email: parent.hello');

			expect(container).toMatchSnapshot();
		});
	});
});
