import React from 'react';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { showErrorOnChange, ShowErrorFunc } from './Util';

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

export type TextFieldProps = Partial<Omit<MuiTextFieldProps, 'type' | 'onChange'>> & {
	name: string;
	type?: TEXT_FIELD_TYPE;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
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

type TextWrapperProps = FieldRenderProps<MuiTextFieldProps, HTMLElement>;

export function TextFieldWrapper(props: TextWrapperProps) {
	const {
		input: { name, value, type, onChange, ...restInput },
		meta,
		required,
		fullWidth = true,
		helperText,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	return (
		<MuiTextField
			fullWidth={fullWidth}
			helperText={isError ? error || submitError : helperText}
			error={isError}
			onChange={onChange}
			name={name}
			value={value}
			type={type}
			required={required}
			inputProps={{ required, ...restInput }}
			{...rest}
		/>
	);
}
