import React, { useEffect, useState, ReactNode } from 'react';

import {
	Radio as MuiRadio,
	RadioProps as MuiRadioProps,
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

import { Field, FieldProps, useFormState, useForm } from 'react-final-form';

export interface RadioData {
	label: ReactNode;
	value: string;
	disabled?: boolean;
}

export interface RadiosProps extends Partial<Omit<MuiRadioProps, 'onChange'>> {
	name: string;
	data: RadioData[];
	label?: ReactNode;
	required?: boolean;
	helperText?: string;
	onChange?: (value: MuiRadioProps['value'], previousValue: MuiRadioProps['value'] | undefined) => void;
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
		onChange,
		formLabelProps,
		formControlLabelProps,
		fieldProps,
		formControlProps,
		radioGroupProps,
		formHelperTextProps,
		...restRadios
	} = props;

	const { errors, submitErrors, submitFailed, modified } = useFormState();
	const { getFieldState } = useForm();
	const [errorState, setErrorState] = useState<string | null>(null);

	useEffect(() => {
		const showError = (!!errors[name] || !!submitErrors) && (submitFailed || (modified && modified[name]));
		setErrorState(showError ? errors[name] || submitErrors[name] : null);
	}, [errors, submitErrors, submitFailed, modified, name]);

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
								{({ input: { name, value, onChange: rffOnChange, checked, ...restInput } }) => (
									<MuiRadio
										name={name}
										value={value}
										onChange={e => {
											const previousValue = getFieldState(name)!.value;
											rffOnChange(e);
											if (onChange) onChange(getFieldState(name)!.value, previousValue);
										}}
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
