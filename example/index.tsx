import 'date-fns';
import 'react-app-polyfill/ie11';
import * as Yup from 'yup';
import {
	AppBar,
	Button,
	CssBaseline,
	FormControlLabel,
	Grid,
	InputAdornment,
	Link,
	Checkbox as MuiCheckbox,
	Paper,
	Toolbar,
	Typography,
} from '@material-ui/core';
import {
	Autocomplete,
	AutocompleteData,
	CheckboxData,
	Checkboxes,
	DatePicker,
	DateTimePicker,
	Debug,
	KeyboardDatePicker,
	KeyboardDateTimePicker,
	RadioData,
	Radios,
	Select,
	SelectData,
	SwitchData,
	Switches,
	TextField,
	TimePicker,
	makeRequired,
	makeValidate,
} from '../.';
import { Form } from 'react-final-form';
import { FormSubscription } from 'final-form';
import { Theme, ThemeProvider, createStyles, createTheme, makeStyles } from '@material-ui/core/styles';
import { createFilterOptions } from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import ruLocale from 'date-fns/locale/ru';

const theme = createTheme({
	props: {
		MuiTextField: {
			margin: 'normal',
		},
		MuiFormControl: {
			margin: 'normal',
		},
	},
});

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		subscription: {
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
		},
		wrap: {
			marginLeft: theme.spacing(2),
			marginRight: theme.spacing(2),
		},
	}),
);

/**
 * Little helper to see how good rendering is
 */
class RenderCount extends React.Component {
	renders = 0;

	render() {
		return <>{++this.renders}</>;
	}
}

interface FormData {
	planet_one: string;
	planet: string[];
	best: string[];
	available: boolean;
	switch: string[];
	terms: boolean;
	date: Date;
	hello: string;
	cities: string[];
	gender: string;
	birthday: Date;
	break: Date;
	hidden: string;
	keyboardDateTime: Date;
	dateTime: Date;
	dateTimeLocale: Date;
}

const schema = Yup.object({
	planet_one: Yup.string().required(),
	planet: Yup.array()
		.of(Yup.string().required())
		.min(1)
		.required(),
	best: Yup.array()
		.of(Yup.string().required())
		.min(1)
		.required(),
	available: Yup.boolean()
		.oneOf([true], 'We are not available!')
		.required(),
	switch: Yup.array()
		.of(Yup.string().required())
		.min(1)
		.required(),
	terms: Yup.boolean()
		.oneOf([true], 'Please accept the terms')
		.required(),
	date: Yup.date().required(),
	hello: Yup.string().required(),
	cities: Yup.array()
		.of(Yup.string().required())
		.min(1)
		.required(),
	gender: Yup.string().required(),
	birthday: Yup.date().required(),
	break: Yup.date().required(),
	hidden: Yup.string().required(),
	keyboardDateTime: Yup.date().required(),
	dateTime: Yup.date().required(),
	dateTimeLocale: Yup.date().required(),
});

/**
 * Uses the optional helper makeValidate function to format the error messages
 * into something usable by final form.
 */
const validate = makeValidate(schema);

/**
 * Grabs all the required fields from the schema so that they can be passed into
 * the components without having to declare them in both the schema and the component.
 */
const required = makeRequired(schema);

function App() {
	const classes = useStyles();

	const subscription = { submitting: true };
	const [subscriptionState, setSubscriptionState] = useState<FormSubscription | undefined>(subscription);

	const onChange = () => {
		setSubscriptionState(subscriptionState === undefined ? subscription : undefined);
	};

	return (
		<ThemeProvider theme={theme}>
			<div className={classes.wrap}>
				<CssBaseline />

				<Paper className={classes.subscription}>
					<FormControlLabel
						control={
							<MuiCheckbox checked={subscriptionState !== undefined} onChange={onChange} value={true} />
						}
						label="Enable React Final Form subscription render optimization. Watch the render count when interacting with the form."
					/>
					<Link
						href="https://final-form.org/docs/react-final-form/types/FormProps#subscription"
						target="_blank"
					>
						Documentation
					</Link>
				</Paper>

				<MainForm subscription={subscriptionState} />

				<Footer />
			</div>
		</ThemeProvider>
	);
}

const useFooterStyles = makeStyles((theme: Theme) =>
	createStyles({
		footer: {
			top: 'auto',
			bottom: 0,
			backgroundColor: 'lightblue',
		},
		offset: theme.mixins.toolbar,
	}),
);

