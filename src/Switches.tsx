import React, { useState, useEffect, ReactNode } from 'react';

import {
	Switch as MuiSwitch,
	SwitchProps as MuiSwitchProps,
	FormControl,
	FormControlProps,
	FormControlLabel,
	FormControlLabelProps,
	FormGroup,
	FormGroupProps,
	FormHelperText,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
} from '@material-ui/core';

import { Field, FieldProps, useFormState, useForm } from 'react-final-form';

export interface SwitchData {
	label: ReactNode;
	value: unknown;
	disabled?: boolean;
}

export interface SwitchesProps extends Partial<Omit<MuiSwitchProps, 'onChange'>> {
	name: string;
	data: SwitchData | SwitchData[];
	label?: ReactNode;
	required?: boolean;
	helperText?: string;
	onChange?: (value: SwitchData['value'][], previousValue: SwitchData['value'][] | undefined) => void;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	formGroupProps?: Partial<FormGroupProps>;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
}

export function Switches(props: SwitchesProps) {
	const {
		name,
		data,
		label,
		required,
		helperText,
		onChange,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
		...restSwitches
	} = props;

	const { errors, submitErrors, submitFailed, modified } = useFormState();
	const { getFieldState } = useForm();
	const [errorState, setErrorState] = useState<string | null>(null);

	useEffect(() => {
		const showError = (!!errors[name] || !!submitErrors) && (submitFailed || (modified && modified[name]));
		setErrorState(showError ? errors[name] || submitErrors[name] : null);
	}, [errors, submitErrors, submitFailed, modified, name]);

	const itemsData = !Array.isArray(data) ? [data] : data;
	const single = itemsData.length === 1;

	return (
		<FormControl required={required} error={!!errorState} {...formControlProps}>
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
							<Field type="checkbox" name={name} {...fieldProps}>
								{({ input: { name, value, onChange: rffOnChange, checked, ...restInput } }) => (
									<MuiSwitch
										name={name}
										value={value}
										onChange={e => {
											const previousValue = getFieldState(name)!.value;
											rffOnChange(e);
											if (onChange) onChange(getFieldState(name)!.value, previousValue);
										}}
										checked={checked}
										inputProps={{ required: required, ...restInput }}
										{...restSwitches}
									/>
								)}
							</Field>
						}
						{...formControlLabelProps}
					/>
				))}
			</FormGroup>
			{!!errorState ? (
				<FormHelperText {...formHelperTextProps}>{errorState}</FormHelperText>
			) : (
				!!helperText && <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>
			)}
		</FormControl>
	);
}
