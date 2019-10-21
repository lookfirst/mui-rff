import React from 'react';

import {
	TimePicker as MuiTimePicker,
	TimePickerProps as MuiTimePickerProps,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { Field, FieldRenderProps } from 'react-final-form';

interface TimePickerProps extends Partial<MuiTimePickerProps> {
	dateFunsUtils: any;
}

export function TimePicker(props: TimePickerProps) {
	const { name } = props;

	return (
		<Field
			name={name as any}
			render={fieldRenderProps => (
				<TimePickerWrapper {...fieldRenderProps} {...props} />
			)}
		/>
	);
}

interface TimePickerWrapperProps
	extends FieldRenderProps<MuiTimePickerProps, HTMLElement> {
	dateFunsUtils: any;
}

function TimePickerWrapper(props: TimePickerWrapperProps) {
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
			<MuiTimePicker
				fullWidth={true}
				autoOk={true}
				helperText={showError ? meta.error || meta.submitError : undefined}
				error={showError}
				margin="normal"
				onChange={onChange}
				value={(value as any) === '' ? null : value}
				{...rest}
				inputProps={restInput}
			/>
		</MuiPickersUtilsProvider>
	);
}
