import { Autocomplete, AutocompleteData, AutocompleteProps } from '../src';
import { Form } from 'react-final-form';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

interface ComponentProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
	initialValues?: FormData;
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
		{ value: 'World', label: 'World' },
		{ value: 'Out', label: 'Out' },
		{ value: 'There', label: 'There' },
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
	>({ initialValues, ...autoCompleteProps }: ComponentProps<T, Multiple, DisableClearable, FreeSolo>) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit} noValidate>
						<Autocomplete {...autoCompleteProps} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		const rendered = render(
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

	it('has the Test label', async () => {
		const rendered = render(
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

	// https://github.com/lookfirst/mui-rff/issues/273
	it('loads initial value', async () => {
		const rendered = render(
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

	// https://github.com/lookfirst/mui-rff/issues/455
	it('disables input when disabled is passed', async () => {
		const rendered = render(
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

	it('adds a new value on change', async () => {
		const filter = createFilterOptions<AutocompleteData>();
		const rendered = render(
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
					if (newValue && reason === 'selectOption' && details?.option.inputValue) {
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

	it('supports adornments for multi-values Autocomplete', async () => {
		const rendered = render(
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
					if (newValue && reason === 'selectOption' && details?.option.inputValue) {
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

	it('renders without changing from uncontrolled to controlled state', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error');

		const rendered = render(
			<AutocompleteFieldComponent
				name="hello"
				label="Test"
				placeholder="Placeholder"
				options={initialOptions}
				getOptionValue={initialGetOptionValue}
			/>,
		);

		const inputElement = rendered.getByPlaceholderText('Placeholder');
		await fireEvent.focus(inputElement);
		await fireEvent.change(inputElement, { target: { value: 'There' } });
		const thereMenuItem = await rendered.findByRole('option');
		expect(thereMenuItem).toBeTruthy();
		await fireEvent.click(thereMenuItem);

		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('renders multiple, without defaultValue not producing error on value.length check for dirty in MUI autod', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error');

		const rendered = render(
			<AutocompleteFieldComponent
				multiple
				name="hello"
				label="Test"
				placeholder="Placeholder"
				options={initialOptions}
			/>,
		);

		const inputElement = rendered.getByPlaceholderText('Placeholder');

		// add first item
		await fireEvent.focus(inputElement);
		await fireEvent.change(inputElement, { target: { value: 'out' } });
		const outMenuItem = await rendered.findByRole('option');
		expect(outMenuItem).toBeTruthy();
		await fireEvent.click(outMenuItem);

		// add second item
		await fireEvent.focus(inputElement);
		await fireEvent.change(inputElement, { target: { value: 'there' } });
		const thereMenuItem = await rendered.findByRole('option');
		expect(thereMenuItem).toBeTruthy();
		await fireEvent.click(thereMenuItem);

		expect(rendered.getByRole('button', { name: /out/i })).toBeTruthy();
		expect(rendered.getByRole('button', { name: /there/i })).toBeTruthy();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('should set active and touched meta props correctly.', async () => {
		const rendered = render(
			<Form
				onSubmit={() => {}}
				initialValues={{}}
				render={({ handleSubmit, active, touched }) => (
					<form onSubmit={handleSubmit} noValidate>
						<Autocomplete
							data-testid="autocomplete1"
							name="movie1"
							options={[{ value: 'Terminator', label: 'Terminator' }]}
						/>
						<Autocomplete
							data-testid="autocomplete2"
							name="movie2"
							options={[{ value: 'Terminator', label: 'Terminator' }]}
						/>
						<div data-testid="active-field-name">{active ?? 'none'}</div>
						<div data-testid="touched-fields">{JSON.stringify(touched)}</div>
						<button data-testid="button-submit">Submit</button>
					</form>
				)}
			/>,
		);

		// no active or touched fields should be present at this moment
		expect(rendered.getByTestId('active-field-name').textContent).toEqual('none');
		expect(rendered.getByTestId('touched-fields').textContent).toEqual('{"movie1":false,"movie2":false}');

		// click first field
		const autocomplete1Element = rendered.getByTestId('autocomplete1');
		await fireEvent.click(autocomplete1Element);

		// movie1 field should be active, none of fields is touched
		expect(rendered.getByTestId('active-field-name').textContent).toEqual('movie1');
		expect(rendered.getByTestId('touched-fields').textContent).toEqual('{"movie1":false,"movie2":false}');

		// click second field
		const autocomplete2Element = rendered.getByTestId('autocomplete2');
		await fireEvent.click(autocomplete2Element);

		// movie2 field should be active, movie1 lost focus and should be set touched
		expect(rendered.getByTestId('active-field-name').textContent).toEqual('movie2');
		expect(rendered.getByTestId('touched-fields').textContent).toEqual('{"movie1":true,"movie2":false}');
	});
});
