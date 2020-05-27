import React from 'react';

import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { showErrorOnChange } from './Util';
import pickerProviderWrapper from './PickerProvider';

export interface DatePickerProps extends Partial<Omit<MuiDatePickerProps, 'onChange'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
}

export function DatePicker(props: DatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={(fieldRenderProps) => <DatePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerWrapperProps extends FieldRenderProps<MuiDatePickerProps, HTMLElement> {
	dateFunsUtils?: any;
}

function DatePickerWrapper(props: DatePickerWrapperProps) {
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
		<MuiDatePicker
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
	);
}
