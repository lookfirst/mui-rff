import React from 'react';

import {
	KeyboardDatePicker as MuiKeyboardDatePicker,
	KeyboardDatePickerProps as MuiKeyboardDatePickerProps,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { showErrorOnChange, ShowErrorFunc } from './Util';
import pickerProviderWrapper from './PickerProvider';

export interface KeyboardDatePickerProps extends Partial<Omit<MuiKeyboardDatePickerProps, 'onChange'>> {
	name: string;
	dateFunsUtils?: any;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
}

export function KeyboardDatePicker(props: KeyboardDatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={fieldRenderProps => <KeyboardDatePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerWrapperProps extends FieldRenderProps<MuiKeyboardDatePickerProps, HTMLElement> {
	dateFunsUtils?: any;
	locale?: any;
}

function KeyboardDatePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		dateFunsUtils,
		locale,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, ...lessrest } = rest;

	return pickerProviderWrapper(
		dateFunsUtils,
		<MuiKeyboardDatePicker
			disableToolbar
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
		locale,
	);
}
