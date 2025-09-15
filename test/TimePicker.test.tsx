import { Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it } from 'vitest';
import 'date-fns';
import { date, object } from 'yup';

import { makeValidateSync, TimePicker } from '../src';

type ComponentProps = {
	initialValues: FormData;
	validator?: any;
};

type FormData = {
	date: Date | null;
};

describe('TimePicker', () => {
	const defaultDateString = '2019-10-18T16:20:00';

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function TimePickerComponent({
		initialValues: initialVals,
		validator,
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
							<TimePicker
								label="Test"
								name="date"
								required={true}
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
			<TimePickerComponent initialValues={initialValues} />
		);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(
			<TimePickerComponent initialValues={initialValues} />
		);
		const dateValue = (await rendered.findByDisplayValue(
			'04:20 PM'
		)) as HTMLInputElement;
		expect(dateValue.value).toBe('04:20 PM');
	});

	it('has the Test label', () => {
		const rendered = render(
			<TimePickerComponent initialValues={initialValues} />
		);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', () => {
		const rendered = render(
			<TimePickerComponent initialValues={initialValues} />
		);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});

	it('turns red if empty and required', async () => {
		const validateSchema = makeValidateSync(
			object().shape({
				date: date().required(),
			})
		);

		const rendered = render(
			<TimePickerComponent
				initialValues={{ date: null }}
				validator={validateSchema}
			/>
		);

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		//const elem = (await findByText('Test')) as HTMLLegendElement;
		expect(rendered).toMatchSnapshot();
	});
});
