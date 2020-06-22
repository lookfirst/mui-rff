import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	AutocompleteProps as MuiAutocompleteProps,
	default as MuiAutocomplete,
} from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps as MuiUseAutocompleteProps } from '@material-ui/lab/useAutocomplete';
import React, { ReactNode } from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { showError } from './Util';

export type AutocompleteData = {
	[key: string]: any | null;
};

export interface AutocompleteProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined
>
	extends Omit<
		MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> &
			MuiUseAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
		'renderInput'
	> {
	name: string;
	label: ReactNode;
	helperText?: string;
	required?: boolean;
	getOptionValue?: (option: T) => any;
	options: T[];
	fieldProps?: Partial<FieldProps<any, any>>;
	textFieldProps?: Partial<MuiTextFieldProps>;
}

export function Autocomplete<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined
>(props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>): JSX.Element {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={fieldRenderProps => <AutocompleteWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface AutocompleteWrapperProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
	label: ReactNode;
	required?: boolean;
	textFieldProps?: Partial<MuiTextFieldProps>;
	getOptionValue?: (option: T) => any;
}

function AutocompleteWrapper<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined
>(
	props: AutocompleteWrapperProps<T, Multiple, DisableClearable, FreeSolo> &
		FieldRenderProps<MuiTextFieldProps, HTMLElement>,
): JSX.Element {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		options,
		label,
		required,
		multiple,
		textFieldProps,
		getOptionValue,
		placeholder,
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
		// eslint-disable-next-line @typescript-eslint/ban-types
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
			renderInput={params => (
				<TextField
					label={label}
					required={required}
					helperText={isError ? error || submitError : helperText}
					error={isError}
					name={name}
					placeholder={placeholder}
					variant={variant}
					{...params}
					{...restTextFieldProps}
					fullWidth={true}
					inputProps={{ required, ...restInput }}
				/>
			)}
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
}
