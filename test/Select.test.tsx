import { Button, MenuItem } from '@mui/material';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it } from 'vitest';

import { Select, type SelectData, type SelectProps } from '../src';

describe('Select', () => {
	describe('basic component', () => {
		type ComponentProps = {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
			label: boolean;
			variant?: SelectProps['variant'];
		};

		type FormData = {
			best: string;
		};

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: 'bar',
		};

		function SelectComponent({
			initialValues: initialVals,
			data,
			validator,
			label,
			variant,
		}: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			return (
				<Form
					initialValues={initialVals}
					onSubmit={onSubmit}
					render={({ handleSubmit }) => (
						<form
							data-testid="form"
							noValidate
							onSubmit={handleSubmit}
						>
							<Select
								data={data}
								formControlProps={{ margin: 'normal' }}
								label={label ? 'Test' : undefined}
								name="best"
								required={true}
								variant={variant}
							/>
						</form>
					)}
					validate={validator}
				/>
			);
		}

		it('renders without errors', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					label={true}
				/>
			);
			expect(rendered).toMatchSnapshot();
		});

		it('renders a selected item', async () => {
			const { findByTestId } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					label={true}
				/>
			);

			const form = await findByTestId('form');
			const input = form
				.getElementsByTagName('input')
				.item(0) as HTMLInputElement;
			expect(input.value).toBe('bar');
		});

		it('has the Test label', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					label={true}
				/>
			);
			const elem = rendered.getAllByText('Test')[0] as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});

		it('has the required *', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					label={true}
				/>
			);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});

		it('renders outlined', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					label={true}
					variant="outlined"
				/>
			);
			expect(rendered).toMatchSnapshot();
		});

		it('renders outlined without a label', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					label={false}
					variant="outlined"
				/>
			);
			expect(rendered).toMatchSnapshot();
		});

		it.todo('requires something selected', async () => {
			// const message = 'something for testing';
			//
			// const validateSchema = makeValidate(
			// 	object().shape({
			// 		best: string().required(message),
			// 	})
			// );
			//
			// const rendered = render(
			// 	<SelectComponent
			// 		data={selectData}
			// 		validator={validateSchema}
			// 		initialValues={initialValues}
			// 	/>
			// );
			// TODO: write this test...
		});
	});

	describe('MenuItem component', () => {
		type ComponentProps = {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
		};

		type FormData = {
			best: string;
		};

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: 'bar',
		};

		function SelectComponentMenuItem({
			initialValues: initialVals,
			data,
			validator,
		}: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			return (
				<Form
					initialValues={initialVals}
					onSubmit={onSubmit}
					render={({ handleSubmit }) => (
						<form
							data-testid="form"
							noValidate
							onSubmit={handleSubmit}
						>
							<Select label="Test" name="best" required={true}>
								{data.map((item) => (
									<MenuItem
										key={`${item.value}${item.label}`}
										value={item.value}
									>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</form>
					)}
					validate={validator}
				/>
			);
		}

		it('renders using menu items', async () => {
			const { findByTestId, container } = render(
				<SelectComponentMenuItem
					data={selectData}
					initialValues={initialValues}
				/>
			);

			const form = await findByTestId('form');
			const input = form
				.getElementsByTagName('input')
				.item(0) as HTMLInputElement;
			expect(input.value).toBe('bar');

			expect(container).toMatchSnapshot();
		});
	});

	describe('Multiple', () => {
		type FormData = {
			best: string[];
		};

		type ComponentProps = {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
			multiple?: boolean;
		};

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: ['bar', 'ack'],
		};

		function SelectComponent({
			initialValues: initialVals,
			data,
			validator,
			multiple,
		}: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			return (
				<Form
					initialValues={initialVals}
					onSubmit={onSubmit}
					render={({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Select
								data={data}
								label="Test"
								multiple={multiple}
								name="best"
								required={true}
							/>
						</form>
					)}
					validate={validator}
				/>
			);
		}

		it('has multiple', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					multiple={true}
				/>
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	describe('displayEmpty', () => {
		type ComponentProps = {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
		};

		type FormData = {
			best: string[];
		};

		const selectData: SelectData[] = [
			{ label: 'Empty', value: '' },
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: [''],
		};

		function SelectComponent({
			initialValues: initialVals,
			data,
			validator,
		}: ComponentProps) {
			const onSubmit = (values: FormData) => {
				console.log(values);
			};

			const validate = (values: FormData) => {
				if (validator) {
					return validator(values);
				}
			};

			return (
				<Form
					initialValues={initialVals}
					onSubmit={onSubmit}
					render={({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Select
								data={data}
								displayEmpty={true}
								label="Test"
								name="best"
								required={true}
							/>
						</form>
					)}
					validate={validate}
				/>
			);
		}

		it('renders without errors', () => {
			const rendered = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
				/>
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	describe('errors with single', () => {
		type ComponentProps = {
			data: SelectData[];
			initialValues: FormData;
			onSubmit?: any;
		};

		type FormData = {
			best: string;
		};

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({
			initialValues,
			data,
			// biome-ignore lint/suspicious/noEmptyBlockStatements: it is ok
			onSubmit = () => {},
		}: ComponentProps) {
			const validate = (values: FormData) => {
				if (!values.best.length) {
					return { best: 'is not best' };
				}
				return;
			};

			return (
				<Form
					initialValues={initialValues}
					onSubmit={onSubmit}
					render={({ handleSubmit, submitting }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Select
								helperText="omg helper text"
								label="Test"
								name="best"
								required={true}
							>
								{data.map((item) => (
									<MenuItem
										key={`${item.value}${item.label}`}
										value={item.value}
									>
										{item.label}
									</MenuItem>
								))}
							</Select>
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
					validate={validate}
				/>
			);
		}

		it('renders the helper text because no error', async () => {
			const initialValues: FormData = {
				best: '',
			};

			const { findByTestId, findByText, container } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
				/>
			);
			await findByText('omg helper text');

			const submit = await findByTestId('submit');
			fireEvent.click(submit);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('has empty initialValues and submit', async () => {
			const initialValues: FormData = {
				best: '',
			};

			const { findByTestId, findByText, container } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
				/>
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('is not best');
			expect(container).toMatchSnapshot();
		});

		it('shows submit error', async () => {
			const onSubmit = () => {
				return { best: 'submit error' };
			};

			const initialValues: FormData = {
				best: 'ack',
			};

			const { findByTestId, findByText, container } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					onSubmit={onSubmit}
				/>
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});

	describe('errors with multiple', () => {
		type ComponentProps = {
			data: SelectData[];
			initialValues: FormData;
			onSubmit?: any;
		};

		type FormData = {
			best: string[];
		};

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({
			initialValues,
			data,
			// biome-ignore lint/suspicious/noEmptyBlockStatements: it is ok
			onSubmit = () => {},
		}: ComponentProps) {
			const validate = (values: FormData) => {
				if (!values.best.length) {
					return { best: 'is not best' };
				}
				return;
			};

			return (
				<Form
					initialValues={initialValues}
					onSubmit={onSubmit}
					render={({ handleSubmit, submitting }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Select
								helperText="omg helper text"
								label="Test"
								multiple={true}
								name="best"
								required={true}
							>
								{data.map((item) => (
									<MenuItem
										key={`${item.value}${item.label}`}
										value={item.value}
									>
										{item.label}
									</MenuItem>
								))}
							</Select>
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
					validate={validate}
				/>
			);
		}

		it('renders the helper text because no error', async () => {
			const initialValues: FormData = {
				best: [],
			};

			const { findByTestId, findByText, container } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
				/>
			);
			await findByText('omg helper text');

			const submit = await findByTestId('submit');
			fireEvent.click(submit);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('has empty initialValues and submit', async () => {
			const initialValues: FormData = {
				best: [],
			};

			const { findByTestId, findByText, container } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
				/>
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('is not best');
			expect(container).toMatchSnapshot();
		});

		it('shows submit error', async () => {
			const onSubmit = () => {
				return { best: 'submit error' };
			};

			const initialValues: FormData = {
				best: ['ack'],
			};

			const { findByTestId, findByText, container } = render(
				<SelectComponent
					data={selectData}
					initialValues={initialValues}
					onSubmit={onSubmit}
				/>
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});

	describe('works without initialValues', () => {
		type ComponentProps = {
			data: SelectData[];
			multiple: boolean;
		};

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({ data, multiple }: ComponentProps) {
			return (
				<Form
					initialValues={{}}
					// biome-ignore lint/suspicious/noEmptyBlockStatements: does not matter
					onSubmit={() => {}}
					render={({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Select
								helperText="omg helper text"
								label="Test"
								multiple={multiple}
								name="best"
								required={true}
							>
								{data.map((item) => (
									<MenuItem
										key={`${item.value}${item.label}`}
										value={item.value}
									>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</form>
					)}
				/>
			);
		}

		it('renders multiple=true without error', () => {
			const { container } = render(
				<SelectComponent data={selectData} multiple={true} />
			);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('renders multiple=false without error', () => {
			const { container } = render(
				<SelectComponent data={selectData} multiple={false} />
			);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});
	});

	describe('supports correct types issue: #367', () => {
		type MyThing = {
			label: string;
			value: string;
		};

		type ComponentProps = {
			data: MyThing[];
			multiple: boolean;
		};

		const selectData: MyThing[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({ data, multiple }: ComponentProps) {
			return (
				<Form
					initialValues={{}}
					// biome-ignore lint/suspicious/noEmptyBlockStatements: it is ok
					onSubmit={() => {}}
					render={({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Select
								helperText="omg helper text"
								label="Test"
								multiple={multiple}
								name="best"
								required={true}
							>
								{data.map((item) => (
									<MenuItem
										key={`${item.value}${item.label}`}
										value={item.value}
									>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</form>
					)}
				/>
			);
		}

		it('renders multiple=true without error', () => {
			const { container } = render(
				<SelectComponent data={selectData} multiple={true} />
			);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('renders multiple=false without error', () => {
			const { container } = render(
				<SelectComponent data={selectData} multiple={false} />
			);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});
	});
});
