import {
	type AutocompleteChangeDetails,
	type AutocompleteChangeReason,
	default as MuiAutocomplete,
	type AutocompleteProps as MuiAutocompleteProps,
} from '@mui/material/Autocomplete';
import type { InputBaseProps } from '@mui/material/InputBase';
import TextField, {
	type TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';
import type {
	AutocompleteValue,
	UseAutocompleteProps as MuiUseAutocompleteProps,
} from '@mui/material/useAutocomplete';
import type React from 'react';
import type { JSX } from 'react';
import {
	Field,
	type FieldProps,
	type FieldRenderProps,
} from 'react-final-form';

import { type ShowErrorFunc, showErrorOnChange } from './Util';

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
				<AutocompleteWrapper
					fieldRenderProps={fieldRenderProps}
					showError={showError}
					{...rest}
				/>
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
> extends Omit<
		AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
		'name'
	> {
	fieldRenderProps: FieldRenderProps;
	showError: ShowErrorFunc;
}

function AutocompleteWrapper<
	T,
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
	FreeSolo extends boolean | undefined,
>(
	props: AutocompleteWrapperProps<T, Multiple, DisableClearable, FreeSolo>
): JSX.Element {
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
		return multiple
			? // biome-ignore lint/style/noNestedTernary: ternary hell!
				values
				? values.map(getOptionValue)
				: null
			: values
				? getOptionValue(values)
				: null;
	}

	const { helperText, ...lessrest } = rest;
	const {
		variant,
		onFocus: textFieldPropsFocus,
		onBlur: textFieldPropsBlur,
		...restTextFieldProps
	} = textFieldProps || {};

	let defaultValue:
		| AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
		| undefined;

	if (!getOptionValue) {
		defaultValue = value as
			| AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
			| undefined;
	} else if (value) {
		for (const option of options) {
			const optionValue = getOptionValue(option);
			if (multiple) {
				if (!defaultValue) {
					defaultValue = [] as any;
				}
				for (const v of value) {
					if (v === optionValue) {
						(defaultValue as any).push(option);
					}
				}
			} else if (value === optionValue) {
				defaultValue = option as any;
			}
		}
	}

	const onChangeFunc = (
		event: React.SyntheticEvent,
		val: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
		reason: AutocompleteChangeReason,
		details?: AutocompleteChangeDetails<any>
	) => {
		const gotValue = getValue(val);
		onChange(gotValue);

		if (onChangeCallback) {
			onChangeCallback(event, val, reason, details);
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
			renderInput={(params) => (
				<TextField
					error={isError}
					helperText={isError ? error || submitError : helperText}
					label={label}
					name={name}
					onBlur={(e) => {
						textFieldPropsBlur?.(e);
						onBlur(e);
					}}
					onFocus={(e) => {
						textFieldPropsFocus?.(e);
						onFocus(e);
					}}
					required={required}
					variant={variant}
					{...params}
					{...restTextFieldProps}
					fullWidth={true}
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
				/>
			)}
			value={
				(defaultValue || (multiple ? [] : null)) as AutocompleteValue<
					T,
					Multiple,
					DisableClearable,
					FreeSolo
				>
			}
			{...lessrest}
		/>
	);
}
