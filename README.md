[![NPM Version](https://img.shields.io/npm/v/mui-rff.svg?style=flat-square)](https://www.npmjs.com/package/mui-rff)
[![NPM Downloads](https://img.shields.io/npm/dm/mui-rff.svg?style=flat-square)](https://www.npmjs.com/package/mui-rff)
[![Build status](https://github.com/lookfirst/mui-rff/workflows/Node%20CI/badge.svg)](https://github.com/lookfirst/mui-rff)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=lookfirst/mui-rff)](https://dependabot.com)
[![Dependencies](https://david-dm.org/lookfirst/mui-rff/master/status.svg)](https://david-dm.org/lookfirst/mui-rff/master)
[![DevDependencies](https://david-dm.org/lookfirst/mui-rff/master/dev-status.svg)](https://david-dm.org/lookfirst/mui-rff/master?type=dev)

# Integrate Material-UI and React Final Form

In order to integrate MUI and RFF, you need to create a thin wrapper that passes properties to the various components. Figuring out the nuances is non-trivial, so let us do it for you. This project provides a set of well tested, modern React components that make it easy to drop into your own project.

Take a look at the [demo](https://lookfirst.github.io/mui-rff/), [codesandbox](https://codesandbox.io/s/react-final-form-material-ui-example-tqv09), [example source code](https://github.com/lookfirst/mui-rff/tree/master/example) and the [tests](https://github.com/lookfirst/mui-rff/tree/master/test).

This is a best effort implementation. If there is some customization that you require, we welcome issues or pr's!

# Usage

Beyond the normal react dependencies, you'll need to add these:

`yarn add mui-rff @material-ui/core @material-ui/pickers final-form react-final-form`

If you use the date/time pickers, you'll need to also add:

`yarn add @date-io/core @date-io/date-fns date-fns`

I recommend using Yup for the form validation:

`yarn add yup @types/yup`

# Getting started

MUI-RFF follows the recommended practices for both MUI and RFF. Build your `<Form/>` and then insert MUI-RFF components. The [hello world example](https://codesandbox.io/s/react-final-form-material-ui-example-tno64) looks like this:

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

You'll notice that rendering the component and intelligent error handling is all done for you without any additional code. Personally, I find this to be the holy grail of building forms because all of the magic is wrapped up into a nice clean interface so that all you care about is providing data and submitting it. 

Using MUI-RFF to generate a bunch of form fields is as easy as declaring all the fields and rendering them...

```tsx
const formFields: any[] = [
	<TextField name='name' label='Invoice name'/>,
	<KeyboardDatePicker name='date' label='Invoice date' dateFunsUtils={DateFnsUtils}/>,
	<TextField name='purchaseOrder' label='Purchase order'/>,
	<TextField name='supplier' label='Supplier'/>,
	<TextField name='purchasePrice' label='Purchase price'/>,
	<TextField name='depreciationType' label='Depreciation type'/>,
	<KeyboardDatePicker name='depreciationStart' label='Depreciation start' dateFunsUtils={DateFnsUtils}/>,
	<TextField name='depreciationRate' label='Depreciation rate'/>,
];

<Grid container direction='column' alignContent='stretch'>
	{formFields.map((item, idx) => (
		<Grid item className={classes.maxWidth} key={idx}>
			{item}
		</Grid>
	))}
</Grid>
```

# Components

All of the components should allow passing MUI configuration properties to them so that they can be customized in the same way. This is hard to document without making a mess, so please refer to the source code and demos for examples.

## TextField - [MUI Docs](https://material-ui.com/components/text-fields/)

```tsx
import {TextField} from 'mui-rff';

<TextField label="Hello world" name="hello" required={true}/>
```

## Checkboxes - [MUI Docs](https://material-ui.com/components/checkboxes/)

If you have a single checkbox, it is rendered without the label and the value is boolean. Otherwise you get an array of values. An example of this is the 'employed' field in the demo.

```tsx
import {Checkboxes, CheckboxData} from 'mui-rff';

const checkboxData: CheckboxData = [
    {label: 'Item 1', value: 'item1'}
    {label: 'Item 2', value: 'item2'}
];

<Checkboxes
    label="Check at least one..."
    name="best"
    required={true}
    data={checkboxData}
/>
```

## Radios - [MUI Docs](https://material-ui.com/components/radio-buttons/)

This example shows that you can inline the configuration data instead of passing it in like in the Checkboxes example above.

```tsx
import {Radios} from 'mui-rff';

<Radios
    label="Pick one..."
    name="gender"
    required={true}
    data={[
        {label: 'Item 1', value: 'item1'}
        {label: 'Item 2', value: 'item2'}
    ]}
/>
```

## Select - [MUI Docs](https://material-ui.com/components/selects/)

Select allows you to inline the MUI `<MenuItem>` component. You can also pass in a `data=` property similar to Checkboxes and Radios and the items will be generated for you. This example shows overriding the MUI default `formControl` properties.

```tsx
import {Select} from 'mui-rff';
import {MenuItem} from '@material-ui/core';

<Select
    name="city"
    label="Select a City"
    formControlProps={{ margin: 'normal' }}>

    <MenuItem value="London">London</MenuItem>
    <MenuItem value="Paris">Paris</MenuItem>
    <MenuItem value="Budapest">
        A city with a very long Name
    </MenuItem>

</Select>
```

## KeyboardDatePicker - [MUI Docs](https://material-ui.com/components/pickers/)

You'll need to add a dependency:

`yarn add @date-io/core @date-io/date-fns date-fns`

```tsx
import {KeyboardDatePicker} from 'mui-rff';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

<KeyboardDatePicker
    label="Pick a date"
    name="date"
    required={true}
    dateFunsUtils={DateFnsUtils}
/>
```

## DatePicker - [MUI Docs](https://material-ui.com/components/pickers/)

You'll need to add a dependency:

`yarn add @date-io/core @date-io/date-fns date-fns`

```tsx
import {KeyboardDatePicker} from 'mui-rff';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

<DatePicker
    label="Pick a date"
    name="date"
    required={true}
    dateFunsUtils={DateFnsUtils}
/>
```

## TimePicker - [MUI Docs](https://material-ui.com/components/pickers/)

You'll need to add a dependency:

`yarn add @date-io/core @date-io/date-fns date-fns`

```tsx
import {KeyboardDatePicker} from 'mui-rff';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

<TimePicker
    label="Pick a date"
    name="date"
    required={true}
    dateFunsUtils={DateFnsUtils}
/>
```

# Helpers

Optional helpers to make dealing with form validation a breeze!

## makeValidate(schema)

Form validation is a notorious pain in the arse and there are a couple libraries out there to help simplify things. After experimenting with both [Yup](https://github.com/jquense/yup) and Joi, I've settled on Yup. The main reason is that for form validation, Yup has the ability to validate all of the schema and Joi stops on the first failure. Joi is also originally focused on server side validation, while Yup focuses on running in the browser.

That said, it is still helpful to translate Yup errors into something that Final Form can deal with. Final Form expects validation to return an object where the key is the field name and the value is the error message. This little helper does what we need:

`yarn add yup @types/yup`

```ts
import {Form} from 'react-final-form';
import {makeValidate} from 'mui-rff';
import * as Yup from 'yup';

// We define our schema based on the same keys as our form:
const schema = Yup.object().shape({
	employed: Yup.boolean().required(),
});

// Run the makeValidate function...
const validate = makeValidate(schema);

// Then pass the result into the <Form/>...
<Form validate={validate}>
    <Checkboxes
        name="employed"
        required={true}
        data={{ label: 'Employed', value: true }}
    />
</Form>
```

## makeRequired(schema)

Expanding on the example above, we can see that the `employed` checkbox is required in the schema, but we still need to define the `<Checkboxes...` `required={true}` property, this  is ugly because the two can get out of sync. 

We can then use another helper function to parse the schema and return an object where the key is the field name and the value is a boolean.

`yarn add yup @types/yup`

```ts
import {Form} from 'react-final-form';
import {makeValidate} from 'mui-rff';
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
    <Checkboxes
        name="employed"
        required={required.employed}
        data={{ label: 'Employed', value: true }}
    />
</Form>
```

# Building

* Clone the project.
* `yarn` to install dependencies

* `yarn build` to build the distribution
* `yarn publish` to upload to npm and deploy the gh-pages
* `yarn test` to run the test suite
* `yarn lint` and `yarn lint-fix` to auto format code
* `cd example; yarn; yarn start` to run the example on http://localhost:1234

---
### Credits

Thanks to the awesome work by these projects:

* React
* Material-UI
* React Final Form
* Jest
* React Testing Library
* TSDX
* Typescript
* Yarn
* And all their dependencies...
