import { createGenerateClassName, StylesProvider } from '@material-ui/core/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import { DatePicker } from '../src';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('DatePicker', () => {
	const defaultDateString = '2019-10-18';

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function DatePickerComponent({ initialValues, validator }: ComponentProps) {
		// make a copy of the data because the state is mutated below in one of the tests for clicks
		// then the state is used again for comparison later, which causes tests to be dependent on execution
		// order and fail.
		const generateClassName = createGenerateClassName({
			disableGlobal: true,
			productionPrefix: 'test',
		});

		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		const validate = async (values: FormData) => {
			if (validator) {
				return validator(values);
			}
		};

		return (
			<StylesProvider generateClassName={generateClassName}>
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validate}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<DatePicker label="Test" name="date" required={true} dateFunsUtils={DateFnsUtils} />
						</form>
					)}
				/>
			</StylesProvider>
		);
	}

	it('renders without errors', () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('renders the value with default data', async () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateString)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateString);
	});

	it('has the Test label', () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	it('has the required *', () => {
		const rendered = render(<DatePickerComponent initialValues={initialValues} />);
		const elem = rendered.getByText('*') as HTMLSpanElement;
		expect(elem.tagName).toBe('SPAN');
		expect(elem.innerHTML).toBe(' *');
	});
});
