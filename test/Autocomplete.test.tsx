import React from 'react';

import { Form } from 'react-final-form';

import { Autocomplete, AutocompleteData } from '../src';
import { customRender, act } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
	textFieldProps?: any;
	options: AutocompleteData[];
	getOptionValue: (option: any) => any;
	getOptionLabel: (option: any) => any;
}

interface FormData {
	hello: any;
}

describe('Autocomplete', () => {
	const initialOptions: AutocompleteData[] = [{ value: 'Hello' }, { value: 'World' }];

	const initialValues: FormData = {
		hello: initialOptions[0].value,
	};

	const initialGetOptionValue = (option: any) => option.value;

	function AutocompleteFieldComponent({
		initialValues,
		validator,
		textFieldProps,
		options,
		getOptionLabel,
		getOptionValue,
	}: ComponentProps) {
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
						<Autocomplete
							label="Test"
							name="hello"
							required={true}
							textFieldProps={textFieldProps}
							options={options}
							getOptionValue={getOptionValue}
							getOptionLabel={getOptionLabel}
						/>
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionValue}
					textFieldProps={{ margin: 'normal' }}
				/>
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionValue}
				/>
			);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});
});
