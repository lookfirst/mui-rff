import React from 'react';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

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
	| typeof TYPE_WEEK;

export type TextFieldProps = Omit<MuiTextFieldProps, 'type'> & {
	type: TEXT_FIELD_TYPE;
	fieldProps?: FieldProps<any, any>;
};

export function TextField(props: Partial<TextFieldProps>) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={({ input, meta }) => <TextFieldWrapper input={input} meta={meta} {...rest} />}
			{...fieldProps}
		/>
	);
}

function TextFieldWrapper(props: FieldRenderProps<TextFieldProps, HTMLInputElement>) {
	const {
		input: { name, onChange, value, type = TYPE_TEXT, ...restInput },
		meta,
		...rest
	} = props;

	const { helperText, inputProps, ...lessRest } = rest;
	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

	return (
		<MuiTextField
			fullWidth={true}
			helperText={showError ? meta.error || meta.submitError : helperText}
			error={showError}
			onChange={onChange}
			name={name}
			value={value}
			margin="normal"
			type={type}
			inputProps={{ ...restInput, ...inputProps }}
			{...lessRest}
		/>
	);
}
