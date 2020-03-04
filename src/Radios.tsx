import React, { useEffect, useState } from 'react';

import {
	Radio as MuiRadio,
	RadioProps,
	RadioGroup,
	RadioGroupProps,
	FormControl,
	FormControlProps,
	FormControlLabel,
	FormControlLabelProps,
	FormHelperText,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
} from '@material-ui/core';

import { Field, FieldProps, useFormState } from 'react-final-form';

export interface RadioData {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface RadiosProps extends Partial<RadioProps> {
	name: string;
	data: RadioData[];
	label?: string;
	required?: boolean;
	helperText?: string;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	radioGroupProps?: Partial<RadioGroupProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
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
		...restRadios
	} = props;

	const { errors, submitFailed, modified } = useFormState();
	const [errorState, setErrorState] = useState<string | null>(null);

	useEffect(() => {
		const showError = !!errors[name] && (submitFailed || (modified && modified[name]));
		setErrorState(showError ? errors[name] : null);
	}, [errors, submitFailed, modified, name]);

	return (
		<FormControl required={required} error={!!errorState} margin="normal" {...formControlProps}>
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
							<Field type="radio" name={name} {...fieldProps}>
								{({ input: { name, value, onChange, checked, ...restInput } }) => (
									<MuiRadio
										name={name}
										value={value}
										onChange={onChange}
										checked={checked}
										inputProps={{ required: required, ...restInput }}
										{...restRadios}
									/>
								)}
							</Field>
						}
						{...formControlLabelProps}
					/>
				))}
			</RadioGroup>
			{!!errorState ? (
				<FormHelperText {...formHelperTextProps}>{errorState}</FormHelperText>
			) : (
				!!helperText && <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>
			)}
		</FormControl>
	);
}
