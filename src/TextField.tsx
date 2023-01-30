import React from 'react';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { ShowErrorFunc, showErrorOnChange } from './Util';

export const TYPE_PASSWORD = 'password';
export const TYPE_TEXT = 'text';
export const TYPE_EMAIL = 'email';
export const TYPE_NUMBER = 'number';
export const TYPE_URL = 'url';
export const TYPE_TELEPHONE = 'tel';
export const TYPE_DATE = 'date';
export const TYPE_DATETIME_LOCAL = 'datetime-local';
export const TYPE_MONTH = 'month';
export const TYPE_TIME = 'time';
export const TYPE_WEEK = 'week';
export const TYPE_COLOR = 'color';

// Restricts the type values to 'password', 'text', 'email', 'number', and 'url'.
export type TEXT_FIELD_TYPE =
	| typeof TYPE_PASSWORD
	| typeof TYPE_TEXT
	| typeof TYPE_EMAIL
	| typeof TYPE_NUMBER
	| typeof TYPE_URL
	| typeof TYPE_TELEPHONE
	| typeof TYPE_DATE
	| typeof TYPE_DATETIME_LOCAL
	| typeof TYPE_MONTH
	| typeof TYPE_TIME
	| typeof TYPE_WEEK
	| typeof TYPE_COLOR;

export type TextFieldProps = Partial<Omit<MuiTextFieldProps, 'type' | 'onChange'>> & {
	name: string;
	type?: TEXT_FIELD_TYPE;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
	error?: boolean;
};

export function TextField(props: TextFieldProps) {
	const { name, type, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			type={type}
			render={({ input, meta }) => (
				<TextFieldWrapper input={input} meta={meta} name={name} type={type} {...rest} />
			)}
			{...fieldProps}
		/>
	);
}

type TextWrapperProps = FieldRenderProps<MuiTextFieldProps>;

export function TextFieldWrapper(props: TextWrapperProps) {
	const {
		input: { name, value, type, onChange, onBlur, onFocus, ...restInput },
		meta,
		required,
		fullWidth = true,
		helperText,
		error,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error: metaError, submitError } = meta;
	const isError = error == null ? showError({ meta }) : error;
	const takeText = error ? helperText || metaError || submitError : isError ? metaError || submitError : helperText;

	return (
		<MuiTextField
			fullWidth={fullWidth}
			helperText={takeText}
			error={isError}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}
			name={name}
			value={value}
			type={type}
			required={required}
			inputProps={{ required, ...restInput }}
			{...rest}
		/>
	);
}
