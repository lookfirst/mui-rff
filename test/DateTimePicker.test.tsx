import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';

import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button } from '@mui/material';
import { DateTimePicker } from '../src';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { act, customRender } from '../src/test/TestUtils';
import { fireEvent } from '../src/test/TestUtils';
import { makeValidate } from '../src';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date | null;
}

describe('DateTimePicker', () => {
	const defaultDateTimeValue = '2019-10-18 12:00 AM';

	const initialValues: FormData = {
		date: new Date(defaultDateTimeValue),
	};

	function DateTimePickerComponent({ initialValues, validator }: ComponentProps) {
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
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} noValidate>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker label="Test" name="date" required={true} inputFormat="yyyy-MM-dd h:mm a" />
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
		await act(async () => {
			const rendered = customRender(<DateTimePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<DateTimePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateTimeValue)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateTimeValue);
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(<DateTimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = customRender(<DateTimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});

	it('turns red if empty and required', async () => {
		const validateSchema = makeValidate(
			Yup.object().shape({
				date: Yup.date().required(),
			}),
		);

		const rendered = customRender(
			<DateTimePickerComponent initialValues={{ date: null }} validator={validateSchema} />,
		);

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		//const elem = (await findByText('Test')) as HTMLLegendElement;
		expect(rendered).toMatchSnapshot();
	});
});
