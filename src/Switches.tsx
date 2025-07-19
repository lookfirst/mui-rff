import {
	FormControl,
	FormControlLabel,
	FormControlLabelProps,
	FormControlProps,
	FormGroup,
	FormGroupProps,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
	Switch as MuiSwitch,
	SwitchProps as MuiSwitchProps,
} from '@mui/material';
import React from 'react';
import { Field, FieldProps } from 'react-final-form';

import { ErrorMessage, ShowErrorFunc, showErrorOnChange, useFieldForErrors } from './Util';

export interface SwitchData {
	label: string | number | React.ReactElement;
	value: unknown;
	disabled?: boolean;
}

export interface SwitchesProps extends Partial<Omit<MuiSwitchProps, 'onChange'>> {
	name: string;
	data: SwitchData | SwitchData[];
	label?: string | number | React.ReactElement;
	required?: boolean;
	helperText?: React.ReactNode;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	formGroupProps?: Partial<FormGroupProps>;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	showError?: ShowErrorFunc;
}

export function Switches(props: SwitchesProps) {
	const {
		name,
		data,
		label,
		required,
		helperText,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
		showError = showErrorOnChange,
		...restSwitches
	} = props;

	const itemsData = Array.isArray(data) ? data : [data];
	const single = !Array.isArray(data);
	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<FormControl required={required} error={isError} {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : <></>}
			<FormGroup {...formGroupProps}>
				{itemsData.map((item: SwitchData, idx: number) => (
					<FormControlLabel
						key={idx}
						name={name}
						label={item.label}
						value={single ? undefined : item.value}
						disabled={item.disabled}
						control={
							<Field
								type="checkbox"
								name={name}
								render={({ input: { name, value, onChange, checked, ...restInput } }) => (
									<MuiSwitch
										name={name}
										value={value}
										onChange={onChange}
										checked={checked}
										disabled={item.disabled}
										required={required}
										slotProps={{
											input: { required, ...restInput },
										}}
										{...restSwitches}
									/>
								)}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</FormGroup>
			<ErrorMessage
				showError={isError}
				meta={field.meta}
				formHelperTextProps={formHelperTextProps}
				helperText={helperText}
			/>
		</FormControl>
	);
}
