import { TimePicker, TimePickerProps } from './TimePicker';
import React from 'react';

/**
 * @deprecated use TimePicker instead
 */
export function KeyboardTimePicker(props: KeyboardTimePickerProps) {
	console.warn('KeyboardTimePicker is deprecated. You should use TimePicker instead.');
	return <TimePicker {...props} />;
}

/**
 * @deprecated use TimePickerProps instead
 */
export type KeyboardTimePickerProps = TimePickerProps;
