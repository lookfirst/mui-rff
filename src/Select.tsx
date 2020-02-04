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
	} = props;

	if (!data && !children) {
		throw new Error('Please specify either children or data as an attribute to the Select component.');
	}

	const [error, setError] = useState(null);

	// This is primarily for supporting the variant="outlined", but does not seem to have a
	// negative effect on other variants, so it isn't being made conditional.
	// Fixes: https://github.com/lookfirst/mui-rff/issues/91
	const inputLabel = React.useRef<HTMLLabelElement>(null);
	const [labelWidth, setLabelWidth] = React.useState(0);
	React.useEffect(() => {
		setLabelWidth(inputLabel.current!.offsetWidth);
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

					return <SelectWrapper {...fieldRenderProps} labelWidth={labelWidth} />;
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
