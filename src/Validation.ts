import { Schema } from 'yup';
import { set, get } from 'lodash';

/**
 * This function wraps the execution of a Yup schema to return an object
 * where the key is the form field and the value is the error string.
 */
export function makeValidate<T>(validator: Schema<T>) {
	return async (values: T) => {
		try {
			await validator.validate(values, { abortEarly: false });
		} catch (err) {
			return err.inner.reduce((errors: any, { path, message }: any) => {
				if (errors.hasOwnProperty(path)) {
					set(errors, path, get(errors, path) + ' ' + message);
				} else {
					set(errors, path, message);
				}
				return errors;
			}, {});
		}
	};
}
