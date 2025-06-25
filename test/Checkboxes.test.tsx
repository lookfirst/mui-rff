import { Button } from '@mui/material';
import { describe, expect, it } from 'vitest';

import * as Yup from 'yup';
import { Form } from 'react-final-form';

import { CheckboxData, Checkboxes, makeValidateSync } from '../src';
import { act, fireEvent, render } from '@testing-library/react';

interface ComponentProps {
	data: CheckboxData | CheckboxData[];
	initialValues?: FormData;
	validator?: any;
	onSubmit?: any;
}

interface FormData {
	best: string[];
}

describe('Checkboxes', () => {
	describe('basic component', () => {
		const checkboxData: CheckboxData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: ['bar'],
		};

		function CheckboxComponent({ initialValues, data, validator }: ComponentProps) {
			const onSubmit = () => {};

			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validator}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Checkboxes
								label="Test"
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
			const rendered = render(<CheckboxComponent data={checkboxData} initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});

		it('clicks on the first checkbox', () => {
			const rendered = render(<CheckboxComponent data={checkboxData} initialValues={initialValues} />);
			const inputAck = rendered.getByDisplayValue('ack') as HTMLInputElement;
			expect(inputAck.checked).toBe(false);
			act(() => {
				fireEvent.click(inputAck);
			});
			expect(inputAck.checked).toBe(true);
			expect(rendered).toMatchSnapshot();
		});

		it('renders 3 items', () => {
			const rendered = render(<CheckboxComponent data={checkboxData} initialValues={initialValues} />);
			const inputs = rendered.getAllByRole('checkbox') as HTMLInputElement[];
			expect(inputs.length).toBe(3);
			expect(inputs[0].checked).toBe(false);
			expect(inputs[1].checked).toBe(true);
			expect(inputs[2].checked).toBe(false);
		});

		it('has the Test label', () => {
			const rendered = render(<CheckboxComponent data={checkboxData} initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});

		it('has the required *', () => {
			const rendered = render(<CheckboxComponent data={checkboxData} initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});

		it('renders one checkbox with form control', () => {
			const rendered = render(<CheckboxComponent data={[checkboxData[0]]} initialValues={initialValues} />);
			let elem;
			try {
				elem = rendered.getByText('Test');
				expect(true).toBeTruthy();
			} catch (e) {
				expect(elem).toBeFalsy();
			}
			expect(rendered).toMatchSnapshot();
		});

		it('shows error on blur with one required checkbox', async () => {
			const message = 'something for testing';

			const validateSchema = makeValidateSync(
				Yup.object().shape({
					best: Yup.array().min(1, message),
				}),
			);

			const { getByDisplayValue, findByText, container } = render(
				<CheckboxComponent data={checkboxData} validator={validateSchema} initialValues={initialValues} />,
			);
			const input = getByDisplayValue('bar') as HTMLInputElement;

			expect(input.checked).toBeTruthy();
			fireEvent.click(input);
			fireEvent.blur(input);
			expect(input.checked).toBeFalsy();

			const error = await findByText(message); // validation is async, so we have to await
			expect(error.tagName).toBe('P');
			expect(error.innerHTML).toContain(message);

			expect(container).toMatchSnapshot();
		});

		it('renders without errors when the label is a HTML element', () => {
			const labelId = 'label-id';
			const rendered = render(
				<CheckboxComponent
					data={{
						label: <div data-testid={labelId}>Can it have a HTML elment as label?</div>,
						value: 'Yes, it can',
					}}
				/>,
			);
			const elem = rendered.getByTestId(labelId);
			expect(elem.tagName.toLocaleLowerCase()).toBe('div');
			expect(rendered).toMatchSnapshot();
		});

		it('has mui checkboxes disabled', () => {
			const rendered = render(
				<CheckboxComponent
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
			const inputs = rendered.getAllByRole('checkbox') as HTMLInputElement[];
			expect(inputs.length).toBe(2);
			expect(inputs[0].disabled).toBe(true);
			expect(inputs[1].disabled).toBe(false);
		});

		it('has mui checkbox with indeterminate flag settings', () => {
			const rendered = render(
				<CheckboxComponent
					data={[
						{
							label: 'Bar',
							value: 'bar',
							indeterminate: true,
						},
						{
							label: 'Foo',
							value: 'foo',
							indeterminate: false,
						},
						{
							label: 'Another',
							value: 'another',
						},
					]}
					initialValues={initialValues}
				/>,
			);
			const inputs = rendered.getAllByRole('checkbox') as HTMLInputElement[];
			expect(inputs.length).toBe(3);
			expect(inputs[0].getAttribute('data-indeterminate')).toBe('true');
			expect(inputs[1].getAttribute('data-indeterminate')).toBe('false');
			expect(inputs[2].getAttribute('data-indeterminate')).toBe('false');
		});
	});

	describe('submit button tests', () => {
		const checkboxData: CheckboxData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function CheckboxComponent({ initialValues, data, validator, onSubmit = () => {} }: ComponentProps) {
			return (
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					validate={validator}
					subscription={{ submitting: true, pristine: true }}
					render={({ handleSubmit, submitting }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Checkboxes
								label="Test"
								required={true}
								name="best"
								data={data}
								helperText="omg helper text"
								formControlProps={{ margin: 'normal' }}
							/>
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
				best: ['bar'],
			};

			const { findByTestId, findByText, container } = render(
				<CheckboxComponent data={checkboxData} initialValues={initialValues} />,
			);
			await findByText('omg helper text');

			const submit = await findByTestId('submit');
			fireEvent.click(submit);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('submit shows validation error', async () => {
			const message = 'is not best';

			const initialValues: FormData = {
				best: [],
			};

			const validateSchema = makeValidateSync(
				Yup.object().shape({
					best: Yup.array().min(1, message),
				}),
			);

			const { findByTestId, findByText, container } = render(
				<CheckboxComponent data={checkboxData} initialValues={initialValues} validator={validateSchema} />,
			);

			const submit = await findByTestId('submit');
			await findByText('omg helper text');
			fireEvent.click(submit);
			await findByText(message);
			expect(container).toMatchSnapshot();
		});

		it('submit shows submit error', async () => {
			const message = 'is not best';

			const onSubmit = () => {
				return { best: 'submit error' };
			};

			const initialValues: FormData = {
				best: ['ack'],
			};

			const validateSchema = makeValidateSync(
				Yup.object().shape({
					best: Yup.array().min(1, message),
				}),
			);

			const { findByTestId, findByText, container } = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
					validator={validateSchema}
					onSubmit={onSubmit}
				/>,
			);

			const submit = await findByTestId('submit');
			await findByText('omg helper text');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});
});
