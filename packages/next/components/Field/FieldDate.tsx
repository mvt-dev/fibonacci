import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';

interface FieldDateProps {
  name: string;
  label?: string;
  value?: any;
  rules?: {};
}

const FieldDate = (props: FieldDateProps): React.ReactElement => {
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
        <KeyboardDatePicker
          onChange={date => onChange(date)}
          onBlur={onBlur}
          value={value}
          inputRef={ref}
          autoOk
          fullWidth
          format="DD/MM/yyyy"
          size="small"
          inputVariant="outlined"
          id={name}
          label={label}
          helperText={error?.message || null}
          error={!!error}
          KeyboardButtonProps={{ color: 'primary' }}
        />
      )}
    />
  );
};

export default FieldDate;
