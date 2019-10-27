import React from 'react';

import {
	DatePicker as MuiDatePicker,
	DatePickerProps as MuiDatePickerProps,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { Field, FieldRenderProps } from 'react-final-form';

interface DatePickerProps extends Partial<MuiDatePickerProps> {
	dateFunsUtils: any;
}

export function DatePicker(props: DatePickerProps) {
	const { name } = props;

	return (
		<Field name={name as any} render={fieldRenderProps => <DatePickerWrapper {...fieldRenderProps} {...props} />} />
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
				value={(value as any) === '' ? null : value}
				{...rest}
				inputProps={restInput}
			/>
		</MuiPickersUtilsProvider>
	);
}
