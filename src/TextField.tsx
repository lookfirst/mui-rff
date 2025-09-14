import {
	TextField as MuiTextField,
	type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import {
	Field,
	type FieldProps,
	type FieldRenderProps,
} from 'react-final-form';

import { type ShowErrorFunc, showErrorOnChange } from './Util';

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

export type TextFieldProps = Partial<
	Omit<MuiTextFieldProps, 'type' | 'onChange'>
> & {
	name: string;
	type?: TEXT_FIELD_TYPE;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
};

export function TextField({
	name,
	type,
	fieldProps,
	showError = showErrorOnChange,
	fullWidth = true,
	...rest
}: TextFieldProps) {
	return (
		<Field
			name={name}
			type={type}
			{...fieldProps}
			render={(fieldRenderProps) => (
				<TextFieldWrapper
					fieldRenderProps={fieldRenderProps}
					fullWidth={fullWidth}
					name={name}
					showError={showError}
					{...rest}
				/>
			)}
		/>
	);
}

interface TextFieldWrapperProps
	extends Omit<
		TextFieldProps,
		'type' | 'value' | 'onChange' | 'onBlur' | 'onFocus'
	> {
	fieldRenderProps: FieldRenderProps;
	showError: ShowErrorFunc;
}

export function TextFieldWrapper({
	fieldRenderProps: {
		input: { value, type, onChange, onBlur, onFocus, ...restInput },
		meta,
	},
	helperText,
	showError,
	slotProps,
	...rest
}: TextFieldWrapperProps) {
	const { error, submitError } = meta;
	const isError = showError({ meta });

	return (
		<MuiTextField
			error={isError}
			helperText={isError ? error || submitError : helperText}
			onBlur={onBlur}
			onChange={onChange}
			onFocus={onFocus}
			slotProps={{
				...slotProps,
				htmlInput: {
					...restInput,
					...slotProps?.htmlInput,
				},
			}}
			type={type}
			value={value}
			{...rest}
		/>
	);
}
