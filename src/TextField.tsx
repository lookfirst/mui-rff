import React from 'react';

import { Field, FieldRenderProps } from 'react-final-form';
import { TextField as MuiTextField } from '@material-ui/core';
import { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField/TextField';

export function TextField(props: Partial<MuiTextFieldProps>) {
	const { name } = props;

	return (
		<Field
			name={name as any}
			render={({ input, meta }) => (
				<TextFieldWrapper input={input} meta={meta} {...props} />
			)}
		/>
	);
}

function TextFieldWrapper(
	props: FieldRenderProps<MuiTextFieldProps, HTMLInputElement>
) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		...rest
	} = props;
	const showError =
		((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
		meta.touched;

	return (
		<MuiTextField
			fullWidth={true}
			helperText={showError ? meta.error || meta.submitError : undefined}
			error={showError}
			onChange={onChange}
			name={name}
			value={value}
			margin="normal"
			{...rest}
			InputLabelProps={{ shrink: !!value }}
			inputProps={restInput as any}
		/>
	);
}
