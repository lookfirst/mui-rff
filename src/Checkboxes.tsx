import {
	Checkbox as MuiCheckbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
} from '@material-ui/core';
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
	error: string;
}

export function Checkboxes(props: CheckboxesProps) {
	const { required, label, data, name, error } = props;

	return (
		<FormControl required={required} error={!!error} component="fieldset">
			<FormLabel component="legend">{label}</FormLabel>
			<FormGroup>
				{data.map((item: CheckboxData, idx: number) => (
					<FormControlLabel
						key={idx}
						label={item.label}
						control={
							<Field
								component={CheckboxWrapper}
								type="checkbox"
								name={name}
								value={item.value}
							/>
						}
					/>
				))}
			</FormGroup>
			<FormHelperText>{error}</FormHelperText>
		</FormControl>
	);
}

function CheckboxWrapper(props: FieldRenderProps<string, HTMLInputElement>) {
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
			inputProps={restInput}
			{...rest}
		/>
	);
}
