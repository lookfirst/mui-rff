import React from 'react';

import {
	KeyboardDatePicker,
	KeyboardDatePickerProps,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { Field, FieldRenderProps } from 'react-final-form';

interface DatePickerProps extends Partial<KeyboardDatePickerProps> {
	dateFunsUtils: any;
}

export function DatePicker(props: DatePickerProps) {
	const { name } = props;

	return (
		<Field
			name={name as any}
			render={fieldRenderProps => (
				<DatePickerWrapper {...fieldRenderProps} {...props} />
			)}
		/>
	);
}

interface DatePickerWrapperProps
	extends FieldRenderProps<KeyboardDatePickerProps, HTMLElement> {
	dateFunsUtils: any;
}

function DatePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		dateFunsUtils,
		...rest
	} = props;

	const showError =
		((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
		meta.touched;

	return (
		<MuiPickersUtilsProvider utils={dateFunsUtils}>
			<KeyboardDatePicker
				disableToolbar
				fullWidth={true}
				autoOk={true}
				helperText={showError ? meta.error || meta.submitError : undefined}
				error={showError}
				variant="inline"
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
