import {
	AppBar,
	Checkbox as MuiCheckbox,
	FormControlLabel,
	Grid,
	Link,
	Paper,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React, { useState } from 'react';
import 'react-app-polyfill/ie11';
import ReactDOM from 'react-dom';

import { Form } from 'react-final-form';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import * as Yup from 'yup';

import {
	Checkboxes,
	CheckboxData,
	Select,
	SelectData,
	Radios,
	RadioData,
	KeyboardDatePicker,
	DatePicker,
	TimePicker,
	makeValidate,
	makeRequired,
	TextField,
	Debug,
} from '../src';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
		},
	})
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
	best: string[];
	employed: boolean;
	date: Date;
	hello: string;
	cities: string;
	gender: string;
	birthday: Date;
	break: Date;
}

const schema = Yup.object().shape({
	best: Yup.array()
		.min(1)
		.required(),
	employed: Yup.boolean().required(),
	date: Yup.date().required(),
	hello: Yup.string().required(),
	cities: Yup.string().required(),
	gender: Yup.string().required(),
	birthday: Yup.date().required(),
	break: Yup.date().required(),
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

	const subscription = { submitting: true, pristine: true };
	const [subscriptionState, setSubscriptionState] = useState<any>(subscription);

	const onChange = () => {
		setSubscriptionState(
			subscriptionState === undefined ? subscription : undefined
		);
	};

	return (
		<>
			<Paper className={classes.paper}>
				<FormControlLabel
					control={
						<MuiCheckbox
							checked={subscriptionState !== undefined}
							onChange={onChange}
							value={true}
						/>
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
		</>
	);
}

const useFormStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
		},
		paperInner: {
			marginLeft: theme.spacing(3),
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
		},
		footer: {
			top: 'auto',
			bottom: 0,
		},
	})
);

function MainForm({ subscription }: any) {
	const classes = useFormStyles();

	const checkboxData: CheckboxData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const selectData: SelectData[] = [
		{ label: 'Pick one...', value: '' },
		{ label: 'San Diego', value: 'sandiego' },
		{ label: 'Los Angeles', value: 'losangeles' },
		{ label: 'Saigon', value: 'saigon' },
	];

	const radioData: RadioData[] = [
		{ label: 'Female', value: 'female' },
		{ label: 'Male', value: 'male' },
		{ label: 'Both', value: 'both' },
	];

	const initialValues: FormData = {
		best: ['bar'],
		employed: true,
		date: new Date('2014-08-18T21:11:54'),
		hello: 'some text',
		cities: 'losangeles',
		gender: 'both',
		birthday: new Date('2014-08-18'),
		break: new Date('2019-04-20T16:20:00'),
	};

	const onSubmit = (values: FormData) => {
		console.log(values);
	};

	return (
		<>
			<Paper className={classes.paper}>
				<Form
					onSubmit={onSubmit}
					initialValues={initialValues}
					subscription={subscription}
					validate={validate}
					key={subscription as any}
					render={({ handleSubmit }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Grid container>
								<Grid item xs={6}>
									<Grid item>
										<Checkboxes
											label="Check at least one..."
											name="best"
											required={required.best}
											data={checkboxData}
										/>
									</Grid>
									<Grid item>
										<Radios
											label="Pick a gender"
											name="gender"
											required={required.gender}
											data={radioData}
										/>
									</Grid>
									<Grid item>
										<Checkboxes
											name="employed"
											required={required.employed}
											data={{ label: 'Employed', value: true }}
										/>
									</Grid>
									<Grid item>
										<KeyboardDatePicker
											label="Pick a date"
											name="date"
											required={required.date}
											dateFunsUtils={DateFnsUtils}
										/>
									</Grid>
									<Grid item>
										<DatePicker
											label="Birthday"
											name="birthday"
											required={required.birthday}
											dateFunsUtils={DateFnsUtils}
										/>
									</Grid>
									<Grid item>
										<TimePicker
											label="Break time"
											name="break"
											required={required.break}
											dateFunsUtils={DateFnsUtils}
										/>
									</Grid>
									<Grid item>
										<TextField
											label="Hello world"
											name="hello"
											required={required.hello}
										/>
									</Grid>
									<Grid item>
										<Select
											label="Pick a city..."
											name="cities"
											required={required.cities}
											data={selectData}
										/>
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
								</Grid>
							</Grid>
						</form>
					)}
				/>
			</Paper>
			<AppBar
				color="inherit"
				position="fixed"
				elevation={0}
				className={classes.footer}
			>
				<Toolbar>
					<Grid
						container
						spacing={1}
						alignItems="center"
						justify="center"
						direction="row"
					>
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
		</>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
