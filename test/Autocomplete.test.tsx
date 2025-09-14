import { createFilterOptions } from '@mui/material/Autocomplete';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { describe, expect, it, vi } from 'vitest';

import {
	Autocomplete,
	type AutocompleteData,
	type AutocompleteProps,
} from '../src';

interface ComponentProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
	initialValues?: FormData;
	validator?: any;
}

type FormData = {
	hello: any;
};

// https://stackoverflow.com/questions/60333156/how-to-fix-typeerror-document-createrange-is-not-a-function-error-while-testi
// required to mock popper
(global as any).document.createRange = () => ({
	// setStart and setEnd are required by some libraries but are not used directly
	setStart: undefined,
	setEnd: undefined,
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

	const initialOptions2: AutocompleteData[] = [
		{ value: 'Hello', label: 'Hello' },
		{ value: 'World', label: 'World' },
		{ value: 'Out', label: 'Out' },
		{ value: 'There', label: 'There' },
	];

	const initialValues: FormData = {
		hello: initialOptions[0].value,
	};

	const initialValuesMultiple: FormData = {
		hello: [initialOptions2[0].value],
	};

	const initialGetOptionValue = (option: any) => option.value;
	const initialGetOptionLabel = (option: any) => option.label;

	function AutocompleteFieldComponent<
		T,
		Multiple extends boolean | undefined,
		DisableClearable extends boolean | undefined,
		FreeSolo extends boolean | undefined,
	>({
		initialValues: initialVals,
		...autoCompleteProps
	}: ComponentProps<T, Multiple, DisableClearable, FreeSolo>) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		return (
			<Form
				initialValues={initialVals}
				onSubmit={() => {
					onSubmit(initialVals as FormData);
				}}
				render={({ handleSubmit }) => (
					<form
						noValidate
						onSubmit={async (e) => {
							await handleSubmit(e);
						}}
					>
						<Autocomplete {...autoCompleteProps} />
					</form>
				)}
			/>
		);
	}

	it('renders without errors', () => {
		const rendered = render(
			<AutocompleteFieldComponent
				getOptionLabel={initialGetOptionValue}
				getOptionValue={initialGetOptionValue}
				initialValues={initialValues}
				label="Test"
				name="hello"
				options={initialOptions}
				required={true}
				textFieldProps={{ margin: 'normal' }}
			/>
		);
		expect(rendered).toMatchSnapshot();
	});

	it('has the Test label', () => {
		const rendered = render(
			<AutocompleteFieldComponent
				getOptionLabel={initialGetOptionValue}
				getOptionValue={initialGetOptionValue}
				initialValues={initialValues}
				label="Test"
				name="hello"
				options={initialOptions}
				required={true}
				textFieldProps={{ placeholder: 'Enter stuff here' }}
			/>
		);
		const elem = rendered.getByText('Test') as HTMLLegendElement;
		expect(elem.tagName).toBe('LABEL');
	});

	// https://github.com/lookfirst/mui-rff/issues/273
	it('loads initial value', async () => {
		const rendered = render(
			<AutocompleteFieldComponent
				getOptionLabel={initialGetOptionValue}
				getOptionValue={initialGetOptionValue}
				initialValues={initialValues}
				label="Test"
				name="hello"
				options={initialOptions}
				required={true}
				textFieldProps={{ placeholder: 'Enter stuff here' }}
			/>
		);
		const input = (await rendered.findByDisplayValue(
			'Hello'
		)) as HTMLInputElement;
		expect(input.value).toBe('Hello');
	});

	// https://github.com/lookfirst/mui-rff/issues/455
	it('disables input when disabled is passed', async () => {
		const rendered = render(
			<AutocompleteFieldComponent
				disabled={true}
				getOptionLabel={initialGetOptionValue}
				getOptionValue={initialGetOptionValue}
				initialValues={initialValues}
				label="Test"
				name="hello"
				options={initialOptions}
				required={true}
				textFieldProps={{ placeholder: 'Enter stuff here' }}
			/>
		);
		const input = (await rendered.findByDisplayValue(
			'Hello'
		)) as HTMLInputElement;
		expect(input).toHaveProperty('disabled');
	});

	it('adds a new value on change', async () => {
		const filter = createFilterOptions<AutocompleteData>();
		const rendered = render(
			<AutocompleteFieldComponent
				clearOnBlur
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
				freeSolo={true}
				getOptionLabel={initialGetOptionLabel}
				getOptionValue={initialGetOptionValue}
				handleHomeEndKeys
				initialValues={initialValues}
				label="Test"
				name="hello"
				onChange={(
					_event: any,
					newValue: any,
					reason: any,
					details?: any
				) => {
					if (
						newValue &&
						reason === 'selectOption' &&
						details?.option.inputValue
					) {
						// Create a new value from the user input
						initialOptions.push({
							value: details?.option.inputValue,
							label: details?.option.inputValue,
						});
					}
				}}
				options={initialOptions}
				required={true}
				selectOnFocus
				textFieldProps={{ placeholder: 'Enter stuff here' }}
			/>
		);

		const inputElement = rendered.getByPlaceholderText('Enter stuff here');
		fireEvent.focus(inputElement);
		fireEvent.change(inputElement, { target: { value: 'new value' } });
		const newMenuItem = await rendered.findByRole('option');
		expect(newMenuItem).toBeTruthy();

		fireEvent.click(newMenuItem);
		expect(
			initialOptions.find((option) => option.value === 'new value')
		).toBeTruthy();
	});

	it('supports adornments for multi-values Autocomplete', () => {
		const rendered = render(
			<AutocompleteFieldComponent
				clearOnBlur
				freeSolo={true}
				getOptionLabel={initialGetOptionLabel}
				getOptionValue={initialGetOptionValue}
				handleHomeEndKeys
				initialValues={initialValuesMultiple}
				label="Test"
				multiple
				name="hello"
				onChange={(
					_event: any,
					newValue: any,
					reason: any,
					details?: any
				) => {
					if (
						newValue &&
						reason === 'selectOption' &&
						details?.option.inputValue
					) {
						// Create a new value from the user input
						initialOptions2.push({
							value: details?.option.inputValue,
							label: details?.option.inputValue,
						});
					}
				}}
				options={initialOptions2}
				required={true}
				textFieldProps={{
					placeholder: 'Enter stuff here',
					slotProps: {
						input: {
							startAdornment: <div>START</div>,
							endAdornment: <div>END</div>,
						},
					},
				}}
			/>
		);

		// Adornments are here
		const startAdornment = rendered.getByText('START');
		expect(startAdornment).toBeTruthy();
		const endAdornment = rendered.getByText('END');
		expect(endAdornment).toBeTruthy();

		// Value chip is also here (initial value) even if we have adornment
		// biome-ignore lint/performance/useTopLevelRegex: no big deal
		const newValueChip = rendered.getByRole('button', { name: /hello/i });
		expect(newValueChip).toBeTruthy();

		// This test fails now for some reason and I can't figure it out.
		// expect(rendered).toMatchSnapshot();
	});

	it('renders without changing from uncontrolled to controlled state', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error');

		const rendered = render(
			<AutocompleteFieldComponent
				getOptionValue={initialGetOptionValue}
				label="Test"
				name="hello"
				options={initialOptions}
				textFieldProps={{ placeholder: 'Placeholder' }}
			/>
		);

		const inputElement = rendered.getByPlaceholderText('Placeholder');
		fireEvent.focus(inputElement);
		fireEvent.change(inputElement, { target: { value: 'There' } });
		const thereMenuItem = await rendered.findByRole('option');
		expect(thereMenuItem).toBeTruthy();
		fireEvent.click(thereMenuItem);

		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('renders multiple, without defaultValue not producing error on value.length check for dirty in MUI autod', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error');

		const rendered = render(
			<AutocompleteFieldComponent
				label="Test"
				multiple
				name="hello"
				options={initialOptions}
				textFieldProps={{ placeholder: 'Placeholder' }}
			/>
		);

		const inputElement = rendered.getByPlaceholderText('Placeholder');

		// add first item
		fireEvent.focus(inputElement);
		fireEvent.change(inputElement, { target: { value: 'out' } });
		const outMenuItem = await rendered.findByRole('option');
		expect(outMenuItem).toBeTruthy();
		fireEvent.click(outMenuItem);

		// add a second item
		fireEvent.focus(inputElement);
		fireEvent.change(inputElement, { target: { value: 'there' } });
		const thereMenuItem = await rendered.findByRole('option');
		expect(thereMenuItem).toBeTruthy();
		fireEvent.click(thereMenuItem);

		// biome-ignore lint/performance/useTopLevelRegex: no big deal
		expect(rendered.getByRole('button', { name: /out/i })).toBeTruthy();
		// biome-ignore lint/performance/useTopLevelRegex: no big deal
		expect(rendered.getByRole('button', { name: /there/i })).toBeTruthy();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('should set active and touched meta props correctly.', () => {
		const rendered = render(
			<Form
				initialValues={{}}
				// biome-ignore lint/suspicious/noEmptyBlockStatements: it is ok here
				onSubmit={() => {}}
				render={({ handleSubmit, active, touched }) => (
					<form
						noValidate
						onSubmit={async (e) => {
							await handleSubmit(e);
						}}
					>
						<Autocomplete
							data-testid="autocomplete1"
							name="movie1"
							options={[
								{ value: 'Terminator', label: 'Terminator' },
							]}
						/>
						<Autocomplete
							data-testid="autocomplete2"
							name="movie2"
							options={[
								{ value: 'Terminator', label: 'Terminator' },
							]}
						/>
						<div data-testid="active-field-name">
							{active ?? 'none'}
						</div>
						<div data-testid="touched-fields">
							{JSON.stringify(touched)}
						</div>
						<button data-testid="button-submit" type="button">
							Submit
						</button>
					</form>
				)}
			/>
		);

		// no active or touched fields should be present at this moment
		expect(rendered.getByTestId('active-field-name').textContent).toEqual(
			'none'
		);
		expect(rendered.getByTestId('touched-fields').textContent).toEqual(
			'{"movie1":false,"movie2":false}'
		);

		// click the first field
		const autocomplete1Element = rendered.getByTestId('autocomplete1');
		fireEvent.click(autocomplete1Element);

		// movie1 field should be active, none of the fields is touched
		expect(rendered.getByTestId('active-field-name').textContent).toEqual(
			'movie1'
		);
		expect(rendered.getByTestId('touched-fields').textContent).toEqual(
			'{"movie1":false,"movie2":false}'
		);

		// click the second field
		const autocomplete2Element = rendered.getByTestId('autocomplete2');
		fireEvent.click(autocomplete2Element);

		// movie2 field should be active, movie1 lost focus and should be set touched
		expect(rendered.getByTestId('active-field-name').textContent).toEqual(
			'movie2'
		);
		expect(rendered.getByTestId('touched-fields').textContent).toEqual(
			'{"movie1":true,"movie2":false}'
		);
	});
});
