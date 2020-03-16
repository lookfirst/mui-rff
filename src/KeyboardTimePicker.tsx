import React from 'react';

import {
	KeyboardTimePicker as MuiKeyboardTimePicker,
	KeyboardTimePickerProps as MuiKeyboardTimePickerProps,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps, useForm } from 'react-final-form';

import pickerProviderWrapper from './PickerProvider';

export interface KeyboardTimePickerProps extends Partial<Omit<MuiKeyboardTimePickerProps, 'onChange'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	onChange?: (
		value: MuiKeyboardTimePickerProps['value'],
		previousValue: MuiKeyboardTimePickerProps['value'] | undefined
	) => void;
}

export function KeyboardTimePicker(props: KeyboardTimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={fieldRenderProps => <KeyboardTimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface KeyboardTimePickerWrapperProps extends FieldRenderProps<MuiKeyboardTimePickerProps, HTMLElement> {
	dateFunsUtils?: any;
	onChange?: KeyboardTimePickerProps['onChange'];
}

function KeyboardTimePickerWrapper(props: KeyboardTimePickerWrapperProps) {
	const {
		input: { name, onChange: rffOnChange, value, ...restInput },
		meta,
		dateFunsUtils,
		onChange,
		...rest
	} = props;

	const { getFieldState } = useForm();

	const { helperText, ...lessrest } = rest;
	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

	return pickerProviderWrapper(
		dateFunsUtils,
		<MuiKeyboardTimePicker
			fullWidth={true}
			autoOk={true}
			helperText={showError ? meta.error || meta.submitError : helperText}
			error={showError}
			margin="normal"
			onChange={value => {
				const previousValue = getFieldState(name)!.value;
				rffOnChange(value);
				if (onChange) onChange(getFieldState(name)!.value, previousValue);
			}}
			name={name}
			value={(value as any) === '' ? null : value}
			{...lessrest}
			inputProps={restInput}
		/>
	);
}
