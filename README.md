[![MUI-RFF, MUI and React Final Form](https://pimp-my-readme-next.vercel.app/api/wavy-banner?subtitle=MUI%20and%20React%20Final%20Form&title=MUI-RFF)](https://pimp-my-readme-next.vercel.app)

[![NPM Version](https://badgen.net/npm/v/mui-rff?cache=300)](https://www.npmjs.com/package/mui-rff)
[![NPM Downloads](https://badgen.net/npm/dm/mui-rff?cache=300)](https://www.npmjs.com/package/mui-rff)
[![min-zipped size](https://badgen.net/bundlephobia/minzip/mui-rff?cache=300)](https://bundlephobia.com/result?p=mui-rff)
[![Build status](https://github.com/lookfirst/mui-rff/workflows/Node%20CI/badge.svg?cache=300)](https://github.com/lookfirst/mui-rff)
[![CLA assistant](https://cla-assistant.io/readme/badge/lookfirst/mui-rff?cache=300)](https://cla-assistant.io/lookfirst/mui-rff)

# mui-rff

**Welcome.** Thanks for taking a look at the project.

`mui-rff` provides thin, tested wrapper components that connect [MUI](https://mui.com/) with [React Final Form](https://final-form.org/react). It removes the repetitive glue code needed to wire form state, validation, and error display into common MUI inputs, so you can focus on building forms instead of bridging two libraries.

This project is 7+ years old now and still actively supported. A large suite of unit tests makes that practical by catching compatibility issues early as React, MUI, Final Form, and related dependencies evolve.

It also has an automated CI and release pipeline, so dependency updates and releases are validated consistently instead of relying on manual steps.

If you enjoy this project, consider giving it a star. We could use the support.

[Demo](https://lookfirst.github.io/mui-rff/) · [Example source](https://github.com/lookfirst/mui-rff/tree/master/example) · [Tests](https://github.com/lookfirst/mui-rff/tree/master/test) · [CI setup](./CI.md) · [npm](https://www.npmjs.com/package/mui-rff)

## Requirements

Current releases target:

- React 19
- `react-final-form` 7
- `final-form` 5
- `@mui/material` 7
- `@mui/x-date-pickers` 8

See [`package.json`](./package.json) for the authoritative peer dependency ranges.

## Installation

Install the package and its peer dependencies:

```bash
bun add mui-rff @emotion/react @emotion/styled @mui/material @mui/system @mui/x-date-pickers final-form react react-final-form
```

If you use date pickers, also install a date adapter:

```bash
bun add @date-io/core @date-io/date-fns date-fns
```

If you use Yup-based validation helpers:

```bash
bun add yup
```

## Basic Usage

Build your `<Form />` with React Final Form, then render `mui-rff` fields inside it.

```tsx
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';

interface FormData {
	hello: string;
}

export function MyForm() {
	async function onSubmit(values: FormData) {
		console.log(values);
	}

	function validate(values: FormData) {
		if (!values.hello) {
			return { hello: 'Saying hello is nice.' };
		}
		return undefined;
	}

	return (
		<Form<FormData>
			initialValues={{ hello: 'hello world' }}
			onSubmit={onSubmit}
			validate={validate}
			render={({ handleSubmit, values }) => (
				<form onSubmit={handleSubmit} noValidate>
					<TextField label="Hello world" name="hello" required />
					<pre>{JSON.stringify(values, null, 2)}</pre>
				</form>
			)}
		/>
	);
}
```

## Date Pickers

Wrap picker components in MUI's `LocalizationProvider`:

```tsx
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from 'mui-rff';

<LocalizationProvider dateAdapter={AdapterDateFns}>
	<DatePicker label="Invoice date" name="date" />
</LocalizationProvider>;
```

## Components

The package exports wrappers for the most common MUI form inputs:

- `Autocomplete`
- `Checkboxes`
- `DatePicker`
- `DateTimePicker`
- `Radios`
- `Select`
- `Switches`
- `TextField`
- `TimePicker`
- `Debug`

It also exports validation and error utilities:

- `makeRequired`
- `makeValidate`
- `makeValidateSync`
- `ErrorMessage`
- `showErrorOnBlur`
- `showErrorOnChange`
- `useFieldForErrors`

## Component Examples

These examples are intentionally small. For more complete patterns, check the demo app and tests.

### `TextField`

```tsx
import { TextField } from 'mui-rff';

<TextField label="Hello world" name="hello" required />;
```

### `Checkboxes`

```tsx
import { Checkboxes } from 'mui-rff';

<Checkboxes
	label="Check at least one"
	name="best"
	required
	data={[
		{ label: 'Item 1', value: 'item1' },
		{ label: 'Item 2', value: 'item2' },
	]}
/>;
```

### `Switches`

```tsx
import { Switches } from 'mui-rff';

<Switches label="Enable feature X" name="featureX" data={{ label: 'Feature X', value: true }} />;
```

### `Radios`

```tsx
import { Radios } from 'mui-rff';

<Radios
	label="Pick one"
	name="choice"
	required
	data={[
		{ label: 'Item 1', value: 'item1' },
		{ label: 'Item 2', value: 'item2' },
	]}
/>;
```

### `Select`

```tsx
import MenuItem from '@mui/material/MenuItem';
import { Select } from 'mui-rff';

<Select label="Select a city" name="city">
	<MenuItem value="London">London</MenuItem>
	<MenuItem value="Paris">Paris</MenuItem>
	<MenuItem value="Budapest">Budapest</MenuItem>
</Select>;
```

### `DatePicker`

```tsx
import { DatePicker } from 'mui-rff';

<DatePicker label="Pick a date" name="date" required />;
```

### `TimePicker`

```tsx
import { TimePicker } from 'mui-rff';

<TimePicker label="Pick a time" name="time" required />;
```

### `DateTimePicker`

```tsx
import { DateTimePicker } from 'mui-rff';

<DateTimePicker label="Pick a date and time" name="dateTime" required />;
```

### `Autocomplete`

```tsx
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete } from 'mui-rff';

const planetOptions = [
	{ label: 'Earth', value: 'earth' },
	{ label: 'Mars', value: 'mars' },
	{ label: 'Venus', value: 'venus' },
];

<Autocomplete
	label="Pick planets"
	name="planet"
	options={planetOptions}
	getOptionLabel={(option) => option.label}
	getOptionValue={(option) => option.value}
	disableCloseOnSelect
	multiple
	renderOption={(props, option, { selected }) => (
		<li {...props}>
			<Checkbox checked={selected} sx={{ mr: 1 }} />
			{option.label}
		</li>
	)}
/>;
```

When `multiple` is enabled, the corresponding `initialValues` entry should be an array:

```tsx
import { Form } from 'react-final-form';

<Form initialValues={{ planet: ['mars'] }}>{/* ... */}</Form>
```

### `Debug`

```tsx
import { Debug } from 'mui-rff';

<Debug />;
```

## Customization

Each wrapper accepts the usual MUI props plus component-specific pass-through props for nested elements. For example:

```tsx
<TextField fieldProps={{ validate: myValidationFunction }} />

<Select menuItemProps={{ disableGutters: true }} />

<DatePicker TextFieldProps={{ variant: 'outlined' }} />
```

Refer to the source and example app for complete usage patterns.

## Validation Helpers

Validation helpers are available if you use Yup schemas:

```tsx
import { TextField, makeRequired, makeValidate, showErrorOnBlur } from 'mui-rff';
import * as Yup from 'yup';

const schema = Yup.object({
	email: Yup.string().email().required(),
});

const validate = makeValidate(schema);
const required = makeRequired(schema);

<TextField
	label="Email"
	name="email"
	required={required.email}
	showError={showErrorOnBlur}
/>;
```

## Development

This repository uses Bun for local development.

Long-term maintenance depends heavily on the test suite. The project has stayed healthy across multiple major dependency upgrades because the unit tests provide a reliable compatibility safety net.

The repository also uses automated GitHub Actions for pull request validation, versioning, releases, GitHub Pages deployment, and npm publishing. See [CI.md](./CI.md) for the full setup.

If you want to build a similar pipeline for your own project, [CI.md](./CI.md) is meant to be practical reference material: you can treat it as a reusable playbook, or even as a skill prompt, for setting up a modern CI workflow with protected branches, automated releases, and trusted publishing.

```bash
bun install
bun run ci
```

Useful scripts:

- `bun run build`
- `bun run test`
- `bun run lint`
- `bun run tsc`

## Upgrade Notes

- `5.2.0+`: Date and time pickers must be wrapped in `LocalizationProvider`.
- `6.0.0`: Deprecated `Keyboard*` picker aliases were removed.
- `7.0.0`: Yup support was updated to the 1.x line.
- `8.0.0`: The package moved to MUI 6 and remains broadly compatible with MUI 5-style usage where upstream APIs allow it.

For project history, see the [commit log](https://github.com/lookfirst/mui-rff/commits/master) and [GitHub releases](https://github.com/lookfirst/mui-rff/releases).

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Project Activity

[![Star History Chart](https://api.star-history.com/svg?repos=lookfirst/mui-rff&type=Date&cache=300)](https://www.star-history.com/#lookfirst/mui-rff&Date)

## License

[MIT](./LICENSE)
