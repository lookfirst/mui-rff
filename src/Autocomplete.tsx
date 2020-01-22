import React, { ChangeEvent } from 'react';

import { Field, FieldRenderProps, FieldProps } from 'react-final-form';

import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import {
	default as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
	RenderInputParams as MuiAutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';

export type AutocompleteData = {
	[key: string]: any;
};

interface AutocompleteProps extends Partial<MuiAutocompleteProps> {
	name: string;
	label: string;
	required?: boolean;
	getOptionValue: (option: any) => any;
	options: AutocompleteData[];
	fieldProps?: FieldProps<any, any>;
	textFieldProps?: Partial<MuiTextFieldProps>;
}

export const Autocomplete = (props: AutocompleteProps) => {
	const { name, fieldProps, ...rest } = props;

	return (
		<Field
			name={name}
			render={fieldRenderProps => <AutocompleteWrapper {...fieldRenderProps} {...rest} />}
			{...fieldProps}
		/>
	);
};

interface MuiRffAutocompleteProps extends FieldRenderProps<MuiTextFieldProps, HTMLElement> {
	label: string;
	required?: boolean;
	multiple?: boolean;
	textFieldProps?: Partial<MuiTextFieldProps>;
	getOptionValue: (option: any) => any;
}

const AutocompleteWrapper = (props: MuiRffAutocompleteProps) => {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		label,
		required,
		multiple,
		textFieldProps,
		getOptionValue,
		...rest
	} = props;

	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
	const { variant, ...restTextFieldProps } = (textFieldProps as any) || {};

	return (
		<MuiAutocomplete
			multiple={multiple}
			onChange={
				multiple
					? (_e: ChangeEvent<{}>, values: any[]): void => {
							onChange(values.map(getOptionValue));
					  }
					: (_e: ChangeEvent<{}>, option: any): void => {
							option ? onChange(getOptionValue(option)) : onChange(undefined);
					  }
			}
			renderInput={(params: MuiAutocompleteRenderInputParams) => (
				<TextField
					label={label}
					required={required}
					margin="normal"
					fullWidth
					error={showError}
					helperText={showError ? meta.error || meta.submitError : undefined}
					variant={variant}
					{...params}
					{...restInput}
					{...restTextFieldProps}
				/>
			)}
			{...rest}
		/>
	);
};
