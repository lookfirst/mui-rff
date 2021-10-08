import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { TimePicker } from '../src';
import { act, customRender } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('TimePicker', () => {
	const defaultDateString = '2019-10-18T16:20:00';

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function TimePickerComponent({ initialValues, validator }: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		const validate = async (values: FormData) => {
			if (validator) {
				return validator(values);
			}
		};

		return (
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validate}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<TimePicker
								label="Test"
								name="date"
								// required={true}
								// margin="normal"
							/>
						</form>
					)}
				/>
			</LocalizationProvider>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(<TimePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders without dateFunsUtils', async () => {
		await act(async () => {
			const rendered = customRender(
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form
						onSubmit={() => {
							expect(true).toBeTruthy();
						}}
						render={() => <TimePicker name="some_name" value={defaultDateString} />}
					/>
				</LocalizationProvider>,
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<TimePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue('04:20 PM')) as HTMLInputElement;
		expect(date.value).toBe('04:20 PM');
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(<TimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = customRender(<TimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});
});
