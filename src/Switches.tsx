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

import { Field, FieldProps, useFormState } from 'react-final-form';

export interface SwitchData {
	label: ReactNode;
	value: any;
	disabled?: boolean;
}

export interface SwitchesProps extends Partial<MuiSwitchProps> {
	name: string;
	data: SwitchData | SwitchData[];
	label?: ReactNode;
	required?: boolean;
	helperText?: string;
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
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
		...restSwitches
	} = props;

	const formState = useFormState();
	const { errors, submitErrors, submitFailed, modified } = formState;
	const [errorState, setErrorState] = useState<string | null>(null);

	useEffect(() => {
		const showError = (!!errors[name] || !!submitErrors) && (submitFailed || (modified && modified[name]));
		setErrorState(showError ? errors[name] || submitErrors[name] : null);
	}, [errors, submitErrors, submitFailed, modified, name]);

	const isArray = Array.isArray(data);
	const single = !isArray || (isArray && (data as any).length === 1);

	// This works around the fact that we can pass in a single item
	let itemData = data;
	if (!isArray) {
		itemData = [data] as any;
	}

	return (
		<FormControl required={required} error={!!errorState} {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : <></>}
			<FormGroup {...formGroupProps}>
				{(itemData as any).map((item: SwitchData, idx: number) => (
					<FormControlLabel
						key={idx}
						name={name}
						label={item.label}
						value={single ? undefined : item.value}
						disabled={item.disabled}
						control={
							<Field type="checkbox" name={name} {...fieldProps}>
								{({ input: { name, value, onChange, checked, ...restInput } }) => (
									<MuiSwitch
										name={name}
										value={value}
										onChange={onChange}
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
