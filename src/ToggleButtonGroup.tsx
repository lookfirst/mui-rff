import React, { ReactNode } from "react";

import {
  FormControlLabelProps,
  FormControlProps,
  FormGroupProps,
  FormHelperTextProps,
  FormLabelProps,
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButtonGroupProps as MuiToggleButtonGroupProps,
} from "@mui/material";

import { Field, FieldProps } from "react-final-form";
import {
  useFieldForErrors,
  ShowErrorFunc,
  showErrorOnChange,
  ErrorMessage,
} from "mui-rff";

export interface ToggleButtonGroupProps
  extends Partial<Omit<MuiToggleButtonGroupProps, "onChange">> {
  name: string;
  label?: string | number | React.ReactElement;
  required?: boolean;
  helperText?: string;
  fieldProps?: Partial<FieldProps<any, any>>;
  formControlProps?: Partial<FormControlProps>;
  formGroupProps?: Partial<FormGroupProps>;
  formLabelProps?: Partial<FormLabelProps>;
  formControlLabelProps?: Partial<FormControlLabelProps>;
  formHelperTextProps?: Partial<FormHelperTextProps>;
  showError?: ShowErrorFunc;
  children?: ReactNode;
}

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const {
    name,
    label,
    required,
    helperText,
    fieldProps,
    formControlProps,
    formGroupProps,
    formLabelProps,
    formControlLabelProps,
    formHelperTextProps,
    children,
    showError = showErrorOnChange,
    ...restToggleButtonGroupProps
  } = props;

  const field = useFieldForErrors(name);
  const isError = showError(field);

  return (
    <Field
      type="checkbox"
      name={name}
      render={({ input: { name, value, onChange, checked, ...restInput } }) => (
        <>
          <MuiToggleButtonGroup
            value={value}
            disabled={props.disabled}
            children={children}
            onChange={onChange}
            {...restToggleButtonGroupProps}
          />
          <ErrorMessage
            showError={isError}
            meta={field.meta}
            formHelperTextProps={formHelperTextProps}
            helperText={helperText}
          />
        </>
      )}
      {...fieldProps}
    />
  );
}
