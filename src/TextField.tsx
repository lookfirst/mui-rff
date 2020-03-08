import React, { useEffect, useState } from 'react';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@material-ui/core';

import { Field, FieldProps, useFormState } from 'react-final-form';

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

export type TextFieldProps = Partial<Omit<MuiTextFieldProps, 'type'>> & {
	name: string;
	type?: TEXT_FIELD_TYPE;
	fieldProps?: Partial<FieldProps<any, any>>;
};

export function TextField(props: TextFieldProps) {
	const { name, type = TYPE_TEXT, fieldProps, helperText, fullWidth = true, ...rest } = props;

	const formState = useFormState();
	const { errors, submitErrors, submitFailed, modified } = formState;
	const [errorState, setErrorState] = useState<string | null>(null);

	useEffect(() => {
		const showError = (!!errors[name] || !!submitErrors) && (submitFailed || (modified && modified[name]));
		setErrorState(showError ? errors[name] || submitErrors[name] : null);
	}, [errors, submitErrors, submitFailed, modified, name]);

	return (
		<Field name={name} {...fieldProps}>
			{({ input: { name, value, onChange, checked, ...restInput } }) => (
				<MuiTextField
					fullWidth={fullWidth}
					helperText={!!errorState ? errorState : helperText}
					error={!!errorState}
					onChange={onChange}
					name={name}
					value={value}
					type={type}
					margin="normal"
					inputProps={{ ...restInput }}
					{...(rest as any)}
				/>
			)}
		</Field>
	);
}
