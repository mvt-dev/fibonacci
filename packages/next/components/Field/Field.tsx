import React from 'react';
import {useFormContext, Controller} from 'react-hook-form';
import {TextField, MenuItem} from '@material-ui/core';

enum FieldTypes {
  TEXT = 'text',
  SELECT = 'select'
};

interface FieldProps {
  type: FieldTypes;
  name: string;
  label?: string;
  value?: string;
  rules?: {};
  options?: Array<{value: string, label: string}>;
}

const Field = (props: FieldProps): React.ReactElement => {
  const {
    type,
    name,
    value,
    label,
    rules,
    options
  } = props;
  const {control, errors} = useFormContext();

  let field;
  switch (type) {
    case FieldTypes.TEXT:
      field = (
        <TextField
          fullWidth
          id={name}
          helperText={errors[name] ? errors[name].message : null}
          label={label}
          error={!!errors[name]}
          variant="outlined"
          size="small"
        />
      );
      break;
    case FieldTypes.SELECT:
      field = (
        <TextField
          select
          fullWidth
          id={name}
          helperText={errors[name] ? errors[name].message : null}
          label={label}
          error={!!errors[name]}
          variant="outlined"
          size="small"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
      break;
  }

  return (
    <Controller
      as={field}
      name={name}
      control={control}
      defaultValue={value || ''}
      rules={rules}
    />
  );
};

export {
  Field,
  FieldTypes
};
