import React from 'react';

import { MenuItem } from '@material-ui/core';
import { Form } from 'react-final-form';

import { Select, SelectData } from '../src';
import { act, render } from './TestUtils';

describe('Select', () => {
	describe('basic component', () => {
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
							<Select label="Test" required={true} name="best" data={data} />
						</form>
					)}
				/>
			);
		}

		it('renders without errors', async () => {
			await act(async () => {
				const rendered = render(<SelectComponent data={selectData} initialValues={initialValues} />);
				expect(rendered).toMatchSnapshot();
			});
		});

		it('renders a selected item', async () => {
			const rendered = render(<SelectComponent data={selectData} initialValues={initialValues} />);

			const form = await rendered.findByRole('form');
			const input = form.getElementsByTagName('input').item(0) as HTMLInputElement;
			expect(input.value).toBe('bar');
		});

		it('has the Test label', async () => {
			await act(async () => {
				const rendered = render(<SelectComponent data={selectData} initialValues={initialValues} />);
				const elem = rendered.getByText('Test') as HTMLLegendElement;
				expect(elem.tagName).toBe('LABEL');
			});
		});

		it('has the required *', async () => {
			await act(async () => {
				const rendered = render(<SelectComponent data={selectData} initialValues={initialValues} />);
				const elem = rendered.getByText('*') as HTMLSpanElement;
				expect(elem.tagName).toBe('SPAN');
				expect(elem.innerHTML).toBe(' *');
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
						<form onSubmit={handleSubmit} noValidate>
							<Select label="Test" required={true} name="best">
								{data.map(item => (
									<MenuItem value={item.value} key={item.value}>
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
			const rendered = render(<SelectComponentMenuItem data={selectData} initialValues={initialValues} />);

			const form = await rendered.findByRole('form');
			const input = form.getElementsByTagName('input').item(0) as HTMLInputElement;
			expect(input.value).toBe('bar');

			expect(rendered).toMatchSnapshot();
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
				const rendered = render(
					<SelectComponent data={selectData} initialValues={initialValues} multiple={true} />
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
				const rendered = render(<SelectComponent data={selectData} initialValues={initialValues} />);
				expect(rendered).toMatchSnapshot();
			});
		});
	});
});
