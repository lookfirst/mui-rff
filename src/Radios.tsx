import {
	Radio as MuiRadio,
	RadioGroup,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
} from '@material-ui/core';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { FormHelperTextProps } from '@material-ui/core/FormHelperText';
import { FormLabelProps } from '@material-ui/core/FormLabel';
import { RadioProps } from '@material-ui/core/Radio';
import { FormControlProps } from '@material-ui/core/FormControl';
import { RadioGroupProps } from '@material-ui/core/RadioGroup';
import React from 'react';

import { Field, FieldRenderProps } from 'react-final-form';

export interface RadioData {
	label: string;
	value: string;
}

export interface RadiosProps {
	required: boolean;
	label: string;
	name: string;
	data: RadioData[];
	error?: string;
	formLabelProps?: FormLabelProps;
	formControlLabelProps?: FormControlLabelProps;
	fieldProps?: FieldRenderProps<RadioProps, HTMLInputElement>;
	formControlProps?: FormControlProps;
	radioGroupProps?: RadioGroupProps;
	formHelperTextProps?: FormHelperTextProps;
}

export function Radios(props: RadiosProps) {
	const {
		required,
		label,
		data,
		name,
		error,
		formLabelProps,
		fieldProps,
		formControlProps,
		formControlLabelProps,
		radioGroupProps,
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
			<RadioGroup {...radioGroupProps}>
				{data.map((item: RadioData, idx: number) => (
					<FormControlLabel
						key={idx}
						label={item.label}
						value={item.value}
						control={
							<Field
								component={RadioWrapper}
								type="radio"
								name={name}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</RadioGroup>
			{error ? (
				<FormHelperText {...formHelperTextProps}>{error}</FormHelperText>
			) : (
				<></>
			)}
		</FormControl>
	);
}

function RadioWrapper(props: FieldRenderProps<RadioProps, HTMLInputElement>) {
	const {
		input: { name, checked, onChange, ...restInput },
		meta,
		...rest
	} = props;
	return (
		<MuiRadio
			name={name}
			checked={checked}
			onChange={onChange}
			inputProps={restInput as any}
			{...rest}
		/>
	);
}
