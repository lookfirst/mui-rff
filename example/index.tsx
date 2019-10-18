import 'react-app-polyfill/ie11';

import { Grid, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { Form } from 'react-final-form';

import * as Yup from 'yup';

import { CheckboxData, Checkboxes, DatePicker, makeValidate } from '../src';

interface FormData {
	best: string[];
	date: Date;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			marginTop: theme.spacing(3),
			padding: theme.spacing(3),
		},
		breadcrumbs: {
			paddingBottom: theme.spacing(2),
		},
	})
);

const validateSchema = makeValidate(
	Yup.object().shape({
		best: Yup.array().min(1),
		date: Yup.date().required(),
	})
);

const App = () => {
	const classes = useStyles();

	const checkboxData: CheckboxData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const initialValues: FormData = {
		best: ['bar'],
		date: new Date(),
	};

	const onSubmit = (values: FormData) => {
		console.log(values);
	};

	const validate = (values: FormData) => {
		return validateSchema(values);
	};

	return (
		<Paper className={classes.paper}>
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={validate}
				render={({ handleSubmit, values, errors }) => (
					<form onSubmit={handleSubmit} noValidate>
						<Grid container>
							<Grid item xs>
								<Checkboxes
									label="Check one please"
									required={true}
									name="best"
									data={checkboxData}
									error={errors['best']}
								/>
							</Grid>
							<Grid item>
								<pre>{JSON.stringify(values, undefined, 2)}</pre>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item>
								<DatePicker label="Pick a date" name="date" required={true} />
							</Grid>
						</Grid>
					</form>
				)}
			/>
		</Paper>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
