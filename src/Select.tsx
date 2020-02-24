import React, { useState } from 'react';

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

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

export interface SelectData {
	label: string;
	value: string;
}

export interface SelectProps extends Partial<MuiSelectProps> {
	name: string;
	label: string;
	required?: boolean;
	multiple?: boolean;
	fieldProps?: FieldProps<any, any>;
	formControlProps?: FormControlProps;
	inputLabelProps?: InputLabelProps;
	formHelperTextProps?: FormHelperTextProps;
	menuItemProps?: MenuItemProps;
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
		fieldProps,
		inputLabelProps,
		formControlProps,
		formHelperTextProps,
		menuItemProps,
		labelWidth,
		...restSelectProps
	} = props;

	if (!data && !children) {
		throw new Error('Please specify either children or data as an attribute to the Select component.');
	}

	const [error, setError] = useState(null);

	// This is for supporting the special case of variant="outlined"
	// Fixes: https://github.com/lookfirst/mui-rff/issues/91
	const { variant } = restSelectProps;
	const inputLabel = React.useRef<HTMLLabelElement>(null);
	const [labelWidthState, setLabelWidthState] = React.useState(0);
	React.useEffect(() => {
		setLabelWidthState(inputLabel.current!.offsetWidth);
	}, []);

	return (
		<FormControl required={required} error={!!error} margin="normal" fullWidth={true} {...formControlProps}>
			<InputLabel ref={inputLabel} htmlFor={name} {...inputLabelProps}>
				{label}
			</InputLabel>
			<Field
				render={fieldRenderProps => {
					const { meta, input } = fieldRenderProps;

					input.multiple = multiple;

					const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

					setError(showError ? meta.error : null);

					return (
						<SelectWrapper
							{...fieldRenderProps}
							labelWidth={variant === 'outlined' ? labelWidthState : labelWidth}
							{...restSelectProps}
						/>
					);
				}}
				name={name}
				{...fieldProps}
			>
				{data
					? data.map(item => (
							<MenuItem value={item.value} key={item.value} {...(menuItemProps as any)}>
								{item.label}
							</MenuItem>
					  ))
					: children}
			</Field>
			{error ? <FormHelperText {...formHelperTextProps}>{error}</FormHelperText> : <></>}
		</FormControl>
	);
}

function SelectWrapper(props: FieldRenderProps<MuiSelectProps, HTMLSelectElement>) {
	const {
		input: { name, checked, onChange, ...restInput },
		meta,
		...rest
	} = props;
	return <MuiSelect name={name} onChange={onChange} inputProps={restInput as any} {...rest} />;
}
