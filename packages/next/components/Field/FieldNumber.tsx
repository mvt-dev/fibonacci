import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';

interface FieldNumberProps {
  name: string;
  label?: string;
  value?: any;
  rules?: {};
}

const FieldNumber = (props: FieldNumberProps): React.ReactElement => {
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
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      )}
    />
  );
};

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
}

export default FieldNumber;
