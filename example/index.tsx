import 'react-app-polyfill/ie11';

import * as Joi from '@hapi/joi';

import { Grid, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { Form } from 'react-final-form';

import { CheckboxData, Checkboxes } from '../src';

interface FormData {
	best: string[];
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

const schema = Joi.object()
	.keys({
		best: Joi.array().min(1),
	})
	.error(new Error('One item must be checked.'));

const App = () => {
	const classes = useStyles();

	const checkboxData: CheckboxData[] = [
		{ label: 'Ack', value: 'ack' },
		{ label: 'Bar', value: 'bar' },
		{ label: 'Foo', value: 'foo' },
	];

	const initialValues: FormData = {
		best: ['bar'],
	};

	const onSubmit = (values: FormData) => {
		console.log(values);
	};

	const validate = (values: FormData) => {
		const validationResult = schema.validate(values);
		if (validationResult && validationResult.error) {
			return { best: validationResult.error.message };
		}
		return;
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
									label="Best"
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
					</form>
				)}
			/>
		</Paper>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
