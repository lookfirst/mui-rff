import React from 'react';

import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@mui/x-date-pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';
import { TextField } from '@mui/material';

export interface TimePickerProps extends Partial<Omit<MuiTimePickerProps, 'onChange'>> {
	name: string;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	required?: boolean;
	showError?: ShowErrorFunc;
}

export function TimePicker(props: TimePickerProps) {
	const { name, fieldProps, required, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <TimePickerWrapper required={required} {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface TimePickerWrapperProps extends FieldRenderProps<MuiTimePickerProps> {
	required?: boolean;
}

function TimePickerWrapper(props: TimePickerWrapperProps) {
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
		<MuiTimePicker
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
