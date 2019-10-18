import { Schema } from 'yup';
import { set, get } from 'lodash';

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
