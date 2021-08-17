import { Autocomplete, AutocompleteData, AutocompleteProps } from '../src';
import { Form } from 'react-final-form';
import { act, customRender } from './TestUtils';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { fireEvent } from '@testing-library/react';
import React from 'react';

interface ComponentProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	hello: any;
}

// https://stackoverflow.com/questions/60333156/how-to-fix-typeerror-document-createrange-is-not-a-function-error-while-testi
// required to mock popper
(global as any).document.createRange = () => ({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setStart: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setEnd: () => {},
	commonAncestorContainer: {
		nodeName: 'BODY',
		ownerDocument: document,
	},
});

describe('Autocomplete', () => {
	const initialOptions: AutocompleteData[] = [
		{ value: 'Hello', label: 'Hello' },
		{ value: 'World', label: 'Hello' },
	];

	const initialValues: FormData = {
		hello: initialOptions[0].value,
	};

	const initialValuesMultiple: FormData = {
		hello: [initialOptions[0].value],
	};

	const initialGetOptionValue = (option: any) => option.value;
	const initialGetOptionLabel = (option: any) => option.label;

	function AutocompleteFieldComponent<
		T,
		Multiple extends boolean | undefined,
		DisableClearable extends boolean | undefined,
		FreeSolo extends boolean | undefined,
	>({ initialValues, validator, ...autoCompleteProps }: ComponentProps<T, Multiple, DisableClearable, FreeSolo>) {
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
						<Autocomplete {...autoCompleteProps} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					name="hello"
					label="Test"
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionValue}
					textFieldProps={{ margin: 'normal' }}
					required={true}
				/>,
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					name="hello"
					label="Test"
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionValue}
					required={true}
				/>,
			);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	// https://github.com/lookfirst/mui-rff/issues/273
	it('loads initial value', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					name="hello"
					label="Test"
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionValue}
					required={true}
				/>,
			);
			const input = (await rendered.findByDisplayValue('Hello')) as HTMLInputElement;
			expect(input.value).toBe('Hello');
		});
	});

	// https://github.com/lookfirst/mui-rff/issues/455
	it('disables input when disabled is passed', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					name="hello"
					label="Test"
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionValue}
					required={true}
					disabled={true}
				/>,
			);
			const input = (await rendered.findByDisplayValue('Hello')) as HTMLInputElement;
			expect(input).toHaveProperty('disabled');
		});
	});

	it('adds a new value on change', async () => {
		await act(async () => {
			const filter = createFilterOptions<AutocompleteData>();
			const rendered = customRender(
				<AutocompleteFieldComponent
					name="hello"
					label="Test"
					placeholder="Enter stuff here"
					initialValues={initialValues}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionLabel}
					freeSolo={true}
					onChange={(_event: any, newValue: any, reason: any, details?: any) => {
						if (newValue && reason === 'select-option' && details?.option.inputValue) {
							// Create a new value from the user input
							initialOptions.push({
								value: details?.option.inputValue,
								label: details?.option.inputValue,
							});
						}
					}}
					filterOptions={(options, params) => {
						const filtered = filter(options, params);

						// Suggest the creation of a new value
						if (params.inputValue !== '') {
							filtered.push({
								inputValue: params.inputValue,
								label: `Add "${params.inputValue}"`,
								value: params.inputValue,
							});
						}

						return filtered;
					}}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					required={true}
				/>,
			);

			const inputElement = rendered.getByPlaceholderText('Enter stuff here');
			await fireEvent.focus(inputElement);
			await fireEvent.change(inputElement, { target: { value: 'new value' } });
			const newMenuItem = await rendered.findByRole('option');
			expect(newMenuItem).toBeTruthy();

			await fireEvent.click(newMenuItem);
			expect(initialOptions.find((option) => option.value === 'new value')).toBeTruthy();
		});
	});

	it('supports adornments for multi-values Autocomplete', async () => {
		await act(async () => {
			const rendered = customRender(
				<AutocompleteFieldComponent
					multiple
					name="hello"
					label="Test"
					placeholder="Enter stuff here"
					initialValues={initialValuesMultiple}
					options={initialOptions}
					getOptionValue={initialGetOptionValue}
					getOptionLabel={initialGetOptionLabel}
					freeSolo={true}
					onChange={(_event: any, newValue: any, reason: any, details?: any) => {
						if (newValue && reason === 'select-option' && details?.option.inputValue) {
							// Create a new value from the user input
							initialOptions.push({
								value: details?.option.inputValue,
								label: details?.option.inputValue,
							});
						}
					}}
					textFieldProps={{
						InputProps: {
							startAdornment: <div>START</div>,
							endAdornment: <div>END</div>,
						},
					}}
					clearOnBlur
					handleHomeEndKeys
					required={true}
				/>,
			);

			// Adornments are here
			const startAdornment = rendered.getByText('START');
			expect(startAdornment).toBeTruthy();
			const endAdornment = rendered.getByText('END');
			expect(endAdornment).toBeTruthy();

			// Value chip is also here (initial value) even if we have adornments
			const newValueChip = rendered.getByRole('button', { name: /hello/i });
			expect(newValueChip).toBeTruthy();

			expect(rendered).toMatchSnapshot();
		});
	});
});
