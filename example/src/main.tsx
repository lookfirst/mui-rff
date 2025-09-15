import 'date-fns';
import {
	AppBar,
	Box,
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
} from '@mui/material';
import {
	createTheme,
	StyledEngineProvider,
	ThemeProvider,
} from '@mui/material/styles';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { styled } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import type { FormSubscription } from 'final-form';
import {
	Autocomplete,
	type AutocompleteData,
	type CheckboxData,
	Checkboxes,
	DatePicker,
	DateTimePicker,
	Debug,
	makeRequired,
	makeValidate,
	type RadioData,
	Radios,
	Select,
	type SelectData,
	type SwitchData,
	Switches,
	TextField,
	TimePicker,
} from 'mui-rff';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Form } from 'react-final-form';
import { array, boolean, date, object, string } from 'yup';

const theme = createTheme({
	components: {
		MuiTextField: {
			defaultProps: {
				margin: 'normal',
			},
		},
		MuiFormControl: {
			defaultProps: {
				margin: 'normal',
			},
		},
	},
});

const Subscription = styled(Paper)(({ theme: subscriptionTheme }) => ({
	marginTop: subscriptionTheme.spacing(3),
	padding: subscriptionTheme.spacing(3),
}));

/**
 * Little helper to see how good rendering is
 */

// biome-ignore lint/nursery/useReactFunctionComponents: too lazy to convert this
class RenderCount extends React.Component {
	renders = 0;

	render() {
		return <>{++this.renders}</>;
	}
}

type FormData = {
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
	firstName: string;
	lastName: string;
};

const schema = object({
	planet_one: string().required(),
	planet: array().of(string().required()).min(1).required(),
	best: array().of(string().required()).min(1).required(),
	available: boolean().oneOf([true], 'We are not available!').required(),
	switch: array().of(string().required()).min(1).required(),
	terms: boolean().oneOf([true], 'Please accept the terms').required(),
	date: date().required(),
	hello: string().required(),
	cities: array().of(string().required()).min(1).required(),
	gender: string().required(),
	birthday: date().required(),
	break: date().required(),
	hidden: string().required(),
	keyboardDateTime: date().required(),
	dateTime: date().required(),
	dateTimeLocale: date().required(),
	firstName: string().required(),
	lastName: string().required(),
});

/**
 * Uses the optional helper makeValidate function to format the error messages
 * into something usable by final form.
 */
const validate = makeValidate(schema as any);

/**
 * Grabs all the required fields from the schema so that they can be passed into
 * the components without having to declare them in both the schema and the component.
 */
const required = makeRequired(schema as any);

