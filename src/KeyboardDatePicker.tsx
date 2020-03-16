import React from 'react';

import {
	KeyboardDatePicker as MuiKeyboardDatePicker,
	KeyboardDatePickerProps as MuiKeyboardDatePickerProps,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps, useForm } from 'react-final-form';

import pickerProviderWrapper from './PickerProvider';

export interface KeyboardDatePickerProps extends Partial<Omit<MuiKeyboardDatePickerProps, 'onSubmit'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	onChange?: (
		value: MuiKeyboardDatePickerProps['value'],
		previousValue: MuiKeyboardDatePickerProps['value'] | undefined
	) => void;
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
	onChange?: KeyboardDatePickerProps['onChange'];
}

function KeyboardDatePickerWrapper(props: DatePickerWrapperProps) {
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
		<MuiKeyboardDatePicker
			disableToolbar
			fullWidth={true}
			autoOk={true}
			helperText={showError ? meta.error || meta.submitError : helperText}
			error={showError}
			variant="inline"
			format="yyyy-MM-dd"
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
