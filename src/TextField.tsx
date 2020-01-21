import React from 'react';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

export const TYPE_PASSWORD = 'password';
export const TYPE_TEXT = 'text';
export const TYPE_EMAIL = 'email';
export const TYPE_NUMBER = 'number';
export const TYPE_URL = 'url';

// Restricts the type values to 'password', 'text', 'email', 'number', and 'url'. 
export type TextFieldProps = Omit<MuiTextFieldProps, 'type'> & {
	type: typeof TYPE_PASSWORD | typeof TYPE_TEXT | typeof TYPE_EMAIL | typeof TYPE_NUMBER | typeof TYPE_URL;
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

	const { helperText, ...lessRest } = rest as any;
	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

	return (
		<MuiTextField
			fullWidth={true}
			helperText={helperText !== undefined ? helperText : showError ? meta.error || meta.submitError : undefined}
			error={showError}
			onChange={onChange}
			name={name}
			value={value}
			margin="normal"
			type={type}
			{...lessRest}
			inputProps={restInput as any}
		/>
	);
}
