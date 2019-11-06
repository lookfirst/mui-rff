import React from 'react';

import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { makeValidate, TextField } from '../src';
import { render, fireEvent } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	hello: string;
}

describe('TextField', () => {
	const defaultData = 'something here';

	const initialValues: FormData = {
		hello: defaultData,
	};

	function TextFieldComponent({ initialValues, validator }: ComponentProps) {
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
						<TextField label="Test" name="hello" required={true} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', () => {
		const rendered = render(<TextFieldComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(<TextFieldComponent initialValues={initialValues} />);
		const input = (await rendered.findByDisplayValue(defaultData)) as HTMLInputElement;
		expect(input.value).toBe(defaultData);
	});

	it('has the Test label', () => {
		const rendered = render(<TextFieldComponent initialValues={initialValues} />);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', () => {
		const rendered = render(<TextFieldComponent initialValues={initialValues} />);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
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
});
