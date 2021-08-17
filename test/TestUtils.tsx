import React from 'react';

/**
 * It is lame this file is in the src directory. It doesn't belong here...
 * https://github.com/jaredpalmer/tsdx/issues/638
 */

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { render as tlRender } from '@testing-library/react';

function MyStyles({ children }: any) {
	// make a copy of the data because the state is mutated below in one of the tests for clicks
	// then the state is used again for comparison later, which causes tests to be dependent on execution
	// order and fail.
	const generateClassName = createGenerateClassName({
		disableGlobal: true,
		productionPrefix: 'test',
	});

	return <StylesProvider generateClassName={generateClassName}>{children}</StylesProvider>;
}

const customRender = (ui: any, options?: any) => tlRender(ui, { wrapper: MyStyles, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender };
