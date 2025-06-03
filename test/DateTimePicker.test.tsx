import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';

import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '../src';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { act, fireEvent, render } from '@testing-library/react';
import { makeValidateSync } from '../src';

interface ComponentProps extends Omit<DateTimePickerProps, 'name'> {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date | null;
}

describe('DateTimePicker', () => {
	const defaultDateValue = '2019-10-18';
	const defaultDateString = `${defaultDateValue}T00:00:00`;
	const defaultDateTimeValue = `10/18/2019 12:00 AM`;

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function DateTimePickerComponent({ initialValues, validator, ...rest }: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={validator}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} noValidate>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker label="Test" name="date" required={true} {...rest} />
						</LocalizationProvider>

						<Button
							variant="contained"
							color="primary"
							type="submit"
							disabled={submitting}
							data-testid="submit"
						>
							Submit
						</Button>
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		const rendered = render(<DateTimePickerComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(<DateTimePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateTimeValue)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateTimeValue);
	});

	it('has the Test label', async () => {
		const rendered = render(<DateTimePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('Test');
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', async () => {
		const rendered = render(<DateTimePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});

	it('turns red if empty and required', async () => {
		jest.useFakeTimers();

		const validateSchema = makeValidateSync(
			Yup.object().shape({
				date: Yup.date().required(),
			}),
		);

		const rendered = render(<DateTimePickerComponent initialValues={{ date: null }} validator={validateSchema} />);

		act(() => {
			jest.runAllTimers();
		});

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		expect(rendered).toMatchSnapshot();
	});

	it('renders as standard variant as well', async () => {
		const rendered = render(
			<DateTimePickerComponent initialValues={initialValues} textFieldProps={{ variant: 'standard' }} />,
		);

		expect(rendered.getByText('Test').classList.contains('MuiInputLabel-standard')).toBe(true);
	});

	it('renders the action bar with the "Today" button', async () => {
		const rendered = render(
			<DateTimePickerComponent
				initialValues={initialValues}
				slotProps={{
					actionBar: {
						actions: ['today'],
					},
				}}
			/>,
		);

		const input = rendered.getByTestId('CalendarIcon');
		fireEvent.click(input);

		const todayButton = await rendered.findByText('Today');
		expect(todayButton).toMatchSnapshot();
	});
});
