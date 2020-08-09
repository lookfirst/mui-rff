import React from 'react';

import {
	KeyboardDateTimePicker as MuiKeyboardDateTimePicker,
	KeyboardDateTimePickerProps as MuiKeyboardDateTimePickerProps,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { showErrorOnChange } from './Util';
import pickerProviderWrapper from './PickerProvider';

export interface KeyboardDateTimePickerProps extends Partial<Omit<MuiKeyboardDateTimePickerProps, 'onChange'>> {
	name: string;
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
}

export function KeyboardDateTimePicker(props: KeyboardDateTimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={fieldRenderProps => <KeyboardDateTimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerWrapperProps extends FieldRenderProps<MuiKeyboardDateTimePickerProps, HTMLElement> {
	dateFunsUtils?: any;
}

function KeyboardDateTimePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		dateFunsUtils,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, ...lessrest } = rest;

	return pickerProviderWrapper(
		dateFunsUtils,
		<MuiKeyboardDateTimePicker
			fullWidth={true}
			autoOk={true}
			helperText={isError ? error || submitError : helperText}
			error={isError}
			onChange={onChange}
			name={name}
			value={(value as any) === '' ? null : value}
			inputProps={restInput}
			{...lessrest}
		/>,
	);
}
