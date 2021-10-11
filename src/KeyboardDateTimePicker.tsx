import { DateTimePicker, DateTimePickerProps } from './DateTimePicker';
import React from 'react';

/**
 * @deprecated use DateTimePicker instead
 */
export function KeyboardDateTimePicker(props: KeyboardDateTimePickerProps) {
	console.warn('KeyboardDateTimePicker is deprecated. You should use DateTimePicker instead.');
	return <DateTimePicker {...props} />;
}

/**
 * @deprecated use DateTimePickerProps instead
 */
export type KeyboardDateTimePickerProps = DateTimePickerProps;
