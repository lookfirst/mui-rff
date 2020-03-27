import React from 'react';

import {
	KeyboardDatePicker as MuiKeyboardDatePicker,
	KeyboardDatePickerProps as MuiKeyboardDatePickerProps,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import pickerProviderWrapper from './PickerProvider';

export interface KeyboardDatePickerProps extends Partial<Omit<MuiKeyboardDatePickerProps, 'onChange'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
}

export function KeyboardDatePicker(props: KeyboardDatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={fieldRenderProps => <KeyboardDatePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerWrapperProps extends FieldRenderProps<MuiKeyboardDatePickerProps, HTMLElement> {
	dateFunsUtils?: any;
}

function KeyboardDatePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta: { error, submitError, dirtySinceLastSubmit, touched },
		dateFunsUtils,
		...rest
	} = props;

	const { helperText, ...lessrest } = rest;
	const showError = ((submitError && !dirtySinceLastSubmit) || error) && touched;

	return pickerProviderWrapper(
		dateFunsUtils,
		<MuiKeyboardDatePicker
			disableToolbar
			fullWidth={true}
			autoOk={true}
			helperText={showError ? error || submitError : helperText}
			error={showError}
			onChange={onChange}
			name={name}
			value={(value as any) === '' ? null : value}
			inputProps={restInput}
			{...lessrest}
		/>
	);
}
