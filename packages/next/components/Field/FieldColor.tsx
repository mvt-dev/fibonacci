import React, { useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import ColorPicker from 'material-ui-color-picker';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  section: {
    position: 'relative'
  },
  colorDisplay: {
    position: 'absolute',
    top: '10px',
    bottom: '10px',
    left: '10px',
    right: '10px',
    borderRadius: '5px',
    color: '#fff',
    textAlign: 'right',
    paddingRight: '15px',
    cursor: 'pointer',
  }
}));

interface FieldColorProps {
  name: string;
  label?: string;
  value?: any;
  rules?: {};
}

const FieldColor = (props: FieldColorProps): React.ReactElement => {
  const {
    name,
    value,
    label,
    rules,
  } = props;
  const inputEl = useRef(null);
  const { control, setValue, watch } = useFormContext();
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
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
          formState,
        }) => (
          <ColorPicker
            onChange={color => onChange(color)}
            onBlur={onBlur}
            value={value}
            inputRef={inputEl}
            fullWidth
            id={name}
            helperText={error?.message || null}
            label={label}
            error={!!error}
            variant="outlined"
            size="small"
          />
        )}
      />
      <div
        className={classes.colorDisplay}
        style={{ background: watchValue }}
        onClick={() => inputEl.current.click()}
      >
        {watchValue}
      </div>
    </section>
  );
};

export default FieldColor;
