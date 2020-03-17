import React, { useState, useEffect, ReactNode } from 'react';

import {
	Checkbox as MuiCheckbox,
	CheckboxProps as MuiCheckboxProps,
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

export interface CheckboxData {
	label: ReactNode;
	value: unknown;
	disabled?: boolean;
}

export interface CheckboxesProps extends Partial<Omit<MuiCheckboxProps, 'onChange'>> {
	name: string;
	data: CheckboxData | CheckboxData[];
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

export function Checkboxes(props: CheckboxesProps) {
	const {
		required,
		label,
		data,
		name,
		helperText,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
		...restCheckboxes
	} = props;

	const formState = useFormState();
	const { errors, submitErrors, submitFailed, modified } = formState;
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
				{itemsData.map((item: CheckboxData, idx: number) => (
					<FormControlLabel
						key={idx}
						name={name}
						label={item.label}
						value={single ? undefined : item.value}
						disabled={item.disabled}
						control={
							<Field type="checkbox" name={name} {...fieldProps}>
								{({ input: { name, value, onChange, checked, ...restInput } }) => (
									<MuiCheckbox
										name={name}
										value={value}
										onChange={onChange}
										checked={checked}
										inputProps={{ required: required, ...restInput }}
										{...restCheckboxes}
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
