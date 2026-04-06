import type { TextFieldProps } from '@mui/material/TextField';
import {
	TimePicker as MuiTimePicker,
	type TimePickerProps as MuiTimePickerProps,
} from '@mui/x-date-pickers';
import type React from 'react';
import {
	Field,
	type FieldProps,
	type FieldRenderProps,
} from 'react-final-form';

import { type ShowErrorFunc, showErrorOnChange } from './Util';

export interface TimePickerProps
	extends Partial<Omit<MuiTimePickerProps, 'onChange'>> {
	fieldProps?: Partial<FieldProps<any, any>>;
	locale?: any;
	name: string;
	required?: boolean;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
}

export function TimePicker(props: TimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => (
				<TimePickerWrapper {...fieldRenderProps} {...rest} />
			)}
			{...fieldProps}
		/>
	);
}

interface TimePickerExtraProps {
	helperText?: React.ReactNode;
	required?: boolean;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
}
type TimePickerWrapperProps = FieldRenderProps &
	TimePickerExtraProps &
	Omit<MuiTimePickerProps, 'value' | 'onChange'>;

function TimePickerWrapper(props: TimePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, textFieldProps, required, ...lessRest } = rest as any;

	return (
		<MuiTimePicker
			onChange={onChange}
			value={value === '' ? null : value}
			{...lessRest}
			slotProps={{
				textField: {
					...textFieldProps,
					helperText: isError ? error || submitError : helperText,
					inputProps: {
						onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
							restInput.onBlur(event);
						},
						onFocus: (
							event: React.FocusEvent<HTMLInputElement>
						) => {
							restInput.onFocus(event);
						},
					},
					error: isError,
					fullWidth: true,
					name,
					onChange,
					value: value === '' ? null : value,
					required,
				},
			}}
		/>
	);
}
