import { TextFieldProps } from '@mui/material/TextField';
import {
	DateTimePicker as MuiDateTimePicker,
	DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers';
import React from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

import { ShowErrorFunc, showErrorOnChange } from './Util';

export interface DateTimePickerProps extends Partial<Omit<MuiDateTimePickerProps, 'onChange'>> {
	fieldProps?: Partial<FieldProps<any, any>>;
	locale?: any;
	name: string;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
	required?: boolean;
}

export function DateTimePicker(props: DateTimePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <DateTimePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DateTimePickerExtraProps {
	showError?: ShowErrorFunc;
	helperText?: React.ReactNode;
	textFieldProps?: TextFieldProps;
	slotProps?: any;
	required?: boolean;
}

type DateTimePickerWrapperProps = FieldRenderProps &
	DateTimePickerExtraProps &
	Omit<MuiDateTimePickerProps, 'value' | 'onChange'>;

function DateTimePickerWrapper(props: DateTimePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, textFieldProps, slotProps, required, ...lessRest } = rest as any;

	return (
		<MuiDateTimePicker
			onChange={onChange}
			value={value === '' ? null : value}
			{...lessRest}
			slotProps={{
				...slotProps,
				textField: {
					...textFieldProps,
					helperText: isError ? error || submitError : helperText,
					inputProps: {
						onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
							restInput.onBlur(event);
						},
						onFocus: (event: React.FocusEvent<HTMLInputElement>) => {
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
