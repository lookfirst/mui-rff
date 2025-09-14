import { Button } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it } from 'vitest';
import { array, object } from 'yup';

import { type CheckboxData, Checkboxes, makeValidateSync } from '../src';

type ComponentProps = {
	data: CheckboxData | CheckboxData[];
	initialValues?: FormData;
	validator?: any;
	onSubmit?: any;
};

type FormData = {
	best: string[];
};

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

		function CheckboxComponent({
			initialValues: initialVals,
			data,
			validator,
		}: ComponentProps) {
			// biome-ignore lint/suspicious/noEmptyBlockStatements: no big deal
			const onSubmit = () => {};

			return (
				<Form
					initialValues={initialVals}
					onSubmit={onSubmit}
					render={({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Checkboxes
								data={data}
								formControlProps={{ margin: 'normal' }}
								label="Test"
								name="best"
								required={true}
							/>
						</form>
					)}
					validate={validator}
				/>
			);
		}

		it('renders without errors', () => {
			const rendered = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
				/>
			);
			expect(rendered).toMatchSnapshot();
		});

		it('clicks on the first checkbox', () => {
			const rendered = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
				/>
			);
			const inputAck = rendered.getByDisplayValue(
				'ack'
			) as HTMLInputElement;
			expect(inputAck.checked).toBe(false);
			act(() => {
				fireEvent.click(inputAck);
			});
			expect(inputAck.checked).toBe(true);
			expect(rendered).toMatchSnapshot();
		});

		it('renders 3 items', () => {
			const rendered = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
				/>
			);
			const inputs = rendered.getAllByRole(
				'checkbox'
			) as HTMLInputElement[];
			expect(inputs.length).toBe(3);
			expect(inputs[0].checked).toBe(false);
			expect(inputs[1].checked).toBe(true);
			expect(inputs[2].checked).toBe(false);
		});

		it('has the Test label', () => {
			const rendered = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
				/>
			);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});

		it('has the required *', () => {
			const rendered = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
				/>
			);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});

		it('renders one checkbox with form control', () => {
			const rendered = render(
				<CheckboxComponent
					data={[checkboxData[0]]}
					initialValues={initialValues}
				/>
			);
			let elem: HTMLElement | null = null;
			try {
				elem = rendered.getByText('Test');
				expect(true).toBeTruthy();
			} catch {
				expect(elem).toBeFalsy();
			}
			expect(rendered).toMatchSnapshot();
		});

		it('shows error on blur with one required checkbox', async () => {
			const message = 'something for testing';

			const validateSchema = makeValidateSync(
				object().shape({
					best: array().min(1, message),
				})
			);

			const { getByDisplayValue, findByText, container } = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
					validator={validateSchema}
				/>
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
						label: (
							<div data-testid={labelId}>
								Can it have a HTML element as label?
							</div>
						),
						value: 'Yes, it can',
					}}
				/>
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
				/>
			);
			const inputs = rendered.getAllByRole(
				'checkbox'
			) as HTMLInputElement[];
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
				/>
			);
			const inputs = rendered.getAllByRole(
				'checkbox'
			) as HTMLInputElement[];
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

		function CheckboxComponent({
			initialValues,
			data,
			validator,
			// biome-ignore lint/suspicious/noEmptyBlockStatements: ok here
			onSubmit = () => {},
		}: ComponentProps) {
			return (
				<Form
					initialValues={initialValues}
					onSubmit={onSubmit}
					render={({ handleSubmit, submitting }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Checkboxes
								data={data}
								formControlProps={{ margin: 'normal' }}
								helperText="omg helper text"
								label="Test"
								name="best"
								required={true}
							/>
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
					subscription={{ submitting: true, pristine: true }}
					validate={validator}
				/>
			);
		}

		it('renders the helper text because no error', async () => {
			const initialValues: FormData = {
				best: ['bar'],
			};

			const { findByTestId, findByText, container } = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
				/>
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
				object().shape({
					best: array().min(1, message),
				})
			);

			const { findByTestId, findByText, container } = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
					validator={validateSchema}
				/>
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
				object().shape({
					best: array().min(1, message),
				})
			);

			const { findByTestId, findByText, container } = render(
				<CheckboxComponent
					data={checkboxData}
					initialValues={initialValues}
					onSubmit={onSubmit}
					validator={validateSchema}
				/>
			);

			const submit = await findByTestId('submit');
			await findByText('omg helper text');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});
});
