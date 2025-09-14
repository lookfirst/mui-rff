import {
	FormControl,
	type FormControlProps,
	type FormHelperTextProps,
	InputLabel,
	type InputLabelProps,
	MenuItem,
	type MenuItemProps,
	Select as MuiSelect,
	type SelectProps as MuiSelectProps,
} from '@mui/material';
import type React from 'react';
import type { ReactNode } from 'react';
import { Field, type FieldProps } from 'react-final-form';

import {
	ErrorMessage,
	type ShowErrorFunc,
	showErrorOnChange,
	useFieldForErrors,
} from './Util';

export type SelectData = {
	label: string | number | React.ReactElement;
	value: string | number | string[] | undefined;
	disabled?: boolean;
};

export interface SelectProps extends Partial<Omit<MuiSelectProps, 'onChange'>> {
	name: string;
	label?: string | number | React.ReactElement;
	required?: boolean;
	multiple?: boolean;
	helperText?: React.ReactNode;
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

	if (!(data || children)) {
		throw new Error(
			'Please specify either children or data as an attribute.'
		);
	}

	const { variant } = restSelectProps;
	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<Field
			name={name}
			render={({
				input: { name: inputName, value, onChange, ...restInput },
			}) => {
				// prevents an error that happens if you don't have initialValues defined in advance
				const finalValue = multiple && !value ? [] : value;
				const labelId = `select-input-${name}`;

				return (
					<FormControl
						error={isError}
						fullWidth={true}
						required={required}
						variant={variant}
						{...formControlProps}
					>
						{!!label && (
							<InputLabel id={labelId} {...inputLabelProps}>
								{label}
							</InputLabel>
						)}
						<MuiSelect
							inputProps={{ required, ...restInput }}
							label={label}
							labelId={labelId}
							multiple={multiple}
							name={inputName}
							onChange={onChange}
							value={finalValue}
							{...restSelectProps}
						>
							{data
								? data.map((item) => (
										<MenuItem
											disabled={item.disabled}
											key={`${item.value}${item.label}`}
											value={item.value}
											{...(menuItemProps as any)}
										>
											{item.label}
										</MenuItem>
									))
								: children}
						</MuiSelect>
						<ErrorMessage
							formHelperTextProps={formHelperTextProps}
							helperText={helperText}
							meta={field.meta}
							showError={isError}
						/>
					</FormControl>
				);
			}}
			{...fieldProps}
		/>
	);
}
