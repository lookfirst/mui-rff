import React, { useState } from 'react';

import {
	Radio as MuiRadio,
	RadioProps,
	RadioGroup,
	RadioGroupProps,
	FormControl,
	FormControlProps,
	FormControlLabel,
	FormControlLabelProps,
	FormHelperText,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
} from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

export interface RadioData {
	label: string;
	value: string;
}

export interface RadiosProps {
	label?: string;
	name: string;
	required?: boolean;
	data: RadioData[];
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	radioGroupProps?: Partial<RadioGroupProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
}

export function Radios(props: RadiosProps) {
	const {
		required,
		label,
		data,
		name,
		formLabelProps,
		fieldProps,
		formControlProps,
		formControlLabelProps,
		radioGroupProps,
		formHelperTextProps,
	} = props;

	const [error, setError] = useState(null);

	return (
		<FormControl required={required} error={!!error} margin="normal" {...formControlProps}>
			{label !== undefined ? <FormLabel {...formLabelProps}>{label}</FormLabel> : <></>}
			<RadioGroup {...radioGroupProps}>
				{data.map((item: RadioData, idx: number) => (
					<FormControlLabel
						key={idx}
						label={item.label}
						value={item.value}
						control={
							<Field
								render={fieldRenderProps => {
									const { meta } = fieldRenderProps;

									const showError =
										((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
										meta.touched;

									setError(showError ? fieldRenderProps.meta.error : null);

									return <RadioWrapper {...fieldRenderProps} />;
								}}
								type="radio"
								name={name}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</RadioGroup>
			{error ? <FormHelperText {...formHelperTextProps}>{error}</FormHelperText> : <></>}
		</FormControl>
	);
}

function RadioWrapper(props: FieldRenderProps<RadioProps, HTMLInputElement>) {
	const {
		input: { name, checked, value, onChange, ...restInput },
		meta,
		...rest
	} = props;
	return (
		<MuiRadio name={name} checked={checked} onChange={onChange} value={value} inputProps={restInput} {...rest} />
	);
}
