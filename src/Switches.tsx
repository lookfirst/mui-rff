import {
	FormControl,
	FormControlLabel,
	type FormControlLabelProps,
	type FormControlProps,
	FormGroup,
	type FormGroupProps,
	type FormHelperTextProps,
	FormLabel,
	type FormLabelProps,
	Switch as MuiSwitch,
	type SwitchProps as MuiSwitchProps,
} from '@mui/material';
import type React from 'react';
import { Field, type FieldProps } from 'react-final-form';

import {
	ErrorMessage,
	type ShowErrorFunc,
	showErrorOnChange,
	useFieldForErrors,
} from './Util';

export interface SwitchData {
	disabled?: boolean;
	label: string | number | React.ReactElement;
	value: unknown;
}

export interface SwitchesProps
	extends Partial<Omit<MuiSwitchProps, 'onChange'>> {
	data: SwitchData | SwitchData[];
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	formControlProps?: Partial<FormControlProps>;
	formGroupProps?: Partial<FormGroupProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	formLabelProps?: Partial<FormLabelProps>;
	helperText?: React.ReactNode;
	label?: string | number | React.ReactElement;
	name: string;
	required?: boolean;
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
		<FormControl error={isError} required={required} {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : null}
			<FormGroup {...formGroupProps}>
				{itemsData.map((item: SwitchData) => (
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
										...restInput
									},
								}) => (
									<MuiSwitch
										checked={checked}
										disabled={item.disabled}
										name={inputName}
										onChange={onChange}
										required={required}
										slotProps={{
											input: { required, ...restInput },
										}}
										value={value}
										{...restSwitches}
									/>
								)}
								type="checkbox"
								{...fieldProps}
							/>
						}
						disabled={item.disabled}
						key={`${name}${item.label}`}
						label={item.label}
						name={name}
						value={single ? undefined : item.value}
						{...formControlLabelProps}
					/>
				))}
			</FormGroup>
			<ErrorMessage
				formHelperTextProps={formHelperTextProps}
				helperText={helperText}
				meta={field.meta}
				showError={isError}
			/>
		</FormControl>
	);
}
