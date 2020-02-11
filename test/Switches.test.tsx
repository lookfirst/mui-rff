import React from 'react';

import { Form } from 'react-final-form';
import * as Yup from 'yup';

import { SwitchData, Switch, makeValidate } from '../src';
import { render, fireEvent, act } from './TestUtils';

interface ComponentProps {
	data: SwitchData | SwitchData[];
	initialValues?: FormData;
	validator?: any;
}

interface FormData {
	best: string[];
}

describe('Switches', () => {
	const switchData: SwitchData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const initialValues: FormData = {
		best: ['bar'],
	};

	function SwitchComponent({ initialValues, data, validator }: ComponentProps) {
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
						<Switch label="Test" required={true} name="best" data={data} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = render(<SwitchComponent data={switchData} initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('clicks on the first switch', () => {
		const rendered = render(<SwitchComponent data={switchData} initialValues={initialValues} />);
		const inputAck = rendered.getByDisplayValue('ack') as HTMLInputElement;
		expect(inputAck.checked).toBe(false);
		fireEvent.click(inputAck);
		expect(inputAck.checked).toBe(true);
		expect(rendered).toMatchSnapshot();
	});

	it('renders 3 items', async () => {
		await act(async () => {
			const rendered = render(<SwitchComponent data={switchData} initialValues={initialValues} />);
			const inputs = rendered.getAllByRole('checkbox') as HTMLInputElement[];
			expect(inputs.length).toBe(3);
			expect(inputs[0].checked).toBe(false);
			expect(inputs[1].checked).toBe(true);
			expect(inputs[2].checked).toBe(false);
		});
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = render(<SwitchComponent data={switchData} initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = render(<SwitchComponent data={switchData} initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});

	it('renders one checkbox with form control', async () => {
		await act(async () => {
			const rendered = render(<SwitchComponent data={[switchData[0]]} initialValues={initialValues} />);
			let elem;
			try {
				elem = rendered.getByText('Test');
				expect(true).toBeTruthy();
			} catch (e) {
				expect(elem).toBeFalsy();
			}
			expect(rendered).toMatchSnapshot();
		});
	});

	it('requires one switch', async () => {
		const message = 'something for testing';

		const validateSchema = makeValidate(
			Yup.object().shape({
				best: Yup.array().min(1, message),
			})
		);

		const rendered = render(
			<SwitchComponent data={switchData} validator={validateSchema} initialValues={initialValues} />
		);
		const input = rendered.getByDisplayValue('bar') as HTMLInputElement;

		expect(input.checked).toBeTruthy();
		fireEvent.click(input);
		fireEvent.blur(input);
		expect(input.checked).toBeFalsy();

		const error = await rendered.findByText(message); // validation is async, so we have to await
		expect(error.tagName).toBe('P');
		expect(error.innerHTML).toContain(message);

		expect(rendered).toMatchSnapshot();
	});

	it('renders without errors when the label is a HTML element', async () => {
		await act(async () => {
			const labelId = 'label-id';
			const rendered = render(
				<SwitchComponent
					data={{
						label: <div data-testid={labelId}>Can it have a HTML elment as label?</div>,
						value: 'Yes, it can',
					}}
				/>
			);
			const elem = rendered.getByTestId(labelId) as HTMLElement;
			expect(elem.tagName.toLocaleLowerCase()).toBe('div');
			expect(rendered).toMatchSnapshot();
		});
	});
});
