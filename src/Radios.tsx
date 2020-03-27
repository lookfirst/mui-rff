import React, { useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';

import {
	Radio as MuiRadio,
	RadioProps as MuiRadioProps,
	RadioGroup,
	RadioGroupProps,
	FormControl,
	FormControlProps,
	FormControlLabel,
	FormControlLabelProps,
	FormHelperTextProps,
	FormLabel,
	FormLabelProps,
} from '@material-ui/core';

import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { ErrorMessage, ErrorState } from './Util';

export interface RadioData {
	label: ReactNode;
	value: unknown;
	disabled?: boolean;
}

export interface RadiosProps extends Partial<Omit<MuiRadioProps, 'onChange'>> {
	name: string;
	data: RadioData[];
	label?: ReactNode;
	required?: boolean;
	helperText?: string;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	radioGroupProps?: Partial<RadioGroupProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
}

export function Radios(props: RadiosProps) {
	const {
		name,
		data,
		label,
		required,
		helperText,
		formLabelProps,
		formControlLabelProps,
		fieldProps,
		formControlProps,
		radioGroupProps,
		formHelperTextProps,
		...restRadios
	} = props;

	const [errorState, setErrorState] = useState<ErrorState>({ showError: false });

	return (
		<FormControl required={required} error={errorState.showError} {...formControlProps}>
			{!!label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
			<RadioGroup {...radioGroupProps}>
				{data.map((item: RadioData, idx: number) => (
					<FormControlLabel
						key={idx}
						name={name}
						label={item.label}
						value={item.value}
						disabled={item.disabled}
						control={
							<Field
								name={name}
								type="radio"
								render={({ input, meta }) => (
									<MuiRadioWrapper
										input={input}
										meta={meta}
										setError={setErrorState}
										required={required}
										disabled={item.disabled}
										helperText={helperText}
										{...restRadios}
									/>
								)}
								{...fieldProps}
							/>
						}
						{...formControlLabelProps}
					/>
				))}
			</RadioGroup>
			<ErrorMessage errorState={errorState} formHelperTextProps={formHelperTextProps} helperText={helperText} />
		</FormControl>
	);
}

interface MuiRadioWrapperProps extends FieldRenderProps<Partial<MuiRadioProps>, HTMLInputElement> {
	setError: Dispatch<SetStateAction<ErrorState>>;
}

function MuiRadioWrapper(props: MuiRadioWrapperProps) {
	const {
		input: { name, value, onChange, checked, disabled, ...restInput },
		meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
		helperText,
		required,
		setError,
		...rest
	} = props;

	useEffect(() => {
		const showError = !!(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));
		setError({ showError: showError, message: showError ? error || submitError : helperText });
	}, [setError, submitError, dirtySinceLastSubmit, error, touched, helperText, modified]);

	return (
		<MuiRadio
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
