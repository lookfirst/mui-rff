import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { KeyboardTimePicker } from '../src';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { customRender } from '../src/test/TestUtils';

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

	function KeyboardTimePickerComponent({ initialValues }: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit} noValidate>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<KeyboardTimePicker label="Test" name="date" required={true} />
						</LocalizationProvider>
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
		const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue('04:20 pm')) as HTMLInputElement;
		expect(date.value).toBe('04:20 pm');
	});

	it('has the Test label', async () => {
		const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', async () => {
		const rendered = customRender(<KeyboardTimePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});
});