function AppWrapper() {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<App />
				</LocalizationProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

function App() {
	const subscription = { submitting: true };
	const [subscriptionState, setSubscriptionState] = useState<
		FormSubscription | undefined
	>(subscription);

	const onChange = () => {
		setSubscriptionState(
			subscriptionState === undefined ? subscription : undefined
		);
	};

	return (
		<Box mx={2}>
			<CssBaseline />

			<Subscription>
				<FormControlLabel
					control={
						<MuiCheckbox
							checked={subscriptionState !== undefined}
							color="secondary"
							onChange={onChange}
							value={true}
						/>
					}
					label="Enable React Final Form subscription render optimization. Watch the render count when interacting with the form."
				/>
				<Link
					href="https://final-form.org/docs/react-final-form/types/FormProps#subscription"
					target="_blank"
					underline="hover"
				>
					Documentation
				</Link>
			</Subscription>

			<MainForm subscription={subscriptionState} />

			<Footer />
		</Box>
	);
}

// biome-ignore lint/nursery/noShadow: theme is ok here
const Offset = styled('div')(({ theme }) => (theme.mixins as any).toolbar);

function Footer() {
	return (
		<>
			<AppBar
				color="inherit"
				elevation={0}
				position="fixed"
				sx={{ top: 'auto', bottom: 0, backgroundColor: 'lightblue' }}
			>
				<Toolbar>
					<Grid
						alignItems="center"
						container
						direction="row"
						justifyContent="center"
						spacing={1}
					>
						<Grid>
							<Link
								color="textSecondary"
								href="https://github.com/lookfirst/mui-rff"
								target="_blank"
								underline="hover"
								variant="body1"
							>
								MUI-RFF Github Project
							</Link>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Offset />
		</>
	);
}

const PaperInner = styled(Paper)(({ theme: paperTheme }) => ({
	marginLeft: paperTheme.spacing(3),
	marginTop: paperTheme.spacing(3),
	padding: paperTheme.spacing(3),
}));

function MainForm({ subscription }: { subscription: any }) {
	const [submittedValues, setSubmittedValues] = useState<
		FormData | undefined
	>(undefined);

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
		firstName: '',
		lastName: '',
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
			clearOnBlur
			disableCloseOnSelect={true}
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
			freeSolo={true}
			getOptionLabel={(option: string | AutocompleteData) =>
				(option as AutocompleteData).label
			}
			getOptionValue={(option) => option.value}
			handleHomeEndKeys
			helperText={helperText}
			key={key++}
			label="Choose one planet"
			multiple={false}
			name="planet_one"
			onChange={(_event, newValue, reason, details) => {
				if (
					newValue &&
					reason === 'selectOption' &&
					details?.option.inputValue
				) {
					// Create a new value from the user input
					autocompleteData.push({
						value: details?.option.inputValue,
						label: details?.option.inputValue,
					});
				}
			}}
			options={autocompleteData}
			renderOption={(props, option) => {
				const { key: propsKey, ...otherProps } = props;
				return (
					<li key={propsKey} {...otherProps}>
						{option.label}
					</li>
				);
			}}
			required={required.planet}
			selectOnFocus
		/>,
		<Autocomplete
			clearOnBlur
			disableCloseOnSelect={true}
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
			freeSolo={true}
			getOptionLabel={(option: string | AutocompleteData) =>
				(option as AutocompleteData).label
			}
			getOptionValue={(option) => option.value}
			handleHomeEndKeys
			helperText={helperText}
			key={key++}
			label="Choose at least one planet"
			multiple={true}
			name="planet"
			onChange={(_event, newValue, reason, details) => {
				if (
					newValue &&
					reason === 'selectOption' &&
					details?.option.inputValue
				) {
					// Create a new value from the user input
					autocompleteData.push({
						value: details?.option.inputValue,
						label: details?.option.inputValue,
					});
				}
			}}
			options={autocompleteData}
			renderOption={(props, option, { selected }) => {
				if (option.inputValue) {
					return option.label;
				}
				const { key: propsKey, ...otherProps } = props;
				return (
					<li key={propsKey} {...otherProps}>
						<MuiCheckbox
							checked={selected}
							style={{ marginRight: 8 }}
						/>
						{option.label}
					</li>
				);
			}}
			required={required.planet}
			selectOnFocus
			textFieldProps={{
				InputProps: {
					startAdornment: (
						<InputAdornment position="start">🪐</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">🪐</InputAdornment>
					),
				},
			}}
		/>,
		<Switches
			data={{ label: 'available', value: 'available' }}
			helperText={helperText}
			key={key++}
			label="Available"
			name="available"
			required={required.available}
		/>,
		<Switches
			data={switchData}
			helperText={helperText}
			key={key++}
			label="Check at least one..."
			name="switch"
			required={required.switch}
		/>,
		<Checkboxes
			data={checkboxData}
			helperText={helperText}
			key={key++}
			label="Check at least one..."
			name="best"
			required={required.best}
		/>,
		<Radios
			data={radioData}
			helperText={helperText}
			key={key++}
			label="Pick a gender"
			name="gender"
			required={required.gender}
		/>,
		<DatePicker
			key={key++}
			label="Birthday"
			name="birthday"
			required={required.birthday}
		/>,
		<TimePicker
			key={key++}
			label="Break time"
			name="break"
			required={required.break}
		/>,
		<DateTimePicker
			key={key++}
			label="Pick a date and time"
			name="dateTime"
			required={required.dateTime}
		/>,
		<LocalizationProvider
			adapterLocale={fr}
			dateAdapter={AdapterDateFns}
			key={key++}
		>
			<DateTimePicker
				key={key++}
				label="Pick a date and time (french locale)"
				name="dateTimeLocale"
				required={required.dateTimeLocale}
			/>
		</LocalizationProvider>,
		<TextField
			helperText={helperText}
			key={key++}
			label="Hello world"
			name="hello"
			required={required.hello}
		/>,
		<TextField
			autoComplete="new-password"
			helperText={helperText}
			key={key++}
			label="Hidden text"
			name="hidden"
			required={required.hidden}
			type="password"
		/>,
		<Select
			data={selectData}
			helperText="Woah helper text"
			key={key++}
			label="Pick some cities..."
			multiple={true}
			name="cities"
			required={required.cities}
		/>,
		<Checkboxes
			data={{
				label: 'Do you accept the terms?',
				value: true,
			}}
			helperText={helperText}
			key={key++}
			name="terms"
			required={required.terms}
		/>,
		<TextField
			key={key++}
			label="Field with inputProps"
			name="firstName"
			required={true}
			slotProps={{
				input: {
					autoComplete: 'name',
				},
			}}
		/>,
		<TextField
			key={key++}
			label="Field WITHOUT inputProps"
			name="lastName"
			required={true}
		/>,
	];

	return (
		<Paper sx={{ marginTop: 3, padding: 3, marginBottom: 5 }}>
			<Form
				initialValues={
					submittedValues ? submittedValues : initialValues
				}
				key={subscription as any}
				onSubmit={onSubmit}
				render={({ handleSubmit, submitting }) => (
					<form
						autoComplete="new-password"
						noValidate={true}
						onSubmit={handleSubmit}
					>
						<Grid container>
							<Grid size={6}>
								{formFields.map((field) => (
									<Grid key={field.key}>{field}</Grid>
								))}
								<Grid>
									<Button
										color="inherit"
										disabled={submitting}
										onClick={onReset}
										sx={{ mt: 3, mr: 1 }}
										type="button"
										variant="contained"
									>
										Reset
									</Button>
									<Button
										disabled={submitting}
										sx={{ mt: 3, mr: 1 }}
										type="submit"
										variant="contained"
									>
										Submit
									</Button>
								</Grid>
							</Grid>
							<Grid size={6}>
								<Grid>
									<Paper
										elevation={3}
										sx={{ ml: 3, mt: 3, p: 3 }}
									>
										<Typography>
											<strong>Render count:</strong>{' '}
											<RenderCount />
										</Typography>
									</Paper>
								</Grid>
								<Grid>
									<PaperInner elevation={3}>
										<Typography>
											<strong>Form field data</strong>
										</Typography>
										<Debug />
									</PaperInner>
								</Grid>
								<Grid>
									<PaperInner elevation={3}>
										<Typography>
											<strong>Submitted data</strong>
										</Typography>
										<pre>
											{JSON.stringify(
												submittedValues
													? submittedValues
													: {},
												undefined,
												2
											)}
										</pre>
									</PaperInner>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
				subscription={subscription}
				validate={validate}
			/>
		</Paper>
	);
}

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<AppWrapper />
	</React.StrictMode>
);
