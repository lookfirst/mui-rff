import React, { ReactNode } from 'react';

import {
	FormHelperTextProps,
	ToggleButtonGroup as MuiToggleButtonGroup,
	ToggleButtonGroupProps as MuiToggleButtonGroupProps,
} from '@mui/material';

import { ErrorMessage, ShowErrorFunc, showErrorOnChange, useFieldForErrors } from './Util';
import { Field } from 'react-final-form';

export interface ToggleButtonGroupProps extends Partial<Omit<MuiToggleButtonGroupProps, 'onChange'>> {
	name: string;
	helperText?: string;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	showError?: ShowErrorFunc;
	children?: ReactNode;
}

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
	const {
		name,
		helperText,
		formHelperTextProps,
		children,
		fullWidth = true,
		showError = showErrorOnChange,
		...restToggleButtonGroupProps
	} = props;

	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<Field name={name}>
			{(fieldProps) => {
				return (
					<>
						<MuiToggleButtonGroup
							value={fieldProps.input.value}
							fullWidth={fullWidth}
							disabled={props.disabled}
							onChange={(_, value) => {
								fieldProps.input.onChange(value);
							}}
							{...restToggleButtonGroupProps}
						>
							{children}
						</MuiToggleButtonGroup>
						<ErrorMessage
							showError={isError}
							meta={field.meta}
							formHelperTextProps={formHelperTextProps}
							helperText={helperText}
						/>
					</>
				);
			}}
		</Field>
	);
}
