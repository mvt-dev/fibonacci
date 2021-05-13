import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@material-ui/core';

interface FieldSelectProps {
  name: string;
  label?: string;
  value?: any;
  rules?: {};
  options?: Array<{value: string, label: string}>;
  onChange?: (value: string) => void;
}

const FieldSelect = (props: FieldSelectProps): React.ReactElement => {
  const {
    name,
    value,
    label,
    rules,
    options,
    onChange
  } = props;
  const { control, setValue, watch } = useFormContext();

  useEffect(() => {
    if (value) setValue(name, value);
  }, [value]);

  const valueWatch = watch(name);

  useEffect(() => {
    if (onChange) onChange(valueWatch);
  });

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value || ''}
      rules={rules}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <TextField
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          inputRef={ref}
          select
          fullWidth
          id={name}
          helperText={error?.message || null}
          label={label}
          error={!!error}
          variant="outlined"
          size="small"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default FieldSelect;
