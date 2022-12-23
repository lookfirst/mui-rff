import * as Yup from 'yup';
import { Button, ToggleButton } from '@mui/material';
import { Form } from 'react-final-form';
import { ToggleButtonGroup, makeValidateSync } from '../src';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	selection: string[];
}

describe('ToggleButtonGroup', () => {
	const initialValues: FormData = {
		selection: ['A'],
	};

	function ToggleButtonGroupComponent({ initialValues, validator }: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};
		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={validator}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} noValidate>
						<ToggleButtonGroup name="toggle">
							<ToggleButton value={'A'}>
								<p>Option A</p>
							</ToggleButton>
						</ToggleButtonGroup>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							disabled={submitting}
							data-testid="submit"
						>
							Submit
						</Button>
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		const rendered = render(<ToggleButtonGroupComponent initialValues={initialValues} />);
		expect(rendered).toMatchSnapshot();
	});

	it('turns red if empty and required', async () => {
		const validateSchema = makeValidateSync(
			Yup.object().shape({
				selection: Yup.array(Yup.string().required()).min(1),
			}),
		);

		const rendered = render(
			<ToggleButtonGroupComponent initialValues={{ selection: [] }} validator={validateSchema} />,
		);

		const submit = await rendered.findByTestId('submit');
		fireEvent.click(submit);

		expect(rendered).toMatchSnapshot();
	});
});
