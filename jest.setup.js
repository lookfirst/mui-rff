// window.__DEV__ = true;

// even with latest react, still running into this on a couple of tests where i could not wrap
// things into an async act. maybe some day this will get fixed, but right now it is just an
// annoying useless warning.
// const consoleError = console.error;
// beforeAll(() => {
// 	jest.spyOn(console, 'error').mockImplementation((...args) => {
// 		if (!args[0].includes('Warning: An update to %s inside a test was not wrapped in act')) {
// 			consoleError(...args);
// 		}
// 	});
// });
