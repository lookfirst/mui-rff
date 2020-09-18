import React from 'react';

import {
	KeyboardTimePicker as MuiKeyboardTimePicker,
	KeyboardTimePickerProps as MuiKeyboardTimePickerProps,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { showErrorOnChange, ShowErrorFunc } from './Util';
import pickerProviderWrapper from './PickerProvider';

export interface KeyboardTimePickerProps extends Partial<Omit<MuiKeyboardTimePickerProps, 'onChange'>> {
	name: string;
	dateFunsUtils?: any;
	locale?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	showError?: ShowErrorFunc;
}

export function KeyboardTimePicker(props: KeyboardTimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={fieldRenderProps => <KeyboardTimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface KeyboardTimePickerWrapperProps extends FieldRenderProps<MuiKeyboardTimePickerProps, HTMLElement> {
	dateFunsUtils?: any;
	locale?: any;
}

function KeyboardTimePickerWrapper(props: KeyboardTimePickerWrapperProps) {
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
		<MuiKeyboardTimePicker
			fullWidth={true}
			autoOk={true}
			helperText={isError ? error || submitError : helperText}
			error={isError}
			onChange={onChange}
			name={name}
			value={(value as any) === '' ? null : value}
			{...lessrest}
			inputProps={restInput}
		/>,
		locale,
	);
}
