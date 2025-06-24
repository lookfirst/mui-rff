import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	default as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
} from '@mui/material/Autocomplete';
import { AutocompleteValue, UseAutocompleteProps as MuiUseAutocompleteProps } from '@mui/material/useAutocomplete';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { ShowErrorFunc, showErrorOnChange } from './Util';
import React from 'react';
import TextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type AutocompleteData = {
	[key: string]: any | null;
};

export interface AutocompleteProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
> extends Omit<
		MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> &
			MuiUseAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
		'renderInput'
	> {
	name: string;
	label?: React.ReactNode;
	helperText?: React.ReactNode;
	required?: boolean;
	getOptionValue?: (option: T) => any;
	options: T[];
	fieldProps?: Partial<FieldProps<any, any>>;
	textFieldProps?: Partial<MuiTextFieldProps>;
	showError?: ShowErrorFunc;
}

export function Autocomplete<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
>(props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>): JSX.Element {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <AutocompleteWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface AutocompleteWrapperProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
	label: string | number | React.ReactElement;
	required?: boolean;
	textFieldProps?: Partial<MuiTextFieldProps>;
	getOptionValue?: (option: T) => any;
}

function AutocompleteWrapper<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
>(
	props: AutocompleteWrapperProps<T, Multiple, DisableClearable, FreeSolo> & FieldRenderProps<MuiTextFieldProps>,
): JSX.Element {
	const {
		input: { name, value, onChange, onFocus, onBlur },
		meta,
		options,
		label,
		required,
		multiple,
		textFieldProps,
		getOptionValue,
		showError = showErrorOnChange,
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
	const {
		variant,
		onFocus: textFieldPropsFocus,
		onBlur: textFieldPropsBlur,
		...restTextFieldProps
	} = textFieldProps || {};

	let defaultValue: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo> | undefined;

	if (!getOptionValue) {
		defaultValue = value as AutocompleteValue<T, Multiple, DisableClearable, FreeSolo> | undefined;
	} else if (value) {
		options.forEach((option) => {
			const optionValue = getOptionValue(option);
			if (multiple) {
				if (!defaultValue) {
					defaultValue = [] as any;
				}
				(value as any).forEach((v: any) => {
					if (v === optionValue) {
						(defaultValue as any).push(option);
					}
				});
			} else {
				if (value === optionValue) {
					defaultValue = option as any;
				}
			}
		});
	}

	const onChangeFunc = (
		event: React.SyntheticEvent,
		value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
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
			value={
				(defaultValue || (multiple ? [] : null)) as AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
			}
			renderInput={(params) => (
				<TextField
					label={label}
					required={required}
					helperText={isError ? error || submitError : helperText}
					error={isError}
					name={name}
					variant={variant}
					onFocus={(e) => {
						textFieldPropsFocus?.(e);
						onFocus(e);
					}}
					onBlur={(e) => {
						textFieldPropsBlur?.(e);
						onBlur(e);
					}}
					{...params}
					{...restTextFieldProps}
					InputProps={{
						...params.InputProps,
						...restTextFieldProps.InputProps,
						...(restTextFieldProps.InputProps?.startAdornment && {
							startAdornment: (
								<>
									{restTextFieldProps.InputProps.startAdornment}
									{params.InputProps?.startAdornment}
								</>
							),
						}),
						...(restTextFieldProps.InputProps?.endAdornment && {
							endAdornment: (
								<>
									{params.InputProps?.endAdornment}
									{restTextFieldProps.InputProps?.endAdornment}
								</>
							),
						}),
					}}
					fullWidth={true}
				/>
			)}
			{...lessrest}
		/>
	);
}
