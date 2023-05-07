import { Button } from '@mui/material';
import React from 'react';

import * as Yup from 'yup';
import { Form } from 'react-final-form';

import 'date-fns';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, DatePickerProps, makeValidateSync } from '../src';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { fireEvent, render } from '@testing-library/react';

interface ComponentProps extends Omit<DatePickerProps, 'name'> {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date | null;
}

describe('DatePicker', () => {
	const defaultDateValue = '2019-10-18';
	const defaultDateString = `${defaultDateValue}T00:00:00`;

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function DatePickerComponent({ initialValues, validator, ...rest }: ComponentProps) {
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
							<DatePicker label="Test" name="date" required={true} format="yyyy-MM-dd" {...rest} />
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
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateValue)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateValue);
	});

	it('has the Test label', async () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', async () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
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

		const rendered = render(<DatePickerComponent initialValues={{ date: null }} validator={validateSchema} />);

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		//const elem = (await findByText('Test')) as HTMLLegendElement;
		expect(rendered).toMatchSnapshot();
	});

	it('renders as standard variant as well', async () => {
		const rendered = render(
			<DatePickerComponent initialValues={initialValues} textFieldProps={{ variant: 'standard' }} />,
		);

		expect(rendered.getByText('Test').classList.contains('MuiInputLabel-standard')).toBe(true);
	});
});
