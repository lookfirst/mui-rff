import {
	createGenerateClassName,
	StylesProvider,
} from '@material-ui/core/styles';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { CheckboxData, Checkboxes, makeValidate } from '../src';

interface ComponentProps {
	data: CheckboxData[];
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	best: string[];
}

describe('Checkboxes', () => {
	const checkboxData: CheckboxData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const initialValues: FormData = {
		best: ['bar'],
	};

	function CheckboxComponent({
		initialValues,
		data,
		validator,
	}: ComponentProps) {
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
					render={({ handleSubmit, errors }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Checkboxes
								label="Test"
								required={true}
								name="best"
								data={data}
								error={errors.best}
							/>
						</form>
					)}
				/>
			</StylesProvider>
		);
	}

	it('renders without errors', () => {
		const rendered = render(
			<CheckboxComponent data={checkboxData} initialValues={initialValues} />
		);
		expect(rendered).toMatchSnapshot();
	});

	it('clicks on the first checkbox', () => {
		const rendered = render(
			<CheckboxComponent data={checkboxData} initialValues={initialValues} />
		);
		const input = rendered.getByDisplayValue('ack') as HTMLInputElement;
		expect(input.checked).toBeFalsy();
		fireEvent.click(input);
		expect(input.checked).toBeTruthy();
		expect(rendered).toMatchSnapshot();
	});

	it('renders 3 items', () => {
		const rendered = render(
			<CheckboxComponent data={checkboxData} initialValues={initialValues} />
		);
		const inputs = rendered.getAllByRole('checkbox') as HTMLInputElement[];
		expect(inputs.length).toBe(3);
		expect(inputs[0].checked).toBe(false);
		expect(inputs[1].checked).toBe(true);
		expect(inputs[2].checked).toBe(false);
	});

	it('has the Test label', () => {
		const rendered = render(
			<CheckboxComponent data={checkboxData} initialValues={initialValues} />
		);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', () => {
		const rendered = render(
			<CheckboxComponent data={checkboxData} initialValues={initialValues} />
		);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});

	it('requires one checkbox', async () => {
		const message = 'something for testing';

		const validateSchema = makeValidate(
			Yup.object().shape({
				best: Yup.array().min(1, message),
			})
		);

		const rendered = render(
			<CheckboxComponent
				data={checkboxData}
				validator={validateSchema}
				initialValues={initialValues}
			/>
		);
		const input = rendered.getByDisplayValue('bar') as HTMLInputElement;

		expect(input.checked).toBeTruthy();
		fireEvent.click(input);
		expect(input.checked).toBeFalsy();

		const error = await rendered.findByText(message); // validation is async, so we have to await
		expect(error.tagName).toBe('P');

		expect(rendered).toMatchSnapshot();
	});
});
