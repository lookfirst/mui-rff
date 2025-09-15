import { Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it, vi } from 'vitest';
import 'date-fns';
import { date, object } from 'yup';

import {
	DateTimePicker,
	type DateTimePickerProps,
	makeValidateSync,
} from '../src';

interface ComponentProps extends Omit<DateTimePickerProps, 'name'> {
	initialValues: FormData;
	validator?: any;
}

type FormData = {
	date: Date | null;
};

describe('DateTimePicker', () => {
	const defaultDateValue = '2019-10-18';
	const defaultDateString = `${defaultDateValue}T00:00:00`;
	const defaultDateTimeValue = '10/18/2019 12:00 AM';

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function DateTimePickerComponent({
		initialValues: initialVals,
		validator,
		...rest
	}: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		return (
			<Form
				initialValues={initialVals}
				onSubmit={onSubmit}
				render={({ handleSubmit, submitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label="Test"
								name="date"
								required={true}
								{...rest}
							/>
						</LocalizationProvider>

						<Button
							color="primary"
							data-testid="submit"
							disabled={submitting}
							type="submit"
							variant="contained"
						>
							Submit
						</Button>
					</form>
				)}
				validate={validator}
			/>
		);
	}

	it('renders without errors', () => {
		const rendered = render(
			<DateTimePickerComponent initialValues={initialValues} />
		);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(
			<DateTimePickerComponent initialValues={initialValues} />
		);
		const dateValue = (await rendered.findByDisplayValue(
			defaultDateTimeValue
		)) as HTMLInputElement;
		expect(dateValue.value).toBe(defaultDateTimeValue);
	});

	it('has the Test label', () => {
		const rendered = render(
			<DateTimePickerComponent initialValues={initialValues} />
		);
		const elem = rendered.getByText('Test');
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', () => {
		const rendered = render(
			<DateTimePickerComponent initialValues={initialValues} />
		);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});

	it('turns red if empty and required', async () => {
		vi.useRealTimers();

		const validateSchema = makeValidateSync(
			object().shape({
				date: date().required(),
			})
		);

		const rendered = render(
			<DateTimePickerComponent
				initialValues={{ date: null }}
				validator={validateSchema}
			/>
		);

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		expect(rendered).toMatchSnapshot();
	});

	it('renders as standard variant as well', () => {
		const rendered = render(
			<DateTimePickerComponent
				initialValues={initialValues}
				textFieldProps={{ variant: 'standard' }}
			/>
		);

		expect(
			rendered
				.getByText('Test')
				.classList.contains('MuiInputLabel-standard')
		).toBe(true);
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
			/>
		);

		const input = rendered.getByTestId('CalendarIcon');
		fireEvent.click(input);

		const todayButton = await rendered.findByText('Today');
		expect(todayButton).toMatchSnapshot();
	});
});
