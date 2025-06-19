import React from 'react';

import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@mui/x-date-pickers';
import { TextFieldProps } from '@mui/material/TextField';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';

export interface TimePickerProps extends Partial<Omit<MuiTimePickerProps, 'onChange'>> {
	name: string;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	required?: boolean;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
}

export function TimePicker(props: TimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <TimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

type TimePickerWrapperProps = FieldRenderProps<MuiTimePickerProps['value']>;

function TimePickerWrapper(props: TimePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, textFieldProps, required, ...lessRest } = rest;

	return (
		<MuiTimePicker
			onChange={onChange}
			value={(value as any) === '' ? null : value}
			{...lessRest}
			slotProps={{
				textField: {
					...textFieldProps,
					helperText: isError ? error || submitError : helperText,
					inputProps: {
						onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
							restInput.onBlur(event);
						},
						onFocus: (event: React.FocusEvent<HTMLInputElement>) => {
							restInput.onFocus(event);
						},
					},
					error: isError,
					fullWidth: true,
					name,
					onChange,
					value: (value as any) === '' ? null : value,
					required,
				},
			}}
		/>
	);
}
