import React from 'react';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function pickerProviderWrapper(component: any, locale: any) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
			{component}
		</LocalizationProvider>
	);
}
