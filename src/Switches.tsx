import React, { useState, ReactNode } from 'react';

import {
	Switch as MuiSwitch,
	SwitchProps as MuiSwitchProps,
	FormControl,
	FormControlProps,
	FormControlLabel,
	FormControlLabelProps,
	FormGroup,
	FormGroupProps,
	FormHelperText,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
} from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

export interface SwitchData {
	label: ReactNode;
	value: any;
}

export interface SwitchesProps extends Partial<MuiSwitchProps> {
	label?: string;
	name: string;
	required?: boolean;
	data: SwitchData | SwitchData[];
	fieldProps?: FieldProps<any, any>;
	formControlProps?: FormControlProps;
	formGroupProps?: FormGroupProps;
	formLabelProps?: FormLabelProps;
	formControlLabelProps?: FormControlLabelProps;
	formHelperTextProps?: FormHelperTextProps;
}

interface SwitchFormControlLabelProps {
	name: string;
	item: SwitchData;
	single: boolean;
	required: boolean;
	setError: any;
	fieldProps?: FieldProps<any, any>;
	formControlLabelProps?: FormControlLabelProps;
}

function SwitchFormControlLabel(props: SwitchFormControlLabelProps) {
	const { name, single, item, required, setError, fieldProps, formControlLabelProps } = props;

	return (
		<FormControlLabel
			label={item.label}
			value={single ? undefined : item.value}
			control={
				<Field
					render={(fieldRenderProps: FieldRenderProps<MuiSwitchProps, HTMLInputElement>) => {
						const { meta } = fieldRenderProps;

						const showError =
							((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

						setError(showError ? meta.error : null);

						return <SwitchWrapper {...fieldRenderProps} required={required} />;
					}}
					type="checkbox"
					name={name}
					{...fieldProps}
				/>
			}
			{...formControlLabelProps}
		/>
	);
}

type SwitchWrapperProps = FieldRenderProps<MuiSwitchProps, HTMLInputElement>;

function SwitchWrapper(props: SwitchWrapperProps) {
	const {
		input: { name, checked, onChange, ...restInput },
		meta, // pull out meta as we don't need to dump it into the object
		...rest
	} = props;

	return <MuiSwitch {...rest} name={name} inputProps={restInput as any} checked={checked} onChange={onChange} />;
}

export function Switches(props: SwitchesProps) {
	const {
		required,
		label,
		data,
		name,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
	} = props;

	const [error, setError] = useState(null);

	const isArray = Array.isArray(data);
	const dataIsOneItem = !isArray || (isArray && (data as any).length === 1);

	// This works around the fact that we can pass in a single item
	let itemData = data;
	if (!isArray) {
		itemData = [data] as any;
	}

	return (
		<FormControl required={required} error={!!error} margin="normal" {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : <></>}
			<FormGroup {...formGroupProps}>
				{(itemData as any).map((item: SwitchData, idx: number) => (
					<SwitchFormControlLabel
						name={name}
						single={dataIsOneItem}
						fieldProps={fieldProps as any}
						formControlLabelProps={formControlLabelProps}
						item={item}
						setError={setError}
						key={idx}
						required={!!required}
					/>
				))}
			</FormGroup>
			{error ? <FormHelperText {...formHelperTextProps}>{error}</FormHelperText> : <></>}
		</FormControl>
	);
}
