import React from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {
	KeyboardDatePicker,
	KeyboardDatePickerProps,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { Field, FieldRenderProps } from 'react-final-form';

export function DatePicker(props: Partial<KeyboardDatePickerProps>) {
	const { name } = props;

	return (
		<Field
			name={name as any}
			render={({ input, meta }) => (
				<DatePickerWrapper input={input} meta={meta} {...props} />
			)}
		/>
	);
}

function DatePickerWrapper(
	props: FieldRenderProps<KeyboardDatePickerProps, HTMLElement>
) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		...rest
	} = props;
	const showError =
		((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
		meta.touched;

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
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
