import React, { ReactNode } from "react";

import {
  FormHelperTextProps,
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButtonGroupProps as MuiToggleButtonGroupProps,
} from "@mui/material";

import { Field } from "react-final-form";
import {
  useFieldForErrors,
  ShowErrorFunc,
  showErrorOnChange,
  ErrorMessage,
} from "mui-rff";

export interface ToggleButtonGroupProps
  extends Partial<Omit<MuiToggleButtonGroupProps, "onChange">> {
  name: string;
  helperText?: string;
  formHelperTextProps?: Partial<FormHelperTextProps>;
  showError?: ShowErrorFunc;
  children?: ReactNode;
}

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const {
    name,
    helperText,
    formHelperTextProps,
    children,
    showError = showErrorOnChange,
    ...restToggleButtonGroupProps
  } = props;

  const field = useFieldForErrors(name);
  const isError = showError(field);

  return (
    <Field name={name}>
      {(fieldProps) => {
        return (
          <>
            <MuiToggleButtonGroup
              value={fieldProps.input.value}
              disabled={props.disabled}
              children={children}
              onChange={(_, value) => {
                fieldProps.input.onChange(value);
              }}
              {...restToggleButtonGroupProps}
            />
            <ErrorMessage
              showError={isError}
              meta={field.meta}
              formHelperTextProps={formHelperTextProps}
              helperText={helperText}
            />
          </>
        );
      }}
    </Field>
  );
}
