import React, { ChangeEvent, ReactNode } from 'react';

import { Field, FieldRenderProps, FieldProps } from 'react-final-form';

import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import {
	default as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
	RenderInputParams as MuiAutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';

export type AutocompleteData = {
	[key: string]: any;
};

export interface AutocompleteProps extends Partial<MuiAutocompleteProps<any>> {
	name: string;
	label: ReactNode;
	helperText?: string;
	required?: boolean;
	multiple?: boolean;
	getOptionValue?: (option: any) => any;
	options: AutocompleteData[];
	fieldProps?: Partial<FieldProps<any, any>>;
	textFieldProps?: Partial<MuiTextFieldProps>;
}

export const Autocomplete = (props: AutocompleteProps) => {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={fieldRenderProps => <AutocompleteWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
};

interface AutocompleteWrapperProps extends FieldRenderProps<MuiTextFieldProps, HTMLElement> {
	label: ReactNode;
	required?: boolean;
	multiple?: boolean;
	textFieldProps?: Partial<MuiTextFieldProps>;
	getOptionValue?: (option: any) => any;
}

const AutocompleteWrapper = (props: AutocompleteWrapperProps) => {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		options,
		label,
		required,
		multiple,
		textFieldProps,
		getOptionValue,
		...rest
	} = props;

	function getValue(values: any) {
		if (!getOptionValue) {
			return values;
		}

		// ternary hell...
		return multiple
			? values
				? values.map(getOptionValue)
				: undefined
			: values
			? getOptionValue(values)
			: undefined;
	}

	const { helperText, ...lessrest } = rest;
	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
	const { variant, ...restTextFieldProps } = (textFieldProps as any) || {};

	// yuck...
	let defaultValue: any = undefined;

	if (!getOptionValue) {
		defaultValue = value;
	} else if (value !== undefined && value !== null) {
		options.forEach((option: any) => {
			const optionValue = getOptionValue(option);
			if (multiple) {
				if (!defaultValue) defaultValue = [];
				(value as any).forEach((v: any) => {
					if (v === optionValue) {
						defaultValue.push(option);
					}
				});
			} else {
				if (value === optionValue) {
					defaultValue = option;
				}
			}
		});
	}

	const onChangeFunc = (_e: ChangeEvent<{}>, values: any | any[] | null) => onChange(getValue(values));

	return (
		<MuiAutocomplete
			multiple={multiple as any}
			onChange={onChangeFunc}
			options={options}
			value={defaultValue}
			renderInput={(params: MuiAutocompleteRenderInputParams) => (
				<TextField
					label={label}
					required={required}
					fullWidth={true}
					error={showError}
					helperText={showError ? meta.error || meta.submitError : helperText}
					variant={variant}
					{...params}
					{...restInput}
					{...restTextFieldProps}
				/>
			)}
			{...lessrest}
		/>
	);
};
