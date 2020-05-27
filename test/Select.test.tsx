import React from 'react';

import { Button, MenuItem } from '@material-ui/core';
import { Form } from 'react-final-form';

import { Select, SelectData, SelectProps } from '../src';
import { act, customRender, fireEvent } from './TestUtils';

describe('Select', () => {
	describe('basic component', () => {
		interface ComponentProps {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
			label: boolean;
			variant?: SelectProps['variant'];
		}

		interface FormData {
			best: string;
		}

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: 'bar',
		};

		function SelectComponent({ initialValues, data, validator, label, variant }: ComponentProps) {
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
						<form onSubmit={handleSubmit} noValidate data-testid="form">
							<Select
								label={label ? 'Test' : undefined}
								required={true}
								name="best"
								data={data}
								variant={variant}
								formControlProps={{ margin: 'normal' }}
							/>
						</form>
					)}
				/>
			);
		}

		it('renders without errors', async () => {
			await act(async () => {
				const rendered = customRender(
					<SelectComponent data={selectData} initialValues={initialValues} label={true} />,
				);
				expect(rendered).toMatchSnapshot();
			});
		});

		it('renders a selected item', async () => {
			const { findByTestId } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} label={true} />,
			);

			const form = await findByTestId('form');
			const input = form.getElementsByTagName('input').item(0) as HTMLInputElement;
			expect(input.value).toBe('bar');
		});

		it('has the Test label', async () => {
			await act(async () => {
				const rendered = customRender(
					<SelectComponent data={selectData} initialValues={initialValues} label={true} />,
				);
				const elem = rendered.getByText('Test') as HTMLLegendElement;
				expect(elem.tagName).toBe('LABEL');
			});
		});

		it('has the required *', async () => {
			await act(async () => {
				const rendered = customRender(
					<SelectComponent data={selectData} initialValues={initialValues} label={true} />,
				);
				const elem = rendered.getByText('*') as HTMLSpanElement;
				expect(elem.tagName).toBe('SPAN');
				expect(elem.innerHTML).toBe(' *');
			});
		});

		it('renders outlined', async () => {
			await act(async () => {
				const rendered = customRender(
					<SelectComponent data={selectData} initialValues={initialValues} variant="outlined" label={true} />,
				);
				expect(rendered).toMatchSnapshot();
			});
		});

		it('renders outlined without a label', async () => {
			await act(async () => {
				const rendered = customRender(
					<SelectComponent
						data={selectData}
						initialValues={initialValues}
						variant="outlined"
						label={false}
					/>,
				);
				expect(rendered).toMatchSnapshot();
			});
		});

		it('requires something selected', async () => {
			// const message = 'something for testing';
			//
			// const validateSchema = makeValidate(
			// 	Yup.object().shape({
			// 		best: Yup.string().required(message),
			// 	})
			// );
			//
			// const rendered = customRender(
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
		interface ComponentProps {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
		}

		interface FormData {
			best: string;
		}

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: 'bar',
		};

		function SelectComponentMenuItem({ initialValues, data, validator }: ComponentProps) {
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
						<form onSubmit={handleSubmit} noValidate data-testid="form">
							<Select label="Test" required={true} name="best">
								{data.map((item, idx) => (
									<MenuItem value={item.value} key={idx}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</form>
					)}
				/>
			);
		}

		it('renders using menu items', async () => {
			const { findByTestId, container } = customRender(
				<SelectComponentMenuItem data={selectData} initialValues={initialValues} />,
			);

			const form = await findByTestId('form');
			const input = form.getElementsByTagName('input').item(0) as HTMLInputElement;
			expect(input.value).toBe('bar');

			expect(container).toMatchSnapshot();
		});
	});

	describe('Multiple', () => {
		interface FormData {
			best: string[];
		}

		interface ComponentProps {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
			multiple?: boolean;
		}

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: ['bar', 'ack'],
		};

		function SelectComponent({ initialValues, data, validator, multiple }: ComponentProps) {
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
							<Select label="Test" required={true} name="best" data={data} multiple={multiple} />
						</form>
					)}
				/>
			);
		}

		it('has multiple', async () => {
			await act(async () => {
				const rendered = customRender(
					<SelectComponent data={selectData} initialValues={initialValues} multiple={true} />,
				);
				expect(rendered).toMatchSnapshot();
			});
		});
	});

	describe('displayEmpty', () => {
		interface ComponentProps {
			data: SelectData[];
			initialValues: FormData;
			validator?: any;
		}

		interface FormData {
			best: string[];
		}

		const selectData: SelectData[] = [
			{ label: 'Empty', value: '' },
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		const initialValues: FormData = {
			best: [''],
		};

		function SelectComponent({ initialValues, data, validator }: ComponentProps) {
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
							<Select label="Test" required={true} name="best" data={data} displayEmpty={true} />
						</form>
					)}
				/>
			);
		}

		it('renders without errors', async () => {
			await act(async () => {
				const rendered = customRender(<SelectComponent data={selectData} initialValues={initialValues} />);
				expect(rendered).toMatchSnapshot();
			});
		});
	});

	describe('errors with single', () => {
		interface ComponentProps {
			data: SelectData[];
			initialValues: FormData;
			onSubmit?: any;
		}

		interface FormData {
			best: string;
		}

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({ initialValues, data, onSubmit = () => {} }: ComponentProps) {
			const validate = async (values: FormData) => {
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
							<Select label="Test" required={true} name="best" helperText="omg helper text">
								{data.map((item, idx) => (
									<MenuItem value={item.value} key={idx}>
										{item.label}
									</MenuItem>
								))}
							</Select>
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

			const { findByTestId, findByText, container } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} />,
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

			const { findByTestId, findByText, container } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} />,
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

			const { findByTestId, findByText, container } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} onSubmit={onSubmit} />,
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});

	describe('errors with multiple', () => {
		interface ComponentProps {
			data: SelectData[];
			initialValues: FormData;
			onSubmit?: any;
		}

		interface FormData {
			best: string[];
		}

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({ initialValues, data, onSubmit = () => {} }: ComponentProps) {
			const validate = async (values: FormData) => {
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
							<Select
								label="Test"
								required={true}
								name="best"
								multiple={true}
								helperText="omg helper text"
							>
								{data.map((item, idx) => (
									<MenuItem value={item.value} key={idx}>
										{item.label}
									</MenuItem>
								))}
							</Select>
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
				best: [],
			};

			const { findByTestId, findByText, container } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} />,
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

			const { findByTestId, findByText, container } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} />,
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

			const { findByTestId, findByText, container } = customRender(
				<SelectComponent data={selectData} initialValues={initialValues} onSubmit={onSubmit} />,
			);
			const submit = await findByTestId('submit');
			fireEvent.click(submit);
			await findByText('submit error');
			expect(container).toMatchSnapshot();
		});
	});

	describe('works without initialValues', () => {
		interface ComponentProps {
			data: SelectData[];
			multiple: boolean;
		}

		const selectData: SelectData[] = [
			{ label: 'Ack', value: 'ack' },
			{ label: 'Bar', value: 'bar' },
			{ label: 'Foo', value: 'foo' },
		];

		function SelectComponent({ data, multiple }: ComponentProps) {
			return (
				<Form
					onSubmit={() => {}}
					initialValues={{}}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Select
								label="Test"
								required={true}
								name="best"
								multiple={multiple}
								helperText="omg helper text"
							>
								{data.map((item, idx) => (
									<MenuItem value={item.value} key={idx}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</form>
					)}
				/>
			);
		}

		it('renders multiple=true without error', async () => {
			const { container } = customRender(<SelectComponent data={selectData} multiple={true} />);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});

		it('renders multiple=false without error', async () => {
			const { container } = customRender(<SelectComponent data={selectData} multiple={false} />);

			// this snapshot won't have the helper text in it
			expect(container).toMatchSnapshot();
		});
	});
});
