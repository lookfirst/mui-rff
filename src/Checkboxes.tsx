import {
	FormControl,
	FormControlLabel,
	type FormControlLabelProps,
	type FormControlProps,
	FormGroup,
	type FormGroupProps,
	type FormHelperTextProps,
	FormLabel,
	type FormLabelProps,
	Checkbox as MuiCheckbox,
	type CheckboxProps as MuiCheckboxProps,
} from '@mui/material';
import type React from 'react';
import { Field, type FieldProps } from 'react-final-form';

import {
	ErrorMessage,
	type ShowErrorFunc,
	showErrorOnChange,
	useFieldForErrors,
} from './Util';

export type CheckboxData = {
	label: string | number | React.ReactElement;
	value: unknown;
	disabled?: boolean;
	indeterminate?: boolean;
};

export interface CheckboxesProps
	extends Partial<Omit<MuiCheckboxProps, 'onChange'>> {
	name: string;
	data: CheckboxData | CheckboxData[];
	label?: string | number | React.ReactElement;
	required?: boolean;
	helperText?: React.ReactNode;
	fieldProps?: Partial<FieldProps<any, any>>;
	formControlProps?: Partial<FormControlProps>;
	formGroupProps?: Partial<FormGroupProps>;
	formLabelProps?: Partial<FormLabelProps>;
	formControlLabelProps?: Partial<FormControlLabelProps>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	showError?: ShowErrorFunc;
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
		showError = showErrorOnChange,
		...restCheckboxes
	} = props;

	const itemsData = Array.isArray(data) ? data : [data];
	const single = !Array.isArray(data);
	const field = useFieldForErrors(name);
	const isError = showError(field);

	return (
		<FormControl error={isError} required={required} {...formControlProps}>
			{label ? <FormLabel {...formLabelProps}>{label}</FormLabel> : null}
			<FormGroup {...formGroupProps}>
				{itemsData.map((item: CheckboxData) => (
					<FormControlLabel
						control={
							<Field
								name={name}
								render={({
									input: {
										name: inputName,
										value,
										onChange,
										checked,
										onBlur,
										onFocus,
										...restInput
									},
								}) => (
									<MuiCheckbox
										checked={checked}
										disabled={item.disabled}
										indeterminate={item.indeterminate}
										name={inputName}
										onChange={onChange}
										slotProps={{
											input: {
												required,
												onBlur,
												onFocus,
												...restInput,
											},
										}}
										value={value}
										{...restCheckboxes}
									/>
								)}
								type="checkbox"
								{...fieldProps}
							/>
						}
						disabled={item.disabled}
						key={`${name}${item.label}`}
						label={item.label}
						name={name}
						value={single ? undefined : item.value}
						{...formControlLabelProps}
					/>
				))}
			</FormGroup>
			<ErrorMessage
				formHelperTextProps={formHelperTextProps}
				helperText={helperText}
				meta={field.meta}
				showError={isError}
			/>
		</FormControl>
	);
}
