import type { ReactNode } from 'react';
import type {
	AnySchema as YupSchema,
	ValidationError as YupValidationError,
} from 'yup';

const getRegex = /[,[\].]+?/;

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
function get(obj: any, path: string, defaultValue?: any) {
	const result = String.prototype.split
		.call(path, getRegex)
		.filter(Boolean)
		.reduce(
			(res, key) => (res !== null && res !== undefined ? res[key] : res),
			obj
		);
	return result === undefined || result === obj ? defaultValue : result;
}

// https://stackoverflow.com/questions/54733539/javascript-implementation-of-lodash-set-method
function set(obj: any, path: any, value: any) {
	// biome-ignore lint/suspicious/noConstantBinaryExpressions: works fine
	if (new Object(obj) !== obj) {
		return obj; // When an obj is not an object
	}
	// If not yet an array, get the keys from the string-path
	if (!Array.isArray(path)) {
		path = path.toString().match(/[^.[\]]+/g) || [];
	}
	path.slice(0, -1).reduce(
		(
			a: any,
			c: any,
			i: number // Iterate all of them except the last one
		) =>
			// biome-ignore lint/suspicious/noConstantBinaryExpressions: it is fine
			new Object(a[c]) === a[c] // Does the key exist and is its value an object?
				? // Yes: then follow that path
					a[c]
				: // No: create the key. Is the next key a potential array-index?
					// biome-ignore lint/suspicious/noAssignInExpressions: it is ok
					(a[c] =
						// biome-ignore lint/suspicious/noBitwiseOperators: it is fine
						Math.abs(path[i + 1]) >> 0 === +path[i + 1]
							? [] // Yes: assign a new array object
							: {}), // No: assign a new plain object
		obj
	)[path.at(-1)] = value; // Finally, assign the value to the last key
	return obj; // Return the top-level object to allow chaining
}

export type Translator = (errorObj: YupValidationError) => string | ReactNode;

export type ValidationError = {
	[key: string]: ValidationError | string;
};

function normalizeValidationError(
	err: YupValidationError,
	translator?: Translator
): ValidationError {
	return err.inner.reduce((errors, innerError) => {
		const { path, message } = innerError;
		const el: ReturnType<Translator> =
			translator !== undefined ? translator(innerError) : message;

		if (path && get(errors, path)) {
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
 * Wraps the execution of a Yup schema to return a Promise<ValidationError>
 * where the key is the form field and the value is the error string.
 */
export function makeValidate<T>(
	validator: YupSchema<T>,
	translator?: Translator
) {
	return async (values: T): Promise<ValidationError> => {
		try {
			await validator.validate(values, { abortEarly: false });
			return {};
		} catch (err) {
			return normalizeValidationError(
				err as YupValidationError,
				translator
			);
		}
	};
}

/**
 * Wraps the sync execution of a Yup schema to return a ValidationError
 * where the key is the form field and the value is the error string.
 */
export function makeValidateSync<T>(
	validator: YupSchema<T>,
	translator?: Translator
) {
	return (values: T): ValidationError => {
		try {
			validator.validateSync(values, { abortEarly: false });
			return {};
		} catch (err) {
			return normalizeValidationError(
				err as YupValidationError,
				translator
			);
		}
	};
}

/**
 * Uses the spec field in the schema to get whether
 * the field is marked as required or not.
 */
export function makeRequired<T>(schema: YupSchema<T>) {
	const fields = (schema as any).fields;
	return Object.keys(fields).reduce((accu, field) => {
		if (fields[field].fields) {
			accu[field] = makeRequired(fields[field]);
		} else {
			accu[field] = !fields[field].spec.optional;
		}
		return accu;
	}, {} as any);
}
