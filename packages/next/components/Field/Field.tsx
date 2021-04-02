import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import useStyles from './Field.style';

enum FieldTypes {
  Text = 'text',
  Select = 'select',
  Color = 'color'
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
  const {control, errors, setValue, watch} = useFormContext();
  const classes = useStyles();
  const watchValue = watch(name);

  useEffect(() => {
    if (value) setValue(name, value);
  }, [value]);

  return (
    <section className={classes.section}>
      <Controller
        name={name}
        control={control}
        defaultValue={value || ''}
        rules={rules}
        render={({ onChange, onBlur, value, name, ref }) => {
          switch (type) {
            case FieldTypes.Select:
              return (
                <TextField
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  inputRef={ref}
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
            case FieldTypes.Color:
              return (
                <>
                  <ColorPicker
                    onChange={color => onChange(color)}
                    onBlur={onBlur}
                    value={value}
                    inputRef={ref}
                    fullWidth
                    id={name}
                    helperText={errors[name] ? errors[name].message : null}
                    label={label}
                    error={!!errors[name]}
                    variant="outlined"
                    size="small"
                  />
                  <div
                    className={classes.colorDisplay}
                    style={{ background: watchValue }}
                    onClick={() => ref.current.click()}
                  >
                    {watchValue}
                  </div>
                </>
              );
            default:
              return (
                <TextField
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  inputRef={ref}
                  fullWidth
                  id={name}
                  helperText={errors[name] ? errors[name].message : null}
                  label={label}
                  error={!!errors[name]}
                  variant="outlined"
                  size="small"
                />
              );
          }
        }}
      />
    </section>
  );
};

export {
  Field,
  FieldTypes
};
