import { FormHelperText, type FormHelperTextProps } from '@mui/material';
import React from 'react';
import { type FieldRenderProps, useField } from 'react-final-form';

type FieldMetaState<FieldValue> = FieldRenderProps<FieldValue>['meta'];

export interface ErrorMessageProps {
	showError: boolean;
	meta: FieldMetaState<any>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	helperText?: React.ReactNode;
}

export function ErrorMessage({ showError, meta, formHelperTextProps, helperText }: ErrorMessageProps) {
	if (showError) {
		return <FormHelperText {...formHelperTextProps}>{meta.error || meta.submitError}</FormHelperText>;
	} else if (helperText) {
		return <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>;
	} else {
		return <></>;
	}
}

export type ShowErrorFunc = (props: ShowErrorProps) => boolean;

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

export const useFieldForErrors = (name: string) => useField(name, config);

export const showErrorOnChange: ShowErrorFunc = ({
	meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
}: ShowErrorProps) => !!(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));

export const showErrorOnBlur: ShowErrorFunc = ({
	meta: { submitError, dirtySinceLastSubmit, error, touched },
}: ShowErrorProps) => !!(((submitError && !dirtySinceLastSubmit) || error) && touched);
