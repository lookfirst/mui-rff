import { ReactNode } from 'react';
import { AnySchema as YupSchema, ValidationError as YupValidationError } from 'yup';

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
function get(obj: any, path: string, defaultValue?: any) {
	const result = String.prototype.split
		.call(path, /[,[\].]+?/)
		.filter(Boolean)
		.reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
	return result === undefined || result === obj ? defaultValue : result;
}

// https://stackoverflow.com/questions/54733539/javascript-implementation-of-lodash-set-method
function set(obj: any, path: any, value: any) {
	if (Object(obj) !== obj) return obj; // When obj is not an object
	// If not yet an array, get the keys from the string-path
	if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
	path.slice(0, -1).reduce(
		(
			a: any,
			c: any,
			i: number, // Iterate all of them except the last one
		) =>
			Object(a[c]) === a[c] // Does the key exist and is its value an object?
				? // Yes: then follow that path
				  a[c]
				: // No: create the key. Is the next key a potential array-index?
				  (a[c] =
						Math.abs(path[i + 1]) >> 0 === +path[i + 1]
							? [] // Yes: assign a new array object
							: {}), // No: assign a new plain object
		obj,
	)[path[path.length - 1]] = value; // Finally assign the value to the last key
	return obj; // Return the top-level object to allow chaining
}

// Still seems buggy. https://stackoverflow.com/questions/63767199/typescript-eslint-no-unused-vars-false-positive-in-type-declarations
// eslint-disable-next-line autofix/no-unused-vars
export type Translator = (errorObj: YupValidationError) => string | ReactNode;

export interface ValidationError {
	[key: string]: ValidationError | string;
}

function normalizeValidationError(err: YupValidationError, translator?: Translator): ValidationError {
	return err.inner.reduce((errors, innerError) => {
		const { path, message } = innerError;
		const el: ReturnType<Translator> = translator ? translator(innerError) : message;

		if (path && errors.hasOwnProperty(path)) {
			const prev = get(errors, path);
			prev.push(el);
			set(errors, path, prev);
		} else {
			set(errors, path, [el]);
		}
		return errors;
	}, {});
}

/**
 * Wraps the execution of a Yup schema to return an Promise<ValidationError>
 * where the key is the form field and the value is the error string.
 */
export function makeValidate<T>(validator: YupSchema<T>, translator?: Translator) {
	return async (values: T): Promise<ValidationError> => {
		try {
			await validator.validate(values, { abortEarly: false });
			return {};
		} catch (err) {
			return normalizeValidationError(err, translator);
		}
	};
}

/**
 * Wraps the sync execution of a Yup schema to return an ValidationError
 * where the key is the form field and the value is the error string.
 */
export function makeValidateSync<T>(validator: YupSchema<T>, translator?: Translator) {
	return (values: T): ValidationError => {
		try {
			validator.validateSync(values, { abortEarly: false });
			return {};
		} catch (err) {
			return normalizeValidationError(err, translator);
		}
	};
}

/**
 * Uses the private _exclusive field in the schema to get whether or not
 * the field is marked as required or not.
 */
export function makeRequired<T>(schema: YupSchema<T>) {
	const fields = (schema as any).fields;
	return Object.keys(fields).reduce((accu, field) => {
		if (fields[field].fields) {
			accu[field] = makeRequired(fields[field]);
		} else {
			accu[field] = !!fields[field].exclusiveTests.required;
		}
		return accu;
	}, {} as any);
}
