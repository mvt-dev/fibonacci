import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@material-ui/core';

interface FieldTextProps {
  name: string;
  label?: string;
  value?: any;
  rules?: {};
}

const FieldText = (props: FieldTextProps): React.ReactElement => {
  const {
    name,
    value,
    label,
    rules,
  } = props;
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (value) setValue(name, value);
  }, [value]);

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
          fullWidth
          id={name}
          label={label}
          helperText={error?.message || null}
          error={!!error}
          variant="outlined"
          size="small"
          type="text"
        />
      )}
    />
  );
};

export default FieldText;
