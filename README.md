[![MUI-RFF, MUI and React Final Form](https://pimp-my-readme-next.vercel.app/api/wavy-banner?subtitle=MUI%20and%20React%20Final%20Form&title=MUI-RFF)](https://pimp-my-readme-next.vercel.app)

[![NPM Version](https://badgen.net/npm/v/mui-rff)](https://www.npmjs.com/package/mui-rff)
[![NPM Downloads](https://badgen.net/npm/dm/mui-rff)](https://www.npmjs.com/package/mui-rff)
[![min-zipped size](https://badgen.net/bundlephobia/minzip/mui-rff)](https://bundlephobia.com/result?p=mui-rff)
[![Build status](https://github.com/lookfirst/mui-rff/workflows/Node%20CI/badge.svg)](https://github.com/lookfirst/mui-rff)
[![CLA assistant](https://cla-assistant.io/readme/badge/lookfirst/mui-rff)](https://cla-assistant.io/lookfirst/mui-rff)

**Welcome!** Thanks for stopping by and taking a look at this project. Let me briefly explain what it does.

In order to integrate [React Final Form](https://final-form.org/react) with a UI component library such as [Material UI](https://mui.com), you'll need to create a thin wrapper that passes properties between MUI and RFF components. After searching around for who else has done this, you've stumbled across this project.

Sadly, figuring out the nuances of passing properties across multiple components is non-trivial. It takes a lot of trial and error, and hopefully you're writing tests along the way too (hahaha yea, right). Since you are probably in a rush and just want to get onto building features, this repo provides a set of modern and unit tested React components that make it easy to drop into your own Javascript or Typescript project as a small NPM dependency.

Please try things out and review the code first. Take a look at the [demo](https://lookfirst.github.io/mui-rff/), [demo source](https://github.com/lookfirst/mui-rff/tree/master/example), [demo codesandbox](https://codesandbox.io/s/react-final-form-material-ui-example-xxspf), [another codesandbox](https://codesandbox.io/s/react-final-form-material-ui-example-tqv09), and the [tests](https://github.com/lookfirst/mui-rff/tree/master/test).

One thing to note in the [demo](https://lookfirst.github.io/mui-rff/) is the ability to control the React form rendering. This is what really motivated me to go with RFF. With a small [configuration tweak to RFF](https://final-form.org/docs/react-final-form/types/FormProps#subscription), it is easy to cut the number of renders down to the bare minimum. This improves performance significantly, especially with larger forms.

I welcome issues to discuss things or even pr's!

**If you like us, please ⭐ ⭐ star this project ⭐ ⭐**

[![Star History Chart](https://api.star-history.com/svg?repos=lookfirst/mui-rff&type=Date)](https://www.star-history.com/#lookfirst/mui-rff&Date)

# Usage

v6.0+ of mui-rff depends on React 18.

Beyond the normal react dependencies, you'll need:

`bun add mui-rff @mui/material @mui/x-date-pickers final-form react-final-form`

If you use the date/time pickers, you'll need:

`bun add @date-io/core @date-io/date-fns date-fns`

It is unfortunate that so many dependencies need to be installed right now. Pretty sure fixing this will require a lot of work to split everything into separate packages, which seems quite overkill for this project.

I recommend using Yup for the form validation:

`bun add yup`

# Getting started

MUI-RFF follows the recommended practices for both MUI and RFF. Build your `<Form/>` and then insert MUI-RFF components. The [hello world example](https://codesandbox.io/s/react-final-form-material-ui-example-tno64) looks like this:

> Note: This project now uses Bun. Install from https://bun.sh and run `bun install` before development.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';

interface FormData {
	hello: string;
}

interface MyFormProps {
	initialValues: FormData;
}

function App() {
	return <MyForm initialValues={{ hello: 'hello world' }} />;
}

function MyForm(props: MyFormProps) {
	const { initialValues } = props;

	// yes, this can even be async!
	async function onSubmit(values: FormData) {
		console.log(values);
	}

	// yes, this can even be async!
	async function validate(values: FormData) {
		if (!values.hello) {
			return { hello: 'Saying hello is nice.' };
		}
		return;
	}

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={initialValues}
			validate={validate}
			render={({ handleSubmit, values }) => (
				<form onSubmit={handleSubmit} noValidate>
					<TextField label="Hello world" name="hello" required={true} />
					<pre>{JSON.stringify(values)}</pre>
				</form>
			)}
		/>
	);
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

You'll notice that rendering the component and error handling is all done for you without any additional code. Personally, I find this to be the holy grail of building forms because all the magic is wrapped up into a nice clean interface so that all you care about is providing data and submitting it.

Using MUI-RFF to generate a bunch of form fields is as easy as declaring all the fields and rendering them...

```tsx
const formFields: JSX.Element[] = [
	<TextField name="name" label="Invoice name" />,
	<KeyboardDatePicker name="date" label="Invoice date" dateFunsUtils={DateFnsUtils} />,
	<TextField name="purchaseOrder" label="Purchase order" />,
	<TextField name="supplier" label="Supplier" />,
	<TextField name="purchasePrice" label="Purchase price" />,
	<TextField name="depreciationType" label="Depreciation type" />,
	<KeyboardDatePicker name="depreciationStart" label="Depreciation start" dateFunsUtils={DateFnsUtils} />,
	<TextField name="depreciationRate" label="Depreciation rate" />,
];

<Grid container direction="column" alignContent="stretch">
	{formFields.map((item, idx) => (
		<Grid item className={classes.maxWidth} key={idx}>
			{item}
		</Grid>
	))}
</Grid>;
```

See below for more examples and details about how to use this library... if there is something missing or confusing, please ask in the issue tracker.

# Keeping up to date

I generally don't like to break backwards compatibility. There is a number of unit tests which will break if that happens. Expect that major versions will break it and minor/patch versions shouldn't break anything. I like to keep up to date with the latest 3rd party dependencies because in the JS/TS land, code tends to quickly rot. I find that it is easier to fix smaller things than to batch up into a lot of large changes.

The [commit history works as a great changelog](https://github.com/lookfirst/mui-rff/commits/master). Versions are tagged, so it is clear what commits go into each version and I release early/often so that it is easy to identify when issues crop up. I generally try to have descriptive enough commit messages so that things are clear.

# Upgrades

## From 1.x to 2.0

Version 2.0 removes the default margin around components as well as the default time/date formats. This means that MUI-RFF does not override any MUI defaults, and you now have to set them on your own. The reason for this change was to allow for better integration with the [MUI Theme system](https://material-ui.com/customization/theming/). It was a mistake for me to have originally done this, my apologies.

There is now a number of [tests](https://github.com/lookfirst/mui-rff/tree/master/test) which case for this and the [demo](https://lookfirst.github.io/mui-rff/) has been updated.

To get the equivalent margin behavior back, you'll need to add properties to your theme:

```tsx
const theme = createMuiTheme({
	props: {
		MuiTextField: {
			margin: 'normal',
		},
		MuiFormControl: {
			margin: 'normal',
		},
	},
});
```

Alternatively, each component has their own way of specifying these settings. Either as `margin="normal"` or `formFieldProps` or `textFieldProps` depending on the component needs.

To get the equivalent date/time formats back, you'll need to specify them as properties:

```tsx
<DatePicker
	label="Test"
	name="date"
	required={true}
	dateFunsUtils={DateFnsUtils}
	margin="normal"
	variant="inline"
	format="yyyy-MM-dd"
/>
```

I think based on all these instructions you can see why I tried to pick a default!

## From 2.7.5 to 3.0

Yup made some backwards incompatible changes. This probably only affects people who depend on yup directly, but I wanted to make sure that people who depend on this library aren't surprised by this. There are no changes in this library except to support the Yup changes.

## From 3.0 to 5.0

This release is compatible with MUI v5 and thus adopts the 5.x version. If you are still using Material UI v4.x, you should keep using an older version, although we do not expect us to maintain it any longer beyond user contributed PRs We have gone out of our way to maintain backwards compatibility in order to lessen the effects of upgrading. We continue to believe that maintaining API compatibility is important. However, there are a few changes that are beyond our control and will require consideration...

The default color for `Checkboxes`, `Radios` and `Select`s and `Switch`es changed from `secondary` to `primary` in MUI v5. Set `color={secondary}` if you do not want the color to change, and you haven't set a color before.

The default variant for `TextField`s changed from `standard` to `outlined` in MUI v5. Set `variant={standard}` if you want the variant to remain unchanged, and you have not set a variant before. This also affects `DatePicker`s, `DateTimePicker`s, `TimePicker`s and `Autocomplete`s, since they use `TextField`s internally.

`KeyboardDatePicker`, `KeyboardDateTimePicker` and `KeyboardTimePicker` are deprecated aliases for `DatePicker`, `DateTimePicker` and `TimePicker` respectively. Please make sure to update your code as soon as possible. We will be removing them in a future point release version that we have not decided upon yet (5.1, 5.2, etc...).

## From 5.0 to 5.2.0

Previously, we wrapped your Date/Time components in a `<LocalizationProvider>` [MUI documentation](https://mui.com/components/date-picker/#requirements). This had the unfortunate effect of blocking upstream declarations of the component. This was reported in issue #634 and is now fixed. The solution is to wrap all of your Date/Time components like this (but do it for all of them, not just one at a time):

```tsx
<LocalizationProvider dateAdapter={AdapterDateFns}>
	<DatePicker label="Test" name="date" required={true} inputFormat="yyyy-MM-dd" />
</LocalizationProvider>
```

You might encounter this error if you do not do this:

`Error: Can not find utils in context. It looks like you forgot to wrap your component in LocalizationProvider, or pass dateAdapter prop directly.`

## From 5.2.0 to 5.3.0

In their infinite wisdom, [MUI decided to move the DatePickers to another project](https://mui.com/x/react-date-pickers/migration-lab/). So, I've migrated the imports. Since you import mui-rff and not MUI directly, this shouldn't have an effect on you, but I'm going to note it here in the upgrade log.

## From 5.x to 6.0.0

6.x introduces React 18. All the credit goes to @wadsworj for their excellent contribution!

Previously deprecated Keyboard\* wrappers were removed. Please migrate to the DatePicker/DateTimePicker components.

The dependencies in package.json were updated and unit tests fixed.

There are no other API changes on our end of things.

## From 6.x to 7.0.0

Thanks to @Kyraminol in #1082, we are now at the latest 1.x version of Yup. Make sure to update your dependencies.

## From 7.x to 8.0.0

Thanks to @lukas-cc in #1170, we have now switched to MUI 6.x. It should be backwards compatible with 5.x, but we will version higher regardless.

# Components

All the components should allow passing MUI configuration properties to them so that they can be easily customized. In the case of RFF and MUI components with deeply nested structures of multiple subcomponents, you can pass the properties in with special top level properties. This is very hard to document fully without making a mess, so please refer to the source code and demos for examples.

```tsx
<TextField fieldProps={{ validation: myValidationFunction }} />

<Select menuItemProps={{ disableGutters: true }} />

<DatePicker TextFieldProps={{ variant: 'standard' }} />
```

## TextField - [MUI Docs](https://material-ui.com/components/text-fields/)

```tsx
import { TextField } from 'mui-rff';

<TextField label="Hello world" name="hello" required={true} />;
```

## Checkboxes - [MUI Docs](https://material-ui.com/components/checkboxes/)

If you have a single checkbox, it is rendered without the label (if no label is defined) and the value is boolean. Otherwise, you get an array of values. An example of this is the 'employed' field in the demo.

```tsx
import { Checkboxes, CheckboxData } from 'mui-rff';

const checkboxData: CheckboxData[] = [
	{ label: 'Item 1', value: 'item1' },
	{ label: 'Item 2', value: 'item2' },
];

<Checkboxes label="Check at least one..." name="best" required={true} data={checkboxData} />;
```

## Switches - [MUI Docs](https://material-ui.com/components/switches/)

If you have a single switch, it is rendered without the label (if no label is defined) and the value is boolean. Otherwise, you get an array of values. An example of this is the 'available' field in the demo.

```tsx
import { Switches, SwitchData } from 'mui-rff';

// submits a boolean
<Switches label="Enable feature X" name="feature-x" required={true} data={{ label: 'Feature X', value: true }} />;

// submits an array of values of the toggled switches
const switchData: SwitchData[] = [
	{ label: 'Item 1', value: 'item1' },
	{ label: 'Item 2', value: 'item2' },
];
<Switches label="Check at least one..." name="best" required={true} data={switchData} />;
```

## Radios - [MUI Docs](https://material-ui.com/components/radio-buttons/)

This example shows that you can inline the configuration data instead of passing it in like in the Checkboxes example above.

```tsx
import { Radios } from 'mui-rff';

<Radios
	label="Pick one..."
	name="gender"
	required={true}
	data={[
		{ label: 'Item 1', value: 'item1' },
		{ label: 'Item 2', value: 'item2' },
	]}
/>;
```

## Select - [MUI Docs](https://material-ui.com/components/selects/)

Select allows you to inline the MUI `<MenuItem>` component. You can also pass in a `data=` property similar to Checkboxes and Radios and the items will be generated for you. This example shows overriding the MUI default `formControl` properties.

```tsx
import { Select } from 'mui-rff';
import { MenuItem } from '@material-ui/core';

<Select name="city" label="Select a City" formControlProps={{ margin: 'normal' }}>
	<MenuItem value="London">London</MenuItem>
	<MenuItem value="Paris">Paris</MenuItem>
	<MenuItem value="Budapest">A city with a very long Name</MenuItem>
</Select>;
```

## DatePicker - [MUI Docs](https://mui.com/x/react-date-pickers/date-picker/)

You'll need to add dependencies:

`bun add @mui/x-date-pickers @date-io/core @date-io/date-fns date-fns`

```tsx
import { DatePicker } from 'mui-rff';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

<DatePicker label="Pick a date" name="date" required={true} />;
```

## TimePicker - [MUI Docs](https://mui.com/x/react-date-pickers/time-picker/)

You'll need to add dependencies:

`bun add @mui/x-date-pickers @date-io/core @date-io/date-fns date-fns`

```tsx
import { TimePicker } from 'mui-rff';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

<TimePicker label="Pick a date" name="date" required={true} />;
```

## DateTimePicker - [MUI Docs](https://mui.com/x/react-date-pickers/date-time-picker/)

You'll need to add dependencies:

`bun add @mui/x-date-pickers @date-io/core @date-io/date-fns date-fns`

```tsx
import { DateTimePicker } from 'mui-rff';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

<DateTimePicker label="Pick a date and time" name="datTtime" required={true} />;
```

## Autocomplete - [MUI Docs](https://material-ui.com/components/autocomplete/)

> Note: Part of the @material-ui/lab dependency.

```tsx
import React from 'react';
import { Checkbox as MuiCheckbox } from '@material-ui/core';
import { Autocomplete } from 'mui-rff';

const autocompleteData = [
	{ label: 'Earth', value: 'earth' },
	{ label: 'Mars', value: 'mars' },
	{ label: 'Venus', value: 'venus' },
	{ label: 'Brown Dwarf Glese 229B', value: '229B' },
];

<Autocomplete
	label="Pick at least one planet"
	name="planet"
	required={true}
	options={autocompleteData}
	getOptionValue={(option) => option.value}
	getOptionLabel={(option) => option.label}
	disableCloseOnSelect={true}
	renderOption={(option, { selected }) => (
		<>
			<MuiCheckbox style={{ marginRight: 8 }} checked={selected} />
			{option.label}
		</>
	)}
	multiple
/>;
```

When `multiple` is `true`, the `initialValues` passed into the `<Form>` element needs to be an array...

```tsx
const initialValues: { planet: string[] } = {
	planet: ['mars'], // <-- Needs to be an array
};

<Form
	initialValues={initialValues}
	render={({ handleSubmit }) => (
		<form onSubmit={handleSubmit}>
			<Autocomplete label="Pick at least one planet" name="planet" multiple />
		</form>
	)}
/>;
```

# Helpers

Optional helpers to make dealing with form validation a breeze!

## makeValidate(schema)

Form validation is a notorious pain in the arse and there are a couple libraries out there to help simplify things. After experimenting with both [Yup](https://github.com/jquense/yup) and Joi, I've settled on Yup. The main reason is that for form validation, Yup has the ability to validate all the schema and Joi stops on the first failure. Joi is also originally focused on server side validation, while Yup focuses on running in the browser.

That said, it is still helpful to translate Yup errors into something that Final Form can deal with. Final Form expects validation to return an object where the key is the field name and the value is the error message. This little helper does what we need:

`bun add yup @types/yup`

```tsx
import { Form } from 'react-final-form';
import { makeValidate } from 'mui-rff';
import * as Yup from 'yup';

// We define our schema based on the same keys as our form:
const schema = Yup.object().shape({
	employed: Yup.boolean().required(),
});

// Run the makeValidate function...
const validate = makeValidate(schema);

// Then pass the result into the <Form/>...
<Form validate={validate}>
	<Checkboxes name="employed" required={true} data={{ label: 'Employed', value: true }} />
</Form>;
```

## makeValidate(schema, translator?)

Yup [can be configured](https://github.com/jquense/yup#using-a-custom-locale-dictionary) to have a custom locale for when you need to translate your error messages or just general need more control. `makeValidate` accepts a second argument which is a `translator` which can return a `string` or a `JSX.Element`. So it can also be used if you have multiple errors and want to display them nicely via css (or e.g. hide the second)

```tsx
import { Form } from 'react-final-form';
import { makeValidate } from 'mui-rff';
import * as Yup from 'yup';

import t from 'some-kind-of-internationalization-library-like-i18next';

// setup your locale and pass whatever your translator could use
Yup.setLocale({
	mixed: {
		required: (props) => ({
			key: 'field_required',
			...props,
		}),
	},
});

// We define our schema based on the same keys as our form:
const schema = Yup.object().shape({
	employed: Yup.boolean().required(),
});

// Run the makeValidate function...
const validate = makeValidate(schema, (error) => {
	const { field, ...rest } = error;
	return <span className="error">{t(`errors:${error.field}`, rest)}</span>;
});
```

## makeValidateSync(schema, translator?)

Same as `makeValidate` but synchronous.

## makeRequired(schema)

Expanding on the example above, we can see that the `employed` checkbox is required in the schema, but we still need to define the `<Checkboxes...` `required={true}` property, this is ugly because the two can get out of sync.

We can then use another helper function to parse the schema and return an object where the key is the field name and the value is a boolean.

`bun add yup @types/yup`

```tsx
import { Form } from 'react-final-form';
import { Checkboxes, makeValidate } from 'mui-rff';
import * as Yup from 'yup';

// We define our schema based on the same keys as our form:
const schema = Yup.object().shape({
	employed: Yup.boolean().required(),
});

const validate = makeValidate(schema);

// Adding in the additional schema parsing...
const required = makeRequired(schema);

// Then pass it into the <Form/>
<Form validate={validate}>
	<Checkboxes name="employed" required={required.employed} data={{ label: 'Employed', value: true }} />
</Form>;
```

# Validation Types

Every field we export will take a `showError` prop which is a function, which returns a boolean, that is used to determine how and when to show error messages, by using `meta` props from the FinalForm field state.

These are the two available pre-defined options exported from within this library (defined in src/Util.tsx):

## showErrorOnChange({ meta }) - default

Triggers error messages to show up as soon as a value of a field changes. Useful for when the user needs instant feedback from the form validation (i.e. password creation rules, non-text based inputs like select, or switches etc.)

## showErrorOnBlur({ meta })

Triggers error messages to render after a field is touched, and blurred (focused out of), this is useful for text fields which might start out erroneous but end up valid in the end (i.e. email, or zipcode). In these cases you don't want to rush to show the user a validation error message when they haven't had a chance to finish their entry.

```tsx
import { TextField, showErrorOnBlur } from 'mui-rff';

<TextField label="Hello world" name="hello" required={true} showError={showErrorOnBlur} />;
```

## You can also make your own override:

```tsx
import { TextField } from 'mui-rff';

// define your own showError-type function
function myShowErrorFunction({ meta: { submitError, dirtySinceLastSubmit, error, touched, modified } }) {
	// this is actually the contents of showErrorOnBlur but you can be as creative as you want.
	return !!(((submitError && !dirtySinceLastSubmit) || error) && touched);
}

<TextField label="Hello world" name="hello" required={true} showError={myShowErrorFunction} />;
```

## Debug

Prints out the JSON version of the form data.

```tsx
import { Checkboxes, Debug } from 'mui-rff';

<Form>
	<Checkboxes name="employed" data={{ label: 'Employed', value: true }} />
	<Debug />
</Form>;
```

# Building

This project uses [Bun](https://bun.sh/) for local development.

- Clone the project.
- `bun install` to install dependencies (root + example workspace)
- `bun run build` to build the distribution
- `npm publish` (or experimental `bun publish`) to upload to npm and deploy the gh-pages
- `bun run test` to run the test suite
- `bun run lint` and `bun run lint-fix` to auto format code
- `cd example && bun install && bun run dev` to run the example on http://localhost:3000

To do development, I do a mix of TDD and running the example application. Run `bun run start` in the top level directory for library development with watch mode, and `bun run dev` in the example folder for the demo application.

---

### Credits

Thanks to the awesome work by these projects:

- React
- Material-UI
- React Final Form
- Vitest
- React Testing Library
- Vite
- Typescript
- Bun
- And all their dependencies...
