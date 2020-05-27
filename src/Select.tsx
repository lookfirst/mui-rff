import React, { ReactNode } from 'react';

import {
	Select as MuiSelect,
	SelectProps as MuiSelectProps,
	FormControl,
	FormControlProps,
	FormHelperTextProps,
	InputLabel,
	InputLabelProps,
	MenuItem,
	MenuItemProps,
} from '@material-ui/core';

import { Field, FieldProps } from 'react-final-form';
import { ErrorMessage, showError, useFieldForErrors } from './Util';

export interface SelectData {
	label: string;
	value: string | number | string[] | undefined;
	disabled?: boolean;
}

export interface SelectProps extends Partial<Omit<MuiSelectProps, 'onChange'>> {
	name: string;
	label?: ReactNode;
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

	// This is for supporting the special case of variant="outlined"
	// Fixes: https://github.com/lookfirst/mui-rff/issues/91
	const { variant } = restSelectProps;
	const inputLabel = React.useRef<HTMLLabelElement>(null);
	const [labelWidthState, setLabelWidthState] = React.useState(0);
	React.useEffect(() => {
		if (label) {
			setLabelWidthState(inputLabel.current!.offsetWidth);
		}
	}, [label]);

	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<FormControl required={required} error={isError} fullWidth={true} variant={variant} {...formControlProps}>
			{!!label && (
				<InputLabel ref={inputLabel} htmlFor={name} {...inputLabelProps}>
					{label}
				</InputLabel>
			)}
			<Field
				name={name}
				render={({ input: { name, value, onChange, checked, ...restInput } }) => {
					// prevents an error that happens if you don't have initialValues defined in advance
					const finalValue = multiple && !value ? [] : value;

					return (
						<MuiSelect
							name={name}
							value={finalValue}
							onChange={onChange}
							multiple={multiple}
							label={label}
							labelWidth={variant === 'outlined' && !!label ? labelWidthState : labelWidth}
							inputProps={{ required, ...restInput }}
							{...restSelectProps}
						>
							{data
								? data.map((item) => (
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
					);
				}}
				{...fieldProps}
			/>
			<ErrorMessage
				showError={isError}
				meta={field.meta}
				formHelperTextProps={formHelperTextProps}
				helperText={helperText}
			/>
		</FormControl>
	);
}
