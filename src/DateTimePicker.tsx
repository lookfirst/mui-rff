import React from 'react';

import {
	DateTimePicker as MuiDateTimePicker,
	DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';
import { TextField } from '@mui/material';

export interface DateTimePickerProps extends Partial<Omit<MuiDateTimePickerProps<any, any>, 'onChange'>> {
	name: string;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	required?: boolean;
	showError?: ShowErrorFunc;
}

export function DateTimePicker(props: DateTimePickerProps) {
	const { name, fieldProps, required, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <DateTimePickerWrapper {...fieldRenderProps} {...rest} />}
			required={required}
			{...fieldProps}
		/>
	);
}

interface DateTimePickerWrapperProps extends FieldRenderProps<MuiDateTimePickerProps<any, any>> {
	required?: boolean;
}

function DateTimePickerWrapper(props: DateTimePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		showError = showErrorOnChange,
		required,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, ...lessrest } = rest;

	return (
		<MuiDateTimePicker
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
