import React from 'react';

import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@mui/lab';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';
import { TextField } from '@mui/material';
import pickerProviderWrapper from './PickerProvider';

export interface TimePickerProps extends Partial<Omit<MuiTimePickerProps, 'onChange'>> {
	name: string;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
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

interface TimePickerWrapperProps extends FieldRenderProps<MuiTimePickerProps> {
	locale?: any;
}

function TimePickerWrapper(props: TimePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		locale,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, ...lessrest } = rest;

	return pickerProviderWrapper(
		<MuiTimePicker
			onChange={onChange}
			value={(value as any) === '' ? null : value}
			{...lessrest}
			renderInput={(props) => (
				<TextField
					fullWidth={true}
					helperText={isError ? error || submitError : helperText}
					error={isError}
					name={name}
					{...restInput}
					{...props}
				/>
			)}
		/>,
		locale,
	);
}
