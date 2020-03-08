import React, { useEffect, useState } from 'react';

import {
	Select as MuiSelect,
	SelectProps as MuiSelectProps,
	FormControl,
	FormControlProps,
	FormHelperText,
	FormHelperTextProps,
	InputLabel,
	InputLabelProps,
	MenuItem,
	MenuItemProps,
} from '@material-ui/core';

import { Field, FieldProps, useFormState } from 'react-final-form';

export interface SelectData {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface SelectProps extends Partial<MuiSelectProps> {
	name: string;
	label: string;
	required?: boolean;
	multiple?: boolean;
	helperText?: string;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	inputLabelProps?: Partial<InputLabelProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	menuItemProps?: Partial<MenuItemProps>;
	data?: SelectData[];
	children?: React.ReactElement | React.ReactElement[];
}

export function Select(props: SelectProps) {
	const {
		name,
		label,
		data,
		children,
		required,
		multiple,
		helperText,
		fieldProps,
		inputLabelProps,
		formControlProps,
		formHelperTextProps,
		menuItemProps,
		labelWidth,
		...restSelectProps
	} = props;

	if (!data && !children) {
		throw new Error('Please specify either children or data as an attribute.');
	}

	const { errors, submitFailed, modified } = useFormState();
	const [errorState, setErrorState] = useState<string | null>(null);

	useEffect(() => {
		const showError = !!errors[name] && (submitFailed || (modified && modified[name]));
		setErrorState(showError ? errors[name] : null);
	}, [errors, submitFailed, modified, name]);

	// This is for supporting the special case of variant="outlined"
	// Fixes: https://github.com/lookfirst/mui-rff/issues/91
	const { variant } = restSelectProps;
	const inputLabel = React.useRef<HTMLLabelElement>(null);
	const [labelWidthState, setLabelWidthState] = React.useState(0);
	React.useEffect(() => {
		setLabelWidthState(inputLabel.current!.offsetWidth);
	}, []);

	return (
		<FormControl required={required} error={!!errorState} margin="normal" fullWidth={true} {...formControlProps}>
			{!!label && (
				<InputLabel ref={inputLabel} htmlFor={name} {...inputLabelProps}>
					{label}
				</InputLabel>
			)}
			<Field name={name} {...fieldProps}>
				{({ input: { name, value, onChange, ...restInput } }) => (
					<MuiSelect
						name={name}
						value={value}
						onChange={onChange}
						multiple={multiple}
						labelWidth={variant === 'outlined' ? labelWidthState : labelWidth}
						inputProps={{ required: required, ...restInput }}
						{...restSelectProps}
					>
						{data
							? data.map(item => (
									<MenuItem
										value={item.value}
										key={item.value}
										disabled={item.disabled}
										{...(menuItemProps as any)}
									>
										{item.label}
									</MenuItem>
							  ))
							: children}
					</MuiSelect>
				)}
			</Field>
			{!!errorState ? (
				<FormHelperText {...formHelperTextProps}>{errorState}</FormHelperText>
			) : (
				!!helperText && <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>
			)}
		</FormControl>
	);
}
