import React, { Dispatch, SetStateAction } from 'react';

import { FormHelperText, FormHelperTextProps } from '@material-ui/core';
import { FieldMetaState } from 'react-final-form';

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

export interface makeErrorEffectProps {
	meta: FieldMetaState<any>;
	setError: Dispatch<SetStateAction<ErrorState>>;
	helperText?: string;
}

export function makeErrorEffect({
	meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
	setError,
	helperText,
}: makeErrorEffectProps) {
	return [
		() => {
			const showError = !!(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));
			setError({ showError: showError, message: showError ? error || submitError : helperText });
		},
		[setError, submitError, dirtySinceLastSubmit, error, touched, helperText, modified],
	];
}

export interface showErrorProps {
	meta: FieldMetaState<any>;
}

export function showError({ meta: { submitError, dirtySinceLastSubmit, error, touched, modified } }: showErrorProps) {
	return ((submitError && !dirtySinceLastSubmit) || error) && (touched || modified);
}
