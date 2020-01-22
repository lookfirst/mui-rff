import React, { ChangeEvent } from 'react';

import { Field, FieldRenderProps, FieldProps } from 'react-final-form';

import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { default as MuiAutocomplete, AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';

export type AutocompleteData = {
	[key: string]: any;
};

interface AutocompleteProps extends Partial<MuiAutocompleteProps> {
	name: string;
	label: string;
	getOptionValue: (option: any) => any;
	options: AutocompleteData[];
	required?: boolean;
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
	multiple?: boolean;
	textFieldProps?: Partial<MuiTextFieldProps>;
	getOptionValue: (option: any) => any;
}

const AutocompleteWrapper = (props: MuiRffAutocompleteProps) => {
	const {
		input: { name, onChange, value, ...restInput },
		meta,
		label,
		multiple,
		textFieldProps,
		getOptionValue,
		...rest
	} = props;

	const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
	const { variant, ...restTextFieldProps } = (textFieldProps as any) || {};

	return (
		<MuiAutocomplete
			{...rest}
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
			renderInput={params => (
				<TextField
					label={label}
					fullWidth
					margin="normal"
					error={showError}
					helperText={showError ? meta.error || meta.submitError : undefined}
					variant={variant}
					{...params}
					{...restInput}
					{...restTextFieldProps}
				/>
			)}
		/>
	);
};
