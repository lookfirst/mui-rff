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
import { ErrorMessage, showErrorOnChange, useFieldForErrors, ShowErrorFunc } from './Util';

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
	showError?: ShowErrorFunc;
	menuItemProps?: Partial<MenuItemProps>;
	data?: SelectData[];
	children?: ReactNode;
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
		showError = showErrorOnChange,
		...restSelectProps
	} = props;

	if (!data && !children) {
		throw new Error('Please specify either children or data as an attribute.');
	}

	const { variant } = restSelectProps;
	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<Field
			name={name}
			render={({ input: { name, value, onChange, ...restInput } }) => {
				// prevents an error that happens if you don't have initialValues defined in advance
				const finalValue = multiple && !value ? [] : value;
				const labelId = `select-input-${name}`;

				return (
					<FormControl
						required={required}
						error={isError}
						fullWidth={true}
						variant={variant}
						{...formControlProps}
					>
						{!!label && (
							<InputLabel id={labelId} {...inputLabelProps}>
								{label}
							</InputLabel>
						)}
						<MuiSelect
							name={name}
							value={finalValue}
							onChange={onChange}
							multiple={multiple}
							label={label}
							labelId={labelId}
							inputProps={{ required, ...restInput }}
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
						<ErrorMessage
							showError={isError}
							meta={field.meta}
							formHelperTextProps={formHelperTextProps}
							helperText={helperText}
						/>
					</FormControl>
				);
			}}
			{...fieldProps}
		/>
	);
}
