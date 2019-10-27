import { Select as MuiSelect, FormControl, FormHelperText, InputLabel, MenuItem } from '@material-ui/core';
import { FormControlProps } from '@material-ui/core/FormControl';
import { FormHelperTextProps } from '@material-ui/core/FormHelperText';
import { InputLabelProps } from '@material-ui/core/InputLabel';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import { SelectProps as MuiSelectProps } from '@material-ui/core/Select/Select';
import React, { useState } from 'react';

import { Field, FieldRenderProps } from 'react-final-form';

export interface SelectData {
	label: string;
	value: string;
}

interface SelectProps {
	name: string;
	label: string;
	required?: boolean;
	fieldProps?: FieldRenderProps<MuiSelectProps, HTMLSelectElement>;
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
	const [formValue, setFormValue] = useState(null);

	return (
		<FormControl required={required} error={!!error} margin="normal" fullWidth={true} {...formControlProps}>
			{/*shrink keeps the label visible when there is an empty value and removes the label from the dropdown*/}
			<InputLabel shrink={!!formValue} htmlFor={name} {...inputLabelProps}>
				{label}
			</InputLabel>
			<Field
				render={fieldRenderProps => {
					const { meta } = fieldRenderProps;

					const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

					setError(showError ? fieldRenderProps.meta.error : null);
					setFormValue(fieldRenderProps.input.value);

					return <SelectWrapper {...fieldRenderProps} />;
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
