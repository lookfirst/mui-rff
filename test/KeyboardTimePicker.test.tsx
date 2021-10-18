import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';

import { KeyboardTimePicker } from '../src';
import { act, customRender } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('KeyboardTimePicker', () => {
	const defaultDateString = '2019-10-18T16:20:00';

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function KeyboardTimePickerComponent({ initialValues, validator }: ComponentProps) {
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
						<KeyboardTimePicker label="Test" name="date" required={true} />
					</form>
				)}
			/>
		);
	}

	const originalWarn = console.warn.bind(this);
	beforeAll(() => {
		console.warn = (msg) => !msg.toString().includes('KeyboardTimePicker is deprecated') && originalWarn(msg);
	});

	afterAll(() => {
		console.warn = originalWarn;
	});

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue('04:20 pm')) as HTMLInputElement;
		expect(date.value).toBe('04:20 pm');
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});
});
