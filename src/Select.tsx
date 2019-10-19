import {
	Select as MuiSelect,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
} from '@material-ui/core';
import { FormControlProps } from '@material-ui/core/FormControl';
import { SelectProps as MuiSelectProps } from '@material-ui/core/Select/Select';
import React from 'react';

import { Field, FieldRenderProps } from 'react-final-form';

export interface SelectData {
	label: string;
	value: string;
}

interface SelectProps {
	name: string;
	label: string;
	error: string;
	required: boolean;
	fieldProps?: FieldRenderProps<MuiSelectProps, HTMLSelectElement>;
	formControlProps?: FormControlProps;
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
		error,
		fieldProps,
		formControlProps,
	} = props;

	if (!data && !children) {
		throw new Error(
			'Please specify either children or data as an attribute to the Select component.'
		);
	}

	return (
		<FormControl
			required={required}
			error={!!error}
			margin="normal"
			fullWidth={true}
			{...formControlProps}
		>
			<InputLabel shrink htmlFor={name}>
				{label}
			</InputLabel>
			<Field component={SelectWrapper} name={name} {...fieldProps}>
				{data
					? data.map(item => (
							<MenuItem value={item.value} key={item.value}>
								{item.label}
							</MenuItem>
					  ))
					: { children }}
			</Field>
			{error ? <FormHelperText>{error}</FormHelperText> : <></>}
		</FormControl>
	);
}

function SelectWrapper(
	props: FieldRenderProps<MuiSelectProps, HTMLSelectElement>
) {
	const {
		input: { name, checked, onChange, ...restInput },
		meta,
		...rest
	} = props;
	return (
		<MuiSelect
			name={name}
			onChange={onChange}
			inputProps={restInput as any}
			{...rest}
		/>
	);
}
