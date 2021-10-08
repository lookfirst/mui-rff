import React from 'react';

import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/lab';
import { TextField } from 'TextField';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';
import pickerProviderWrapper from './PickerProvider';

export interface DatePickerProps extends Partial<Omit<MuiDatePickerProps, 'onChange'>> {
	name: string;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
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

interface DatePickerWrapperProps extends FieldRenderProps<MuiDatePickerProps> {
	locale?: any;
}

function DatePickerWrapper(props: DatePickerWrapperProps) {
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
		<MuiDatePicker
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
