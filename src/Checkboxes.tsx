import React, { useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

import {
	Checkbox as MuiCheckbox,
	CheckboxProps as MuiCheckboxProps,
	FormControl,
	FormControlProps,
	FormControlLabel,
	FormControlLabelProps,
	FormGroup,
	FormGroupProps,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
} from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { ErrorMessage, ErrorState, makeErrorEffect } from './Util';

export interface CheckboxData {
	label: ReactNode;
	value: unknown;
	disabled?: boolean;
}

export interface CheckboxesProps extends Partial<Omit<MuiCheckboxProps, 'onChange'>> {
	name: string;
	data: CheckboxData | CheckboxData[];
	label?: ReactNode;
	required?: boolean;
	helperText?: string;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	formGroupProps?: Partial<FormGroupProps>;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
}

export function Checkboxes(props: CheckboxesProps) {
	const {
		required,
		label,
		data,
		name,
		helperText,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
		...restCheckboxes
	} = props;

	const [errorState, setErrorState] = useState<ErrorState>({ showError: false });

	const itemsData = !Array.isArray(data) ? [data] : data;
	const single = itemsData.length === 1;

	return (
		<FormControl required={required} error={errorState.showError} {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : <></>}
			<FormGroup {...formGroupProps}>
				{itemsData.map((item: CheckboxData, idx: number) => (
					<FormControlLabel
						key={idx}
						name={name}
						label={item.label}
						value={single ? undefined : item.value}
						disabled={item.disabled}
						control={
							<Field
								type="checkbox"
								name={name}
								render={({ input, meta }) => (
									<MuiCheckboxWrapperField
										input={input}
										meta={meta}
										setError={setErrorState}
										required={required}
										disabled={item.disabled}
										helperText={helperText}
										{...restCheckboxes}
									/>
								)}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</FormGroup>
			<ErrorMessage errorState={errorState} formHelperTextProps={formHelperTextProps} helperText={helperText} />
		</FormControl>
	);
}

interface MuiCheckboxWrapperFieldProps extends FieldRenderProps<Partial<MuiCheckboxProps>, HTMLElement> {
	setError: Dispatch<SetStateAction<ErrorState>>;
}

function MuiCheckboxWrapperField(props: MuiCheckboxWrapperFieldProps) {
	const {
		input: { name, value, onChange, checked, disabled, ...restInput },
		meta,
		helperText,
		required,
		setError,
		...restCheckboxes
	} = props;

	useEffect.apply(useEffect, makeErrorEffect({ meta, helperText, setError }) as any);

	return (
		<MuiCheckbox
			name={name}
			value={value}
			onChange={onChange}
			checked={checked}
			disabled={disabled}
			inputProps={{ required, ...restInput }}
			{...restCheckboxes}
		/>
	);
}
