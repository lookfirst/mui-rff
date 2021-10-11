import { DatePicker, DatePickerProps } from './DatePicker';
import React from 'react';

/**
 * @deprecated use DatePicker instead
 */
export function KeyboardDatePicker(props: KeyboardDatePickerProps) {
	console.warn('KeyboardDatePicker is deprecated. You should use DatePicker instead.');
	return <DatePicker {...props} />;
}

/**
 * @deprecated use DatePickerProps instead
 */
export type KeyboardDatePickerProps = DatePickerProps;
