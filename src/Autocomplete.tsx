import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	default as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
} from '@material-ui/lab/Autocomplete';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { UseAutocompleteProps as MuiUseAutocompleteProps, Value } from '@material-ui/lab/useAutocomplete';
import { ShowErrorFunc, showErrorOnChange } from './Util';
import React, { ReactNode } from 'react';
import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';

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
	label: ReactNode;
	helperText?: string;
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
	label: ReactNode;
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
	props: AutocompleteWrapperProps<T, Multiple, DisableClearable, FreeSolo> &
		FieldRenderProps<MuiTextFieldProps, HTMLElement>,
): JSX.Element {
	const {
		input: { name, value, onChange },
		meta,
		options,
		label,
		required,
		multiple,
		textFieldProps,
		getOptionValue,
		showError = showErrorOnChange,
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
	const { variant, ...restTextFieldProps } = textFieldProps || {};

	// yuck...
	let defaultValue: Value<T, Multiple, DisableClearable, FreeSolo> | undefined;

	if (!getOptionValue) {
		defaultValue = value as Value<T, Multiple, DisableClearable, FreeSolo> | undefined;
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
		// eslint-disable-next-line @typescript-eslint/ban-types
		event: React.ChangeEvent<{}>,
		value: Value<T, Multiple, DisableClearable, FreeSolo>,
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
			renderInput={(params) => (
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
