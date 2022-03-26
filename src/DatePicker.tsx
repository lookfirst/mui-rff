import React from 'react';

import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/lab';
import TextField from '@mui/material/TextField';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';

export interface DatePickerProps extends Partial<Omit<MuiDatePickerProps, 'onChange'>> {
	name: string;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	required?: boolean;
	showError?: ShowErrorFunc;
}

export function DatePicker(props: DatePickerProps) {
	const { name, fieldProps, required, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <DatePickerWrapper required={required} {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerWrapperProps extends FieldRenderProps<MuiDatePickerProps> {
	required?: boolean;
	locale?: any;
}

function DatePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		locale,
		required,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, ...lessrest } = rest;

	return (
		<MuiDatePicker
			onChange={onChange}
			value={(value as any) === '' ? null : value}
			{...lessrest}
			renderInput={(inputProps) => (
				<TextField
					{...inputProps}
					fullWidth={true}
					helperText={isError ? error || submitError : helperText}
					error={inputProps.error || isError}
					name={name}
					required={required}
					inputProps={{
						...inputProps.inputProps,
						onBlur: (event) => {
							inputProps.inputProps?.onBlur?.(event);
							restInput.onBlur(event);
						},
						onFocus: (event) => {
							inputProps.inputProps?.onFocus?.(event);
							restInput.onFocus(event);
						},
					}}
				/>
			)}
		/>
	);
}
