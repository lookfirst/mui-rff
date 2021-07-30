import React from 'react';

import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

export default function pickerProviderWrapper(component: any, locale: any) {
	return locale ? (
		<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
			{component}
		</LocalizationProvider>
	) : (
		component
	);
}
