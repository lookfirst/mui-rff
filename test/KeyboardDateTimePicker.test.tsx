import React from 'react';

import { Form } from 'react-final-form';

import * as Yup from 'yup';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { KeyboardDateTimePicker, makeValidate } from '../src';
import { customRender, fireEvent, act } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('KeyboardDatePicker', () => {
	const defaultDateTimeValue = '2019-10-18 12:00 AM';

	const initialValues: FormData = {
		date: new Date(defaultDateTimeValue),
	};

	function KeyboardDatePickerComponent({ initialValues, validator }: ComponentProps) {
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
						<KeyboardDateTimePicker
							label="Test"
							name="date"
							required={true}
							dateFunsUtils={DateFnsUtils}
							margin="normal"
							variant="inline"
							format="yyyy-MM-dd h:mm a"
						/>
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders without dateFunsUtils', async () => {
		await act(async () => {
			const rendered = customRender(
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Form
						onSubmit={() => {}}
						render={() => <KeyboardDateTimePicker value={defaultDateTimeValue} format="yyyy-MM-dd" />}
					/>
				</MuiPickersUtilsProvider>,
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateTimeValue)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateTimeValue);
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});

	it('requires a date value', async () => {
		const message = 'something for testing';

		const validateSchema = makeValidate(
			Yup.object().shape({
				date: Yup.date().typeError(message),
			}),
		);

		const rendered = customRender(
			<KeyboardDatePickerComponent initialValues={initialValues} validator={validateSchema} />,
		);
		const input = (await rendered.getByRole('textbox')) as HTMLInputElement;

		expect(input.value).toBeDefined();
		fireEvent.change(input, { target: { value: '' } });
		expect(input.value).toBeFalsy();
		fireEvent.blur(input); // validation doesn't happen until we blur from the element

		const error = await rendered.findByText(message); // validation is async, so we have to await
		expect(error.tagName).toBe('P');

		expect(rendered).toMatchSnapshot();
	});
});
