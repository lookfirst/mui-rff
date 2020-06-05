import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import { Autocomplete, AutocompleteData, AutocompleteProps } from '../src';
import { act, customRender } from './TestUtils';

interface ComponentProps<T> extends AutocompleteProps<T> {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	hello: any;
}

// https://stackoverflow.com/questions/60333156/how-to-fix-typeerror-document-createrange-is-not-a-function-error-while-testi
// required to mock popper
(global as any).document.createRange = () => ({
	setStart: () => {},
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

	const initialGetOptionValue = (option: any) => option.value;
	const initialGetOptionLabel = (option: any) => option.label;

	function AutocompleteFieldComponent<T>({ initialValues, validator, ...autoCompleteProps }: ComponentProps<T>) {
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
			expect(initialOptions.find(option => option.value === 'new value')).toBeTruthy();
		});
	});
});
