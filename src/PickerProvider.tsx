import React from 'react';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function pickerProviderWrapper(dateFunsUtils: any, component: any, locale: any) {
	return dateFunsUtils ? (
		<MuiPickersUtilsProvider locale={locale} utils={dateFunsUtils}>
			{component}
		</MuiPickersUtilsProvider>
	) : (
		component
	);
}
