import React from 'react';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function pickerProviderWrapper(dateFunsUtils: any, component: any) {
	return dateFunsUtils ? (
		<MuiPickersUtilsProvider utils={dateFunsUtils}>{component}</MuiPickersUtilsProvider>
	) : (
		component
	);
}
