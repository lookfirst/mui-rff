import { createGenerateClassName, StylesProvider } from '@material-ui/core/styles';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { makeValidate, TextField } from '../src';

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
		// make a copy of the data because the state is mutated below in one of the tests for clicks
		// then the state is used again for comparison later, which causes tests to be dependent on execution
		// order and fail.
		const generateClassName = createGenerateClassName({
			disableGlobal: true,
			productionPrefix: 'test',
		});

		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		const validate = async (values: FormData) => {
			if (validator) {
				return validator(values);
			}
		};

		return (
			<StylesProvider generateClassName={generateClassName}>
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
			</StylesProvider>
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
