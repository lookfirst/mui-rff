import React, { useState, ReactNode } from 'react';

import {
	Checkbox as MuiCheckbox,
	CheckboxProps as MuiCheckboxProps,
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

export interface CheckboxData {
	label: ReactNode;
	value: any;
}

export interface CheckboxesProps extends Partial<MuiCheckboxProps> {
	label?: string;
	name: string;
	required?: boolean;
	data: CheckboxData | CheckboxData[];
	fieldProps?: FieldProps<any, any>;
	formControlProps?: FormControlProps;
	formGroupProps?: FormGroupProps;
	formLabelProps?: FormLabelProps;
	formControlLabelProps?: FormControlLabelProps;
	formHelperTextProps?: FormHelperTextProps;
}

interface CheckboxFormControlLabelProps {
	name: string;
	item: CheckboxData;
	single: boolean;
	required: boolean;
	setError: any;
	fieldProps?: FieldProps<any, any>;
	formControlLabelProps?: FormControlLabelProps;
}

function CheckboxFormControlLabel(props: CheckboxFormControlLabelProps) {
	const { name, single, item, required, setError, fieldProps, formControlLabelProps } = props;

	return (
		<FormControlLabel
			label={item.label}
			value={single ? undefined : item.value}
			control={
				<Field
					render={(fieldRenderProps: FieldRenderProps<MuiCheckboxProps, HTMLInputElement>) => {
						const { meta } = fieldRenderProps;

						const showError =
							((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

						setError(showError ? meta.error : null);

						return <CheckboxWrapper {...fieldRenderProps} required={required} />;
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

type CheckboxWrapperProps = FieldRenderProps<MuiCheckboxProps, HTMLInputElement>;

function CheckboxWrapper(props: CheckboxWrapperProps) {
	const {
		input: { name, checked, onChange, ...restInput },
		meta, // pull out meta as we don't need to dump it into the object
		...rest
	} = props;

	return <MuiCheckbox {...rest} name={name} inputProps={restInput as any} checked={checked} onChange={onChange} />;
}

export function Checkboxes(props: CheckboxesProps) {
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
				{(itemData as any).map((item: CheckboxData, idx: number) => (
					<CheckboxFormControlLabel
						name={name}
						single={dataIsOneItem}
						fieldProps={fieldProps}
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
