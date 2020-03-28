import React, { useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

import {
	Switch as MuiSwitch,
	SwitchProps as MuiSwitchProps,
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

export interface SwitchData {
	label: ReactNode;
	value: unknown;
	disabled?: boolean;
}

export interface SwitchesProps extends Partial<Omit<MuiSwitchProps, 'onChange'>> {
	name: string;
	data: SwitchData | SwitchData[];
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

export function Switches(props: SwitchesProps) {
	const {
		name,
		data,
		label,
		required,
		helperText,
		fieldProps,
		formControlProps,
		formGroupProps,
		formLabelProps,
		formControlLabelProps,
		formHelperTextProps,
		...restSwitches
	} = props;

	const [errorState, setErrorState] = useState<ErrorState>({ showError: false });

	const itemsData = !Array.isArray(data) ? [data] : data;
	const single = itemsData.length === 1;

	return (
		<FormControl required={required} error={errorState.showError} {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : <></>}
			<FormGroup {...formGroupProps}>
				{itemsData.map((item: SwitchData, idx: number) => (
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
									<MuiSwitchWrapper
										input={input}
										meta={meta}
										setError={setErrorState}
										required={required}
										disabled={item.disabled}
										helperText={helperText}
										{...restSwitches}
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

interface MuiSwitchWrapperProps extends FieldRenderProps<Partial<MuiSwitchProps>, HTMLInputElement> {
	setError: Dispatch<SetStateAction<ErrorState>>;
}

function MuiSwitchWrapper(props: MuiSwitchWrapperProps) {
	const {
		input: { name, value, onChange, checked, disabled, ...restInput },
		meta,
		helperText,
		required,
		setError,
		...rest
	} = props;

	useEffect.apply(useEffect, makeErrorEffect({ meta, helperText, setError }) as any);

	return (
		<MuiSwitch
			name={name}
			value={value}
			onChange={onChange}
			checked={checked}
			disabled={disabled}
			required={required}
			inputProps={{ required, ...restInput }}
			{...rest}
		/>
	);
}
