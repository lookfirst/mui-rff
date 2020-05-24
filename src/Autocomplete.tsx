import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	AutocompleteProps as MuiAutocompleteProps,
	default as MuiAutocomplete,
	RenderInputParams as MuiAutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import React, { ReactNode } from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { showError } from './Util';

export type AutocompleteData = {
	[key: string]: any | null;
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
		onChange: onChangeCallback,
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

	const onChangeFunc = (
		event: React.ChangeEvent<{}>,
		value: any | any[],
		reason: AutocompleteChangeReason,
		details?: AutocompleteChangeDetails<any>,
	) => {
		const gotValue = getValue(value);
		onChange(gotValue);

		if (onChangeCallback) {
			onChangeCallback(event, value, reason, details);
		}
	};

	const { error, submitError } = meta;
	const isError = showError({ meta });

	return (
		<MuiAutocomplete
			multiple={multiple}
			onChange={onChangeFunc}
			options={options}
			value={defaultValue}
			renderInput={(params: MuiAutocompleteRenderInputParams) => {
				return (
					<TextField
						label={label}
						required={required}
						fullWidth={true}
						helperText={isError ? error || submitError : helperText}
						error={isError}
						name={name}
						variant={variant}
						inputProps={{ required, ...restInput }}
						{...params}
						{...restTextFieldProps}
					/>
				);
			}}
			{...lessrest}

			// TODO: Need to figure out how to get this to work...
			// <TextFieldWrapper
			// 	name={name}
			// 	input={props.input}
			// 	meta={meta}
			// 	label={label}
			// 	required={required}
			// 	helperText={helperText}
			// 	{...params}
			// 	InputLabelProps={{ shrink: false }}
			// 	{...textFieldProps}
			// />
			// {...rest}
		/>
	);
};
