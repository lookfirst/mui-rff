import React from 'react';

import { DateTimePicker as MuiDateTimePicker, DateTimePickerProps as MuiDateTimePickerProps } from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { showError } from './Util';
import pickerProviderWrapper from './PickerProvider';

export interface DateTimePickerProps extends Partial<Omit<MuiDateTimePickerProps, 'onChange'>> {
	dateFunsUtils?: any;
	fieldProps?: Partial<FieldProps<any, any>>;
}

export function DateTimePicker(props: DateTimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name as any}
			render={(fieldRenderProps) => <DateTimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DateTimePickerWrapperProps extends FieldRenderProps<MuiDateTimePickerProps, HTMLElement> {
	dateFunsUtils?: any;
}

function DateTimePickerWrapper(props: DateTimePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		dateFunsUtils,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, ...lessrest } = rest;

	return pickerProviderWrapper(
		dateFunsUtils,
		<MuiDateTimePicker
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
