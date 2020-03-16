import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { KeyboardTimePicker } from '../src';
import { render, act } from './TestUtils';

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

	function KeyboardTimePickerComponent({ initialValues, validator }: ComponentProps) {
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
						<KeyboardTimePicker
							label="Test"
							name="date"
							required={true}
							dateFunsUtils={DateFnsUtils}
							margin="normal"
							variant="inline"
						/>
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = render(<KeyboardTimePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders without dateFunsUtils', async () => {
		await act(async () => {
			const rendered = render(
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Form onSubmit={() => {}} render={() => <KeyboardTimePicker value={defaultDateString} />} />
				</MuiPickersUtilsProvider>
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		await act(async () => {
			const rendered = render(<KeyboardTimePickerComponent initialValues={initialValues} />);
			const date = (await rendered.findByDisplayValue('04:20 PM')) as HTMLInputElement;
			expect(date.value).toBe('04:20 PM');
		});
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = render(<KeyboardTimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = render(<KeyboardTimePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});
});
