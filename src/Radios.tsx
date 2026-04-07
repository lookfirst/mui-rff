import {
	FormControl,
	FormControlLabel,
	type FormControlLabelProps,
	type FormControlProps,
	type FormHelperTextProps,
	FormLabel,
	type FormLabelProps,
	Radio as MuiRadio,
	type RadioProps as MuiRadioProps,
	RadioGroup,
	type RadioGroupProps,
} from '@mui/material';
import type React from 'react';
import { Field, type FieldProps } from 'react-final-form';

import { ErrorMessage, type ShowErrorFunc, showErrorOnChange, useFieldForErrors } from './Util';

export interface RadioData {
	disabled?: boolean;
	label: string | number | React.ReactElement;
	value: unknown;
}

export interface RadiosProps extends Partial<Omit<MuiRadioProps, 'onChange'>> {
	data: RadioData[];
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	formControlProps?: Partial<FormControlProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	formLabelProps?: Partial<FormLabelProps>;
	helperText?: React.ReactNode;
	label?: string | number | React.ReactElement;
	name: string;
	radioGroupProps?: Partial<RadioGroupProps>;
	required?: boolean;
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
		<FormControl error={isError} required={required} {...formControlProps}>
			{!!label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
			<RadioGroup {...radioGroupProps}>
				{data.map((item: RadioData) => (
					<FormControlLabel
						control={
							<Field
								name={name}
								render={({
									input: {
										name: inputName,
										value,
										onChange,
										checked,
										onBlur,
										onFocus,
										...restInput
									},
								}) => (
									<MuiRadio
										checked={checked}
										disabled={item.disabled}
										name={inputName}
										onChange={onChange}
										required={required}
										slotProps={{
											input: {
												required,
												onBlur,
												onFocus,
												...restInput,
											},
										}}
										value={value}
										{...restRadios}
									/>
								)}
								type="radio"
								{...fieldProps}
							/>
						}
						disabled={item.disabled}
						key={`${name}${item.label}`}
						label={item.label}
						name={name}
						value={item.value}
						{...formControlLabelProps}
					/>
				))}
			</RadioGroup>
			<ErrorMessage
				formHelperTextProps={formHelperTextProps}
				helperText={helperText}
				meta={field.meta}
				showError={isError}
			/>
		</FormControl>
	);
}
