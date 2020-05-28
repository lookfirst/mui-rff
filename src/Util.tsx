import React from 'react';

import { FormHelperText, FormHelperTextProps } from '@material-ui/core';
import { FieldMetaState, useField } from 'react-final-form';

export interface ErrorMessageProps {
	showError: boolean;
	meta: FieldMetaState<any>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	helperText?: string;
}

export function ErrorMessage({ showError, meta, formHelperTextProps, helperText }: ErrorMessageProps) {
	if (showError) {
		return <FormHelperText {...formHelperTextProps}>{meta.error || meta.submitError}</FormHelperText>;
	} else if (!!helperText) {
		return <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>;
	} else {
		return <></>;
	}
}

export interface ShowErrorProps {
	meta: FieldMetaState<any>;
}

const config = {
	subscription: {
		error: true,
		submitError: true,
		dirtySinceLastSubmit: true,
		touched: true,
		modified: true,
	},
};

export function useFieldForErrors(name: string) {
	return useField(name, config);
}

export function showErrorOnChange({
	meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
}: ShowErrorProps) {
	return !!(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));
}

export function showErrorOnBlur({ meta: { submitError, dirtySinceLastSubmit, error, touched } }: ShowErrorProps) {
	return !!(((submitError && !dirtySinceLastSubmit) || error) && touched);
}
