import React, { ChangeEvent, ReactNode } from 'react';

import { Field, FieldRenderProps, FieldProps } from 'react-final-form';

import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import {
	default as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
	RenderInputParams as MuiAutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import { showError } from './Util';

export type AutocompleteData = {
	[key: string]: any | null;
};

export interface AutocompleteProps extends Partial<Omit<MuiAutocompleteProps<any>, 'onChange'>> {
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
		return multiple ? (values ? values.map(getOptionValue) : null) : values ? getOptionValue(values) : null;
	}

	const { helperText, ...lessrest } = rest;
	const { variant, ...restTextFieldProps } = (textFieldProps as any) || {};

	// yuck...
	let defaultValue: any = null;

	if (!getOptionValue) {
		defaultValue = value;
	} else if (value !== null) {
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

	const onChangeFunc = (_e: ChangeEvent<{}>, values: any | any[]) => onChange(getValue(values));

	return (
		<MuiAutocomplete
			multiple={multiple}
			onChange={onChangeFunc}
			options={options}
			value={defaultValue}
			renderInput={(params: MuiAutocompleteRenderInputParams) => (
				<TextField
					label={label}
					required={required}
					fullWidth={true}
					error={showError({ meta })}
					helperText={helperText}
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
