import React from 'react';

import { Button } from '@material-ui/core';
import { InputLabelProps } from '@material-ui/core/InputLabel';

import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { makeValidate, TextField } from '../src';
import { render, fireEvent, act } from './TestUtils';
import {
	TEXT_FIELD_TYPE,
	TYPE_DATE,
	TYPE_DATETIME_LOCAL,
	TYPE_EMAIL,
	TYPE_MONTH,
	TYPE_NUMBER,
	TYPE_PASSWORD,
	TYPE_TELEPHONE,
	TYPE_TEXT,
	TYPE_TIME,
	TYPE_URL,
	TYPE_WEEK,
} from '../src/TextField';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
	setInputLabelProps?: boolean;
	setHelperText?: boolean;
	onSubmit?: any;
	type?: TEXT_FIELD_TYPE;
}

interface FormData {
	hello: string;
}

describe('TextField', () => {
	const defaultData = 'something here';
	const helperText = 'Help, not an error';

	describe('basic component', () => {
		const initialValues: FormData = {
			hello: defaultData,
		};

		const inputLabelProps: Partial<InputLabelProps> = {
			shrink: false,
		};

		function TextFieldComponent({
			initialValues,
			validator,
			setInputLabelProps,
			setHelperText,
			type = TYPE_TEXT,
		}: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			const validate = async (values: FormData) => {
				if (validator) {
					return validator(values);
				}
			};

			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validate}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<TextField
								label="Test"
								name="hello"
								required={true}
								helperText={setHelperText ? helperText : undefined}
								InputLabelProps={setInputLabelProps ? inputLabelProps : undefined}
								type={type}
							/>
						</form>
					)}
				/>
			);
		}

		it('renders without errors', async () => {
			await act(async () => {
				const rendered = render(<TextFieldComponent initialValues={initialValues} />);
				expect(rendered).toMatchSnapshot();
			});
		});

		it('renders the value with default data', async () => {
			const rendered = render(<TextFieldComponent initialValues={initialValues} />);
			const input = (await rendered.findByDisplayValue(defaultData)) as HTMLInputElement;
			expect(input.value).toBe(defaultData);
		});

		it('has the Test label', async () => {
			await act(async () => {
				const rendered = render(<TextFieldComponent initialValues={initialValues} />);
				const elem = rendered.getByText('Test') as HTMLLegendElement;
				expect(elem.tagName).toBe('LABEL');
			});
		});

		it('has the required *', async () => {
			await act(async () => {
				const rendered = render(<TextFieldComponent initialValues={initialValues} />);
				const elem = rendered.getByText('*') as HTMLSpanElement;
				expect(elem.tagName).toBe('SPAN');
				expect(elem.innerHTML).toBe(' *');
			});
		});

		// https://github.com/lookfirst/mui-rff/issues/21
		it('can override InputLabelProps', async () => {
			await act(async () => {
				const rendered = render(<TextFieldComponent initialValues={initialValues} setInputLabelProps={true} />);
				const elem = rendered.getByText('Test') as HTMLLegendElement;
				expect(elem.getAttribute('data-shrink')).toBe('false');
				expect(rendered).toMatchSnapshot();
			});
		});

		// https://github.com/lookfirst/mui-rff/issues/22
		it('can override helperText', async () => {
			await act(async () => {
				const rendered = render(<TextFieldComponent initialValues={initialValues} setHelperText={true} />);
				expect(rendered).toMatchSnapshot();
				const foundText = rendered.getByText(helperText);
				expect(foundText).toBeDefined();
				expect(foundText.tagName).toBe('P');
			});
		});

		it('requires a default value', async () => {
			const message = 'something for testing';

			const validateSchema = makeValidate(
				Yup.object().shape({
					hello: Yup.string().required(message),
				})
			);

			const rendered = render(<TextFieldComponent initialValues={initialValues} validator={validateSchema} />);
			const input = (await rendered.getByRole('textbox')) as HTMLInputElement;

			expect(input.value).toBeDefined();
			fireEvent.change(input, { target: { value: '' } });
			expect(input.value).toBeFalsy();
			fireEvent.blur(input); // validation doesn't happen until we blur from the element

			const error = await rendered.findByText(message); // validation is async, so we have to await
			expect(error.tagName).toBe('P');

			expect(rendered).toMatchSnapshot();
		});

		const textfieldInputTypes: Array<TEXT_FIELD_TYPE> = [
			TYPE_DATE,
			TYPE_DATETIME_LOCAL,
			TYPE_EMAIL,
			TYPE_MONTH,
			TYPE_NUMBER,
			TYPE_PASSWORD,
			TYPE_TELEPHONE,
			TYPE_TEXT,
			TYPE_TIME,
			TYPE_URL,
			TYPE_WEEK,
		];

		textfieldInputTypes.forEach(type => {
			it(`allows to set its type to ${type}`, async () => {
				await act(async () => {
					const rendered = render(<TextFieldComponent initialValues={initialValues} type={type} />);
					const input = (await rendered.getByRole('textbox')) as HTMLInputElement;

					expect(input.value).toBeDefined();
					expect(input.type).toBe(type);
					expect(rendered).toMatchSnapshot();
				});
			});
		});
	});

	describe('submit button tests', () => {
		function TextFieldComponent({ initialValues, validator, onSubmit = () => {} }: ComponentProps) {
			const validate = async (values: FormData) => {
				if (validator) {
					return validator(values);
				}
			};

			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validate}
					subscription={{ submitting: true, pristine: true }}
					render={({ handleSubmit, submitting }) => (
						<form onSubmit={handleSubmit} noValidate>
							<TextField label="Hello world" name="hello" required={true} helperText="omg helper text" />,
							<Button
								variant="contained"
								color="primary"
								type="submit"
								disabled={submitting}
								data-testid="submit"
							>
								Submit
							</Button>
						</form>
					)}
				/>
			);
		}

		it('renders the helper text because no error', async () => {
			const initialValues: FormData = {
				hello: '',
			};

			const { findByTestId, findByText, container } = render(
				<TextFieldComponent initialValues={initialValues} />
			);
			await findByText('omg helper text');

			const submit = await findByTestId('submit');
			fireEvent.click(submit);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('submit shows validation error', async () => {
			const message = 'is not best';

			const initialValues: FormData = {
				hello: '',
			};

			const validateSchema = makeValidate(
				Yup.object().shape({
					hello: Yup.string().required(message),
				})
			);

			const { findByTestId, findByText, container } = render(
				<TextFieldComponent initialValues={initialValues} validator={validateSchema} />
			);

			const submit = await findByTestId('submit');
			await findByText('omg helper text');
			fireEvent.click(submit);
			await findByText(message);
			expect(container).toMatchSnapshot();
		});

		it('submit shows submit error', async () => {
			const message = 'is not best';

			const onSubmit = () => {
				return { hello: 'submit error' };
			};

			const initialValues: FormData = {
				hello: 'foo',
			};

			const validateSchema = makeValidate(
				Yup.object().shape({
					hello: Yup.string().required(message),
				})
			);

			const { findByTestId, findByText, container } = render(
				<TextFieldComponent initialValues={initialValues} validator={validateSchema} onSubmit={onSubmit} />
			);

			const submit = await findByTestId('submit');
			await findByText('omg helper text');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});
});
