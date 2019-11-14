import { InputLabelProps } from '@material-ui/core/InputLabel';
import React from 'react';

import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { makeValidate, TextField } from '../src';
import { render, fireEvent, act } from './TestUtils';
import { TYPE_TEXT, TYPE_PASSWORD } from '../src/TextField';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
	setInputLabelProps?: boolean;
	setHelperText?: boolean;
	type?: typeof TYPE_TEXT | typeof TYPE_PASSWORD;
}

interface FormData {
	hello: string;
}

describe('TextField', () => {
	const defaultData = 'something here';
	const helperText = 'Help, not an error';

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

	it('allows to set its type to password', async () => {
		const rendered = render(<TextFieldComponent initialValues={initialValues} type={TYPE_PASSWORD} />);
		const input = (await rendered.getByRole('textbox')) as HTMLInputElement;

		expect(input.value).toBeDefined();
		expect(input.type).toBe(TYPE_PASSWORD);
	});
});
