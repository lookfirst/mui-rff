import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	default as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
} from '@mui/material/Autocomplete';
import { InputBaseProps } from '@mui/material/InputBase';
import TextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { AutocompleteValue, UseAutocompleteProps as MuiUseAutocompleteProps } from '@mui/material/useAutocomplete';
import React, { JSX } from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';

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
>({
	name,
	fieldProps,
	showError = showErrorOnChange,
	...rest
}: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>): JSX.Element {
	return (
		<Field
			name={name}
			render={(fieldRenderProps) => (
				<AutocompleteWrapper fieldRenderProps={fieldRenderProps} showError={showError} {...rest} />
			)}
			{...fieldProps}
		/>
	);
}

interface AutocompleteWrapperProps<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'name'> {
	fieldRenderProps: FieldRenderProps;
	showError: ShowErrorFunc;
}

function AutocompleteWrapper<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
>(props: AutocompleteWrapperProps<T, Multiple, DisableClearable, FreeSolo>): JSX.Element {
	const {
		fieldRenderProps: {
			input: { name, value, onChange, onFocus, onBlur },
			meta,
		},
		options,
		label,
		required,
		multiple,
		textFieldProps,
		getOptionValue,
		showError,
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
				value.forEach((v: any) => {
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

	const restTextFieldInputProps: Partial<InputBaseProps> | undefined =
		typeof restTextFieldProps.slotProps?.input === 'object'
			? (restTextFieldProps.slotProps.input as Partial<InputBaseProps>)
			: undefined;

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
					slotProps={{
						input: {
							...params.InputProps,
							...restTextFieldInputProps,
							...(restTextFieldInputProps?.startAdornment && {
								startAdornment: (
									<>
										{restTextFieldInputProps.startAdornment}
										{params.InputProps?.startAdornment}
									</>
								),
							}),
							...(restTextFieldInputProps?.endAdornment && {
								endAdornment: (
									<>
										{params.InputProps?.endAdornment}
										{restTextFieldInputProps.endAdornment}
									</>
								),
							}),
						},
					}}
					fullWidth={true}
				/>
			)}
			{...lessrest}
		/>
	);
}
