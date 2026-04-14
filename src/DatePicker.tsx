import type { TextFieldProps } from '@mui/material/TextField';
import {
	DatePicker as MuiDatePicker,
	type DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers';
import type React from 'react';
import { Field, type FieldProps, type FieldRenderProps } from 'react-final-form';

import { type ShowErrorFunc, showErrorOnChange } from './Util';

export interface DatePickerProps extends Partial<Omit<MuiDatePickerProps, 'onChange'>> {
	fieldProps?: Partial<FieldProps<any, any>>;
	locale?: any;
	name: string;
	required?: boolean;
	showError?: ShowErrorFunc;
	textFieldProps?: TextFieldProps;
}

export function DatePicker(props: DatePickerProps) {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={(fieldRenderProps) => <DatePickerWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
}

interface DatePickerExtraProps {
	helperText?: React.ReactNode;
	required?: boolean;
	showError?: ShowErrorFunc;
	slotProps?: any;
	textFieldProps?: TextFieldProps;
}

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

	const { helperText, textFieldProps, slotProps, required, ...lessRest } = rest as any;
	const { slotProps: textFieldSlotProps, ...restTextFieldProps } = textFieldProps || {};

	return (
		<MuiDatePicker
			onChange={onChange}
			value={value === '' ? null : value}
			{...lessRest}
			slotProps={{
				...slotProps,
				textField: {
					...restTextFieldProps,
					helperText: isError ? error || submitError : helperText,
					slotProps: {
						...textFieldSlotProps,
						htmlInput: {
							...textFieldSlotProps?.htmlInput,
							onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
								textFieldSlotProps?.htmlInput?.onBlur?.(event);
								restInput.onBlur(event);
							},
							onFocus: (event: React.FocusEvent<HTMLInputElement>) => {
								textFieldSlotProps?.htmlInput?.onFocus?.(event);
								restInput.onFocus(event);
							},
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