function Footer() {
	const classes = useFooterStyles();

	return (
		<>
			<AppBar color="inherit" position="fixed" elevation={0} className={classes.footer}>
				<Toolbar>
					<Grid container spacing={1} alignItems="center" justifyContent="center" direction="row">
						<Grid item>
							<Link
								href="https://github.com/lookfirst/mui-rff"
								target="_blank"
								color="textSecondary"
								variant="body1"
							>
								MUI-RFF Github Project
							</Link>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<div className={classes.offset} />
		</>
	);
}

const useFormStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
			marginBottom: theme.spacing(5),
		},
		paperInner: {
			marginLeft: theme.spacing(3),
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
		},
		buttons: {
			'& > *': {
				marginTop: theme.spacing(3),
				marginRight: theme.spacing(1),
			},
		},
	}),
);

function MainForm({ subscription }: { subscription: any }) {
	const classes = useFormStyles();
	const [submittedValues, setSubmittedValues] = useState<FormData | undefined>(undefined);

	const autocompleteData: AutocompleteData[] = [
		{ label: 'Earth', value: 'earth' },
		{ label: 'Mars', value: 'mars' },
		{ label: 'Venus', value: 'venus' },
		{ label: 'Brown Dwarf Glese 229B', value: '229B' },
	];

	const checkboxData: CheckboxData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
		{ label: 'Indeterminate', value: 'indeterminate', indeterminate: true },
	];

	const switchData: SwitchData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const selectData: SelectData[] = [
		{ label: 'Choose...', value: '', disabled: true },
		{ label: 'San Diego', value: 'sandiego' },
		{ label: 'San Francisco', value: 'sanfrancisco' },
		{ label: 'Los Angeles', value: 'losangeles' },
		{ label: 'Saigon', value: 'saigon' },
	];

	const radioData: RadioData[] = [
		{ label: 'Female', value: 'female' },
		{ label: 'Male', value: 'male' },
		{ label: 'Both', value: 'both' },
	];

	const initialValues: FormData = {
		planet_one: autocompleteData[1].value,
		planet: [autocompleteData[1].value],
		best: [],
		switch: ['bar'],
		available: false,
		terms: false,
		date: new Date('2014-08-18T21:11:54'),
		hello: 'some text',
		cities: ['losangeles'],
		gender: '',
		birthday: new Date('2014-08-18'),
		break: new Date('2019-04-20T16:20:00'),
		hidden: 'secret',
		keyboardDateTime: new Date('2017-06-21T17:20:00'),
		dateTime: new Date('2023-05-25T12:29:10'),
		dateTimeLocale: new Date('2023-04-26T12:29:10'),
	};

	const onSubmit = (values: FormData) => {
		setSubmittedValues(values);
	};

	const onReset = () => {
		setSubmittedValues(undefined);
	};

	const helperText = '* Required';

	const filter = createFilterOptions<AutocompleteData>();

	let key = 0;

	const formFields = [
		<Autocomplete
			key={key++}
			label="Choose one planet"
			name="planet_one"
			multiple={false}
			required={required.planet}
			options={autocompleteData}
			getOptionValue={option => option.value}
			getOptionLabel={option => option.label}
			renderOption={option => option.label}
			disableCloseOnSelect={true}
			helperText={helperText}
			freeSolo={true}
			onChange={(_event, newValue, reason, details) => {
				if (newValue && reason === 'select-option' && details?.option.inputValue) {
					// Create a new value from the user input
					autocompleteData.push({
						value: details?.option.inputValue,
						label: details?.option.inputValue,
					});
				}
			}}
			filterOptions={(options, params) => {
				const filtered = filter(options, params);

				// Suggest the creation of a new value
				if (params.inputValue.length) {
					filtered.push({
						inputValue: params.inputValue,
						label: `Add "${params.inputValue}"`,
						value: params.inputValue,
					});
				}

				return filtered;
			}}
			selectOnFocus
			clearOnBlur
			handleHomeEndKeys
		/>,
		<Autocomplete
			key={key++}
			label="Choose at least one planet"
			name="planet"
			multiple={true}
			required={required.planet}
			options={autocompleteData}
			getOptionValue={option => option.value}
			getOptionLabel={option => option.label}
			disableCloseOnSelect={true}
			renderOption={(option, { selected }) =>
				option.inputValue ? (
					option.label
				) : (
					<>
						<MuiCheckbox style={{ marginRight: 8 }} checked={selected} />
						{option.label}
					</>
				)
			}
			helperText={helperText}
			freeSolo={true}
			onChange={(_event, newValue, reason, details) => {
				if (newValue && reason === 'select-option' && details?.option.inputValue) {
					// Create a new value from the user input
					autocompleteData.push({
						value: details?.option.inputValue,
						label: details?.option.inputValue,
					});
				}
			}}
			filterOptions={(options, params) => {
				const filtered = filter(options, params);

				// Suggest the creation of a new value
				if (params.inputValue !== '') {
					filtered.push({
						inputValue: params.inputValue,
						label: `Add "${params.inputValue}"`,
						value: params.inputValue,
					});
				}

				return filtered;
			}}
			selectOnFocus
			clearOnBlur
			handleHomeEndKeys
			textFieldProps={{
				InputProps: {
					startAdornment: <InputAdornment position="start">🪐</InputAdornment>,
					endAdornment: <InputAdornment position="end">🪐</InputAdornment>,
				},
			}}
		/>,
		<Switches
			key={key++}
			label="Available"
			name="available"
			required={required.available}
			data={{ label: 'available', value: 'available' }}
			helperText={helperText}
		/>,
		<Switches
			key={key++}
			label="Check at least one..."
			name="switch"
			required={required.switch}
			data={switchData}
			helperText={helperText}
		/>,
		<Checkboxes
			key={key++}
			label="Check at least one..."
			name="best"
			required={required.best}
			data={checkboxData}
			helperText={helperText}
		/>,
		<Radios
			key={key++}
			label="Pick a gender"
			name="gender"
			required={required.gender}
			data={radioData}
			helperText={helperText}
		/>,
		<KeyboardDatePicker
			key={key++}
			label="Pick a date"
			name="date"
			required={required.date}
			dateFunsUtils={DateFnsUtils}
			helperText={helperText}
		/>,
		<KeyboardDateTimePicker
			key={key++}
			label="Pick a date and time"
			name="keyboardDateTime"
			required={required.keyboardDateTime}
			dateFunsUtils={DateFnsUtils}
			helperText={helperText}
		/>,
		<DatePicker
			key={key++}
			label="Birthday"
			name="birthday"
			required={required.birthday}
			dateFunsUtils={DateFnsUtils}
			helperText={helperText}
		/>,
		<TimePicker
			key={key++}
			label="Break time"
			name="break"
			required={required.break}
			dateFunsUtils={DateFnsUtils}
			helperText={helperText}
		/>,
		<DateTimePicker
			key={key++}
			label="Pick a date and time"
			name="dateTime"
			required={required.dateTime}
			dateFunsUtils={DateFnsUtils}
			helperText={helperText}
		/>,
		<DateTimePicker
			key={key++}
			locale={ruLocale}
			label="Pick a date and time (russian locale)"
			name="dateTimeLocale"
			required={required.dateTimeLocale}
			dateFunsUtils={DateFnsUtils}
			helperText={helperText}
		/>,
		<TextField key={key++} label="Hello world" name="hello" required={required.hello} helperText={helperText} />,
		<TextField
			key={key++}
			label="Hidden text"
			name="hidden"
			type="password"
			autoComplete="new-password"
			required={required.hidden}
			helperText={helperText}
		/>,
		<Select
			key={key++}
			label="Pick some cities..."
			name="cities"
			required={required.cities}
			data={selectData}
			multiple={true}
			helperText="Woah helper text"
		/>,
		<Checkboxes
			key={key++}
			name="terms"
			required={required.terms}
			data={{
				label: 'Do you accept the terms?',
				value: true,
			}}
			helperText={helperText}
		/>,
	];

	return (
		<Paper className={classes.paper}>
			<Form
				onSubmit={onSubmit}
				initialValues={submittedValues ? submittedValues : initialValues}
				subscription={subscription}
				validate={validate}
				key={subscription as any}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} noValidate={true} autoComplete="new-password">
						<Grid container>
							<Grid item xs={6}>
								{formFields.map((field, index) => (
									<Grid item key={index}>
										{field}
									</Grid>
								))}
								<Grid item className={classes.buttons}>
									<Button type="button" variant="contained" onClick={onReset} disabled={submitting}>
										Reset
									</Button>
									<Button variant="contained" color="primary" type="submit" disabled={submitting}>
										Submit
									</Button>
								</Grid>
							</Grid>
							<Grid item xs={6}>
								<Grid item>
									<Paper className={classes.paperInner} elevation={3}>
										<Typography>
											<strong>Render count:</strong> <RenderCount />
										</Typography>
									</Paper>
								</Grid>
								<Grid item>
									<Paper className={classes.paperInner} elevation={3}>
										<Typography>
											<strong>Form field data</strong>
										</Typography>
										<Debug />
									</Paper>
								</Grid>
								<Grid item>
									<Paper className={classes.paperInner} elevation={3}>
										<Typography>
											<strong>Submitted data</strong>
										</Typography>
										<pre>
											{JSON.stringify(submittedValues ? submittedValues : {}, undefined, 2)}
										</pre>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
			/>
		</Paper>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
