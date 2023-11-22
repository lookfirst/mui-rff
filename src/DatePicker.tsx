import React from 'react';

import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers';
import { TextFieldProps } from '@mui/material/TextField';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';

export interface DatePickerProps extends Partial<Omit<MuiDatePickerProps<any>, 'onChange'>> {
	fieldProps?: Partial<FieldProps<any, any>>;
	locale?: any;
	name: string;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
	required?: boolean;
}

export function DatePicker(props: DatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <DatePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

type DatePickerWrapperProps = FieldRenderProps<MuiDatePickerProps<any>>;

function DatePickerWrapper(props: DatePickerWrapperProps) {
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
		<MuiDatePicker
			onChange={onChange}
			value={(value as any) === '' ? null : value}
			{...lessRest}
			slotProps={{
				textField: {
					...textFieldProps,
					helperText: isError ? error || submitError : helperText,
					inputProps: {
						onBlur: (event) => {
							restInput.onBlur(event);
						},
						onFocus: (event) => {
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
