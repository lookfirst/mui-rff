import React from 'react';

import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps, useForm } from 'react-final-form';

import pickerProviderWrapper from './PickerProvider';

export interface TimePickerProps extends Partial<Omit<MuiTimePickerProps, 'onChange'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	onChange?: (value: unknown, previousValue: unknown) => void;
}

export function TimePicker(props: TimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={fieldRenderProps => <TimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface TimePickerWrapperProps extends FieldRenderProps<MuiTimePickerProps, HTMLElement> {
	dateFunsUtils?: any;
	onChange?: TimePickerProps['onChange'];
}

function TimePickerWrapper(props: TimePickerWrapperProps) {
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
		<MuiTimePicker
			fullWidth={true}
			autoOk={true}
			helperText={showError ? meta.error || meta.submitError : helperText}
			error={showError}
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
