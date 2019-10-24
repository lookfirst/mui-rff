import React from 'react';
import { FormSpy } from 'react-final-form';

export function Debug() {
	return (
		<FormSpy subscription={{ values: true }}>
			{({ values }) => <pre>{JSON.stringify(values, undefined, 2)}</pre>}
		</FormSpy>
	);
}
