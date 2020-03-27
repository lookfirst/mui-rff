import React from 'react';

import { FormHelperText, FormHelperTextProps } from '@material-ui/core';

export interface ErrorState {
	showError: boolean;
	message?: string;
}

export interface ErrorMessageProps {
	errorState: ErrorState;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	helperText?: string;
}

export function ErrorMessage({ errorState, formHelperTextProps, helperText }: ErrorMessageProps) {
	if (errorState.showError) {
		return <FormHelperText {...formHelperTextProps}>{errorState.message}</FormHelperText>;
	} else if (!!helperText) {
		return <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>;
	} else {
		return <></>;
	}
}
