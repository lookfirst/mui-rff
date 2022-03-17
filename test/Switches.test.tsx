import { Button } from '@mui/material';
import React from 'react';

import * as Yup from 'yup';
import { Form } from 'react-final-form';

import { SwitchData, Switches, makeValidate } from '../src';
import { act, customRender, fireEvent } from '../src/test/TestUtils';

interface ComponentProps {
	data: SwitchData | SwitchData[];
	initialValues?: FormData;
	validator?: any;
	onSubmit?: any;
}

interface FormData {
	best: string[];
}

describe('Switches', () => {
	describe('basic component', () => {
		const switchData: SwitchData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: ['bar'],
		};

		function SwitchComponent({ initialValues, data, validator }: ComponentProps) {
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
							<Switches
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

		it('renders without errors', async () => {
			await act(async () => {
				const rendered = customRender(<SwitchComponent data={switchData} initialValues={initialValues} />);
				expect(rendered).toMatchSnapshot();
			});
		});

		it('clicks on the first switch', async () => {
			const rendered = customRender(<SwitchComponent data={switchData} initialValues={initialValues} />);
			const inputAck = rendered.getByDisplayValue('ack') as HTMLInputElement;
			expect(inputAck.checked).toBe(false);
			await act(async () => {
				fireEvent.click(inputAck);
			});
			expect(inputAck.checked).toBe(true);
			expect(rendered).toMatchSnapshot();
		});

		it('renders 3 items', async () => {
			await act(async () => {
				const rendered = customRender(<SwitchComponent data={switchData} initialValues={initialValues} />);
				const inputs = rendered.getAllByRole('checkbox') as HTMLInputElement[];
				expect(inputs.length).toBe(3);
				expect(inputs[0].checked).toBe(false);
				expect(inputs[1].checked).toBe(true);
				expect(inputs[2].checked).toBe(false);
			});
		});

		it('has the Test label', async () => {
			await act(async () => {
				const rendered = customRender(<SwitchComponent data={switchData} initialValues={initialValues} />);
				const elem = rendered.getByText('Test') as HTMLLegendElement;
				expect(elem.tagName).toBe('LABEL');
			});
		});

		it('has the required *', async () => {
			await act(async () => {
				const rendered = customRender(<SwitchComponent data={switchData} initialValues={initialValues} />);
				const elem = rendered.getByText('*') as HTMLSpanElement;
				expect(elem.tagName).toBe('SPAN');
				expect(elem.innerHTML).toBe(' *');
			});
		});

		it('renders one checkbox with form control', async () => {
			await act(async () => {
				const rendered = customRender(<SwitchComponent data={[switchData[0]]} initialValues={initialValues} />);
				let elem;
				try {
					elem = rendered.getByText('Test');
					expect(true).toBeTruthy();
				} catch (e) {
					expect(elem).toBeFalsy();
				}
				expect(rendered).toMatchSnapshot();
			});
		});

		it('requires one switch', async () => {
			const message = 'something for testing';

			const validateSchema = makeValidate(
				Yup.object().shape({
					best: Yup.array().min(1, message),
				}),
			);

			const rendered = customRender(
				<SwitchComponent data={switchData} validator={validateSchema} initialValues={initialValues} />,
			);
			const input = rendered.getByDisplayValue('bar') as HTMLInputElement;

			expect(input.checked).toBeTruthy();
			fireEvent.click(input);
			fireEvent.blur(input);
			expect(input.checked).toBeFalsy();

			const error = await rendered.findByText(message); // validation is async, so we have to await
			expect(error.tagName).toBe('P');
			expect(error.innerHTML).toContain(message);

			expect(rendered).toMatchSnapshot();
		});

		it('renders without errors when the label is a HTML element', async () => {
			await act(async () => {
				const labelId = 'label-id';
				const rendered = customRender(
					<SwitchComponent
						data={{
							label: <div data-testid={labelId}>Can it have a HTML elment as label?</div>,
							value: 'Yes, it can',
						}}
					/>,
				);
				const elem = rendered.getByTestId(labelId) as HTMLElement;
				expect(elem.tagName.toLocaleLowerCase()).toBe('div');
				expect(rendered).toMatchSnapshot();
			});
		});

		it('has mui switches disabled', async () => {
			await act(async () => {
				const rendered = customRender(
					<SwitchComponent
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
		});
	});

	describe('submit button tests', () => {
		const switchData: SwitchData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SwitchesComponent({ initialValues, data, validator, onSubmit = () => {} }: ComponentProps) {
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
					subscription={{ submitting: true, pristine: true }}
					render={({ handleSubmit, submitting }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Switches
								label="Test"
								required={true}
								name="best"
								data={data}
								helperText="omg helper text"
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

			const { findByTestId, findByText, container } = customRender(
				<SwitchesComponent data={switchData} initialValues={initialValues} />,
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

			const validateSchema = makeValidate(
				Yup.object().shape({
					best: Yup.array().min(1, message),
				}),
			);

			const { findByTestId, findByText, container } = customRender(
				<SwitchesComponent data={switchData} initialValues={initialValues} validator={validateSchema} />,
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

			const validateSchema = makeValidate(
				Yup.object().shape({
					best: Yup.array().min(1, message),
				}),
			);

			const { findByTestId, findByText, container } = customRender(
				<SwitchesComponent
					data={switchData}
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
