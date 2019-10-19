import {
	Radio as MuiRadio,
	RadioGroup,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
} from '@material-ui/core';
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
	error: string;
	fieldProps?: FieldRenderProps<RadioProps, HTMLInputElement>;
	formControlProps?: FormControlProps;
	radioGroupProps?: RadioGroupProps;
}

export function Radios(props: RadiosProps) {
	const {
		required,
		label,
		data,
		name,
		error,
		fieldProps,
		formControlProps,
		radioGroupProps,
	} = props;

	return (
		<FormControl
			required={required}
			error={!!error}
			margin="normal"
			{...formControlProps}
		>
			<FormLabel>{label}</FormLabel>
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
					/>
				))}
			</RadioGroup>
			{error ? <FormHelperText>{error}</FormHelperText> : <></>}
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
