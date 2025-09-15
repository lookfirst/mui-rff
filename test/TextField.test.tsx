import { Button } from '@mui/material';
import type { InputLabelProps } from '@mui/material/InputLabel';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it } from 'vitest';
import { object, string } from 'yup';

import { makeValidateSync, showErrorOnChange, TextField } from '../src';
import {
	type TEXT_FIELD_TYPE,
	TYPE_COLOR,
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

type ComponentProps = {
	initialValues: FormData;
	validator?: any;
	setInputLabelProps?: boolean;
	setHelperText?: boolean;
	onSubmit?: any;
	type?: TEXT_FIELD_TYPE;
};

type FormData = {
	hello: string;
};

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
			initialValues: initialVals,
			validator,
			setInputLabelProps,
			setHelperText,
			type = TYPE_TEXT,
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
								helperText={
									setHelperText ? helperText : undefined
								}
								label="Test"
								margin="normal"
								name="hello"
								required={true}
								slotProps={{
									inputLabel: setInputLabelProps
										? inputLabelProps
										: undefined,
									htmlInput: { 'data-testid': 'textbox' },
								}}
								type={type}
							/>
						</form>
					)}
					validate={validator}
				/>
			);
		}

		it('renders without errors', () => {
			const rendered = render(
				<TextFieldComponent initialValues={initialValues} />
			);
			expect(rendered).toMatchSnapshot();
		});

		it('renders the value with default data', async () => {
			const rendered = render(
				<TextFieldComponent initialValues={initialValues} />
			);
			const input = (await rendered.findByDisplayValue(
				defaultData
			)) as HTMLInputElement;
			expect(input.value).toBe(defaultData);
		});

		it('has the Test label', () => {
			const rendered = render(
				<TextFieldComponent initialValues={initialValues} />
			);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});

		it('has the required *', () => {
			const rendered = render(
				<TextFieldComponent initialValues={initialValues} />
			);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});

		// https://github.com/lookfirst/mui-rff/issues/21
		it('can override InputLabelProps', () => {
			const rendered = render(
				<TextFieldComponent
					initialValues={initialValues}
					setInputLabelProps={true}
				/>
			);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.getAttribute('data-shrink')).toBe('false');
			expect(rendered).toMatchSnapshot();
		});

		// https://github.com/lookfirst/mui-rff/issues/22
		it('can override helperText', () => {
			const rendered = render(
				<TextFieldComponent
					initialValues={initialValues}
					setHelperText={true}
				/>
			);
			expect(rendered).toMatchSnapshot();
			const foundText = rendered.getByText(helperText);
			expect(foundText).toBeDefined();
			expect(foundText.tagName).toBe('P');
		});

		it('requires a default value', async () => {
			const message = 'something for testing';
			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required(message),
				})
			);

			const { getByTestId, findByText, container } = render(
				<TextFieldComponent
					initialValues={initialValues}
					validator={validateSchema}
				/>
			);
			const input = getByTestId('textbox') as HTMLInputElement;

			expect(input.value).toBeDefined();
			fireEvent.change(input, { target: { value: '' } });
			expect(input.value).toBeFalsy();
			fireEvent.blur(input); // validation doesn't happen until we blur from the element

			const error = await findByText(message); // validation is async, so we have to await
			expect(error.tagName).toBe('P');
			expect(container).toMatchSnapshot();
		});

		describe('text field input values', () => {
			const textfieldInputTypes: TEXT_FIELD_TYPE[] = [
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
				TYPE_COLOR,
			];

			for (const type of textfieldInputTypes) {
				it(`sets its type to ${type}`, () => {
					const { getByTestId, container } = render(
						<TextFieldComponent
							initialValues={initialValues}
							type={type}
						/>
					);
					const input = getByTestId('textbox') as HTMLInputElement;

					expect(input.value).toBeDefined();
					expect(input.type).toBe(type);
					expect(container).toMatchSnapshot();
				});
			}
		});
	});

	describe('showError property', () => {
		function TextFieldComponent({
			initialValues,
			validator,
			onSubmit = () => {
				return;
			},
		}: ComponentProps) {
			return (
				<Form
					initialValues={initialValues}
					onSubmit={onSubmit}
					render={({ handleSubmit, submitting }) => (
						<form noValidate onSubmit={handleSubmit}>
							<TextField
								helperText="omg helper text"
								label="Hello world"
								name="hello"
								required={true}
								showError={showErrorOnChange}
							/>
							,
							<Button
								color="primary"
								data-testid="submit"
								disabled={submitting}
								type="submit"
								variant="contained"
							>
								Submit
							</Button>
						</form>
					)}
					subscription={{ submitting: true, pristine: true }}
					validate={validator}
				/>
			);
		}

		it('can accept showError', async () => {
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
	});

	describe('submit button tests', () => {
		function TextFieldComponent({
			initialValues,
			validator,
			onSubmit = () => {
				return;
			},
		}: ComponentProps) {
			return (
				<Form
					initialValues={initialValues}
					onSubmit={onSubmit}
					render={({ handleSubmit, submitting }) => (
						<form noValidate onSubmit={handleSubmit}>
							<TextField
								helperText="omg helper text"
								label="Hello world"
								name="hello"
								required={true}
							/>
							,
							<Button
								color="primary"
								data-testid="submit"
								disabled={submitting}
								type="submit"
								variant="contained"
							>
								Submit
							</Button>
						</form>
					)}
					subscription={{ submitting: true, pristine: true }}
					validate={validator}
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

			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required(message),
				})
			);

			const { findByTestId, findByText, container } = render(
				<TextFieldComponent
					initialValues={initialValues}
					validator={validateSchema}
				/>
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

			const validateSchema = makeValidateSync(
				object().shape({
					hello: string().required(message),
				})
			);

			const { findByTestId, findByText, container } = render(
				<TextFieldComponent
					initialValues={initialValues}
					onSubmit={onSubmit}
					validator={validateSchema}
				/>
			);

			const submit = await findByTestId('submit');
			await findByText('omg helper text');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});
});
