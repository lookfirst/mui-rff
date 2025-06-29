import { Button } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it } from 'vitest';
import * as Yup from 'yup';

import { RadioData, Radios, makeValidateSync } from '../src';

interface ComponentProps {
	data: RadioData[];
	initialValues: FormData;
	validator?: any;
	hideLabel?: boolean;
	onSubmit?: any;
}

interface FormData {
	best: string;
}

describe('Radios', () => {
	describe('basic component', () => {
		const radioData: RadioData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: 'bar',
		};

		function RadioComponent({ initialValues, data, validator, hideLabel }: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			const label = hideLabel ? undefined : 'Test';

			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validator}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate data-testid="form">
							<Radios
								label={label}
								required={true}
								name="best"
								data={data}
								formControlProps={{ margin: 'normal' }}
							/>
						</form>
					)}
				/>
			);
		}

		it('renders without errors', () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});

		it('clicks on the first radio', () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const input = rendered.getByDisplayValue('ack') as HTMLInputElement;
			expect(input.checked).toBeFalsy();
			act(() => {
				fireEvent.click(input);
			});
			expect(input.checked).toBeTruthy();
			expect(rendered).toMatchSnapshot();
		});

		it('renders 3 items', () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const inputs = rendered.getAllByRole('radio') as HTMLInputElement[];
			expect(inputs.length).toBe(3);
			expect(inputs[0].checked).toBe(false);
			expect(inputs[1].checked).toBe(true);
			expect(inputs[2].checked).toBe(false);
		});

		it('has the Test label', () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});

		it('does not render label element', () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} hideLabel={true} />);
			const elem = rendered.queryByText('Test');
			expect(elem).toBeNull();
			expect(rendered).toMatchSnapshot();
		});

		it('has the required *', () => {
			const rendered = render(<RadioComponent data={radioData} initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});

		it('requires one radio', async () => {
			const message = 'something for testing';

			const validateSchema = makeValidateSync(
				Yup.object().shape({
					best: Yup.string().required(message),
				}),
			);

			const { findByTestId, getByDisplayValue, findByText, container } = render(
				<RadioComponent data={radioData} validator={validateSchema} initialValues={{ best: '' }} />,
			);

			const form = await findByTestId('form');

			const inputBar = getByDisplayValue('bar') as HTMLInputElement;
			const inputAck = getByDisplayValue('ack') as HTMLInputElement;
			const inputFoo = getByDisplayValue('foo') as HTMLInputElement;

			expect(inputBar.checked).toBeFalsy();
			expect(inputAck.checked).toBeFalsy();
			expect(inputFoo.checked).toBeFalsy();
			fireEvent.submit(form);
			expect(inputBar.checked).toBeFalsy();
			expect(inputAck.checked).toBeFalsy();
			expect(inputFoo.checked).toBeFalsy();

			const errorText = await findByText(message); // validation is async, so we have to await
			expect(errorText.tagName).toBe('P');
			expect(errorText.innerHTML).toContain(message);

			expect(container).toMatchSnapshot();
		});

		it('has mui radios disabled', () => {
			const rendered = render(
				<RadioComponent
					data={[
						{
							label: 'Bar',
							value: 'bar',
							disabled: true,
						},
						{
							label: 'Foo',
							value: 'foo',
							disabled: false,
						},
					]}
					initialValues={initialValues}
				/>,
			);
			const inputs = rendered.getAllByRole('radio') as HTMLInputElement[];
			expect(inputs.length).toBe(2);
			expect(inputs[0].disabled).toBe(true);
			expect(inputs[1].disabled).toBe(false);
		});
	});

	describe('errors on submit', () => {
		const radioData: RadioData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function RadioComponent({ initialValues, data, onSubmit = () => {} }: ComponentProps) {
			const validate = (values: FormData) => {
				if (!values.best.length) {
					return { best: 'is not best' };
				}
				return;
			};

			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validate}
					render={({ handleSubmit, submitting }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Radios required={true} name="best" data={data} helperText="omg helper text" />
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

		it('renders the helper text because no error', async () => {
			const initialValues: FormData = {
				best: '',
			};

			const { findByTestId, findByText, container } = render(
				<RadioComponent data={radioData} initialValues={initialValues} />,
			);
			await findByText('omg helper text');

			const submit = await findByTestId('submit');
			fireEvent.click(submit);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('submit shows validation error', async () => {
			const initialValues: FormData = {
				best: '',
			};

			const { findByTestId, findByText, container } = render(
				<RadioComponent data={radioData} initialValues={initialValues} />,
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('is not best');
			expect(container).toMatchSnapshot();
		});

		it('submit shows submit error', async () => {
			const onSubmit = () => {
				return { best: 'submit error' };
			};

			const initialValues: FormData = {
				best: 'ack',
			};

			const { findByTestId, findByText, container } = render(
				<RadioComponent data={radioData} initialValues={initialValues} onSubmit={onSubmit} />,
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});
});
