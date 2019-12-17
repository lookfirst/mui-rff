import React from 'react';

import { Form } from 'react-final-form';

import * as Yup from 'yup';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { KeyboardDatePicker, makeValidate } from '../src';
import { render, fireEvent, act } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('KeyboardDatePicker', () => {
	const defaultDateString = '2019-10-18';

	const initialValues: FormData = {
		date: new Date(defaultDateString),
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
						<KeyboardDatePicker label="Test" name="date" required={true} dateFunsUtils={DateFnsUtils} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = render(<KeyboardDatePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders without dateFunsUtils', async () => {
		await act(async () => {
			const rendered = render(
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Form onSubmit={() => {}} render={() => <KeyboardDatePicker value={defaultDateString} />} />
				</MuiPickersUtilsProvider>
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = render(<KeyboardDatePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateString)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateString);
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = render(<KeyboardDatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = render(<KeyboardDatePickerComponent initialValues={initialValues} />);
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
			})
		);

		const rendered = render(
			<KeyboardDatePickerComponent initialValues={initialValues} validator={validateSchema} />
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
