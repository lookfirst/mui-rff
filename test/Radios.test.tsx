import React from 'react';
import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { RadioData, Radios, makeValidate } from '../src';
import { render, fireEvent, act } from './TestUtils';

interface ComponentProps {
	data: RadioData[];
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	best: string;
}

describe('Radios', () => {
	const radioData: RadioData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const initialValues: FormData = {
		best: 'bar',
	};

	function RadioComponent({ initialValues, data, validator }: ComponentProps) {
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
						<Radios label="Test" required={true} name="best" data={data} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('clicks on the first radio', () => {
		const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
		const input = rendered.getByDisplayValue('ack') as HTMLInputElement;
		expect(input.checked).toBeFalsy();
		fireEvent.click(input);
		expect(input.checked).toBeTruthy();
		expect(rendered).toMatchSnapshot();
	});

	it('renders 3 items', async () => {
		await act(async () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const inputs = rendered.getAllByRole('radio') as HTMLInputElement[];
			expect(inputs.length).toBe(3);
			expect(inputs[0].checked).toBe(false);
			expect(inputs[1].checked).toBe(true);
			expect(inputs[2].checked).toBe(false);
		});
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});

	it('requires one radio', async () => {
		const message = 'something for testing';

		const validateSchema = makeValidate(
			Yup.object().shape({
				best: Yup.string().required(message),
			})
		);

		const rendered = render(
			<RadioComponent data={radioData} validator={validateSchema} initialValues={{ best: '' }} />
		);

		const form = await rendered.findByRole('form');

		const inputBar = rendered.getByDisplayValue('bar') as HTMLInputElement;
		const inputAck = rendered.getByDisplayValue('ack') as HTMLInputElement;
		const inputFoo = rendered.getByDisplayValue('foo') as HTMLInputElement;

		expect(inputBar.checked).toBeFalsy();
		expect(inputAck.checked).toBeFalsy();
		expect(inputFoo.checked).toBeFalsy();
		fireEvent.submit(form);
		expect(inputBar.checked).toBeFalsy();
		expect(inputAck.checked).toBeFalsy();
		expect(inputFoo.checked).toBeFalsy();

		const errorText = await rendered.findByText(message); // validation is async, so we have to await
		expect(errorText.tagName).toBe('P');
		expect(errorText.innerHTML).toContain(message);

		expect(rendered).toMatchSnapshot();
	});
});
