import React from 'react';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

export const TYPE_PASSWORD = 'password';
export const TYPE_TEXT = 'text';

// Restricts the type values to 'password' and 'text'
export type TextFieldProps = Omit<MuiTextFieldProps, 'type'> & {
	type: typeof TYPE_PASSWORD | typeof TYPE_TEXT;
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

	const { helperText, ...lessrest } = rest as any;
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
			{...lessrest}
			inputProps={restInput as any}
		/>
	);
}
