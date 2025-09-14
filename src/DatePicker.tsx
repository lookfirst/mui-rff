import type { TextFieldProps } from '@mui/material/TextField';
import {
	DatePicker as MuiDatePicker,
	type DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers';
import type React from 'react';
import {
	Field,
	type FieldProps,
	type FieldRenderProps,
} from 'react-final-form';

import { type ShowErrorFunc, showErrorOnChange } from './Util';

export interface DatePickerProps
	extends Partial<Omit<MuiDatePickerProps, 'onChange'>> {
	fieldProps?: Partial<FieldProps<any, any>>;
	locale?: any;
	name: string;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
	required?: boolean;
}

export function DatePicker(props: DatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => (
				<DatePickerWrapper {...fieldRenderProps} {...rest} />
			)}
			{...fieldProps}
		/>
	);
}

type DatePickerExtraProps = {
	showError?: ShowErrorFunc;
	helperText?: React.ReactNode;
	textFieldProps?: TextFieldProps;
	slotProps?: any;
	required?: boolean;
};

type DatePickerWrapperProps = FieldRenderProps &
	DatePickerExtraProps &
	Omit<MuiDatePickerProps, 'value' | 'onChange'>;

function DatePickerWrapper(props: DatePickerWrapperProps) {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		showError = showErrorOnChange,
		...rest
	} = props;

	const { error, submitError } = meta;
	const isError = showError({ meta });

	const { helperText, textFieldProps, slotProps, required, ...lessRest } =
		rest as any;

	return (
		<MuiDatePicker
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
