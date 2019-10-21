import {
	Checkbox as MuiCheckbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
} from '@material-ui/core';
import { CheckboxProps } from '@material-ui/core/Checkbox';
import { FormControlProps } from '@material-ui/core/FormControl';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { FormGroupProps } from '@material-ui/core/FormGroup';
import { FormHelperTextProps } from '@material-ui/core/FormHelperText';
import { FormLabelProps } from '@material-ui/core/FormLabel';
import React from 'react';

import { Field, FieldRenderProps } from 'react-final-form';

export interface CheckboxData {
	label: string;
	value: string;
}

export interface CheckboxesProps {
	required: boolean;
	label: string;
	name: string;
	data: CheckboxData[];
	error?: string;
	fieldProps?: FieldRenderProps<CheckboxProps, HTMLInputElement>;
	formControlProps?: FormControlProps;
	formGroupProps?: FormGroupProps;
	formLabelProps?: FormLabelProps;
	formControlLabelProps?: FormControlLabelProps;
	formHelperTextProps?: FormHelperTextProps;
}

export function Checkboxes(props: CheckboxesProps) {
	const {
		required,
		label,
		data,
		name,
		error,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
	} = props;

	return (
		<FormControl
			required={required}
			error={!!error}
			margin="normal"
			{...formControlProps}
		>
			<FormLabel {...formLabelProps}>{label}</FormLabel>
			<FormGroup {...formGroupProps}>
				{data.map((item: CheckboxData, idx: number) => (
					<FormControlLabel
						key={idx}
						label={item.label}
						value={item.value}
						control={
							<Field
								component={CheckboxWrapper}
								type="checkbox"
								name={name}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</FormGroup>
			{error ? (
				<FormHelperText {...formHelperTextProps}>{error}</FormHelperText>
			) : (
				<></>
			)}
		</FormControl>
	);
}

function CheckboxWrapper(
	props: FieldRenderProps<CheckboxProps, HTMLInputElement>
) {
	const {
		input: { name, checked, onChange, ...restInput },
		meta,
		...rest
	} = props;
	return (
		<MuiCheckbox
			name={name}
			checked={checked}
			onChange={onChange}
			inputProps={restInput as any}
			{...rest}
		/>
	);
}
