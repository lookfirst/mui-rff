import React from 'react';

import {
	DatePicker as MuiDatePicker,
	DatePickerProps as MuiDatePickerProps,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

interface DatePickerProps extends Partial<MuiDatePickerProps> {
	dateFunsUtils: any;
	fieldProps?: FieldProps<any, any>;
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
	dateFunsUtils: any;
}

function DatePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		dateFunsUtils,
		...rest
	} = props;

	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

	return (
		<MuiPickersUtilsProvider utils={dateFunsUtils}>
			<MuiDatePicker
				fullWidth={true}
				autoOk={true}
				helperText={showError ? meta.error || meta.submitError : undefined}
				error={showError}
				format="yyyy-MM-dd"
				margin="normal"
				onChange={onChange}
				name={name}
				value={(value as any) === '' ? null : value}
				{...rest}
				inputProps={restInput}
			/>
		</MuiPickersUtilsProvider>
	);
}
