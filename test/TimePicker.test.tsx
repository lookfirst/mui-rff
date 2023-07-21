import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';

import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '../src';
import { fireEvent, render } from '@testing-library/react';
import { makeValidateSync } from '../src';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date | null;
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

		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={validator}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} noValidate>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker label="Test" name="date" required={true} />
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
		const rendered = render(<TimePickerComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(<TimePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue('04:20 PM')) as HTMLInputElement;
		expect(date.value).toBe('04:20 PM');
	});

	it('has the Test label', async () => {
		const rendered = render(<TimePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', async () => {
		const rendered = render(<TimePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});

	it('turns red if empty and required', async () => {
		const validateSchema = makeValidateSync(
			Yup.object().shape({
				date: Yup.date().required(),
			}),
		);

		const rendered = render(<TimePickerComponent initialValues={{ date: null }} validator={validateSchema} />);

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		//const elem = (await findByText('Test')) as HTMLLegendElement;
		expect(rendered).toMatchSnapshot();
	});
});
