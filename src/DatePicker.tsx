import React from 'react';

import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps, useForm } from 'react-final-form';

import pickerProviderWrapper from './PickerProvider';

export interface DatePickerProps extends Partial<Omit<MuiDatePickerProps, 'onChange'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
	onChange?: (value: MuiDatePickerProps['value'], previousValue: MuiDatePickerProps['value'] | undefined) => void;
}

export function DatePicker(props: DatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={fieldRenderProps => <DatePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerWrapperProps extends FieldRenderProps<MuiDatePickerProps, HTMLElement> {
	dateFunsUtils?: any;
	onChange?: DatePickerProps['onChange'];
}

function DatePickerWrapper(props: DatePickerWrapperProps) {
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
		<MuiDatePicker
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
