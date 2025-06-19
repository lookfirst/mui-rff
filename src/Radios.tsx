import React from 'react';

import {
	FormControl,
	FormControlLabel,
	FormControlLabelProps,
	FormControlProps,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
	Radio as MuiRadio,
	RadioProps as MuiRadioProps,
	RadioGroup,
	RadioGroupProps,
} from '@mui/material';

import { ErrorMessage, ShowErrorFunc, showErrorOnChange, useFieldForErrors } from './Util';
import { Field, FieldProps } from 'react-final-form';

export interface RadioData {
	label: string | number | React.ReactElement;
	value: unknown;
	disabled?: boolean;
}

export interface RadiosProps extends Partial<Omit<MuiRadioProps, 'onChange'>> {
	name: string;
	data: RadioData[];
	label?: string | number | React.ReactElement;
	required?: boolean;
	helperText?: React.ReactNode;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	radioGroupProps?: Partial<RadioGroupProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	showError?: ShowErrorFunc;
}

export function Radios(props: RadiosProps) {
	const {
		name,
		data,
		label,
		required,
		helperText,
		formLabelProps,
		formControlLabelProps,
		fieldProps,
		formControlProps,
		radioGroupProps,
		formHelperTextProps,
		showError = showErrorOnChange,
		...restRadios
	} = props;

	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<FormControl required={required} error={isError} {...formControlProps}>
			{!!label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
			<RadioGroup {...radioGroupProps}>
				{data.map((item: RadioData, idx: number) => (
					<FormControlLabel
						key={idx}
						name={name}
						label={item.label}
						value={item.value}
						disabled={item.disabled}
						control={
							<Field
								name={name}
								type="radio"
								render={({
									input: { name, value, onChange, checked, onBlur, onFocus, ...restInput },
								}) => (
									<MuiRadio
										name={name}
										value={value}
										onChange={onChange}
										checked={checked}
										disabled={item.disabled}
										required={required}
										slotProps={{
											input: {
												required,
												onBlur,
												onFocus,
												...restInput,
											},
										}}
										{...restRadios}
									/>
								)}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</RadioGroup>
			<ErrorMessage
				showError={isError}
				meta={field.meta}
				formHelperTextProps={formHelperTextProps}
				helperText={helperText}
			/>
		</FormControl>
	);
}
