import React from 'react';
import {useForm, FormProvider} from 'react-hook-form';

interface FormProps {
  onSubmit: (data: any) => any
  useOutside?: any;
};

const Form = (props: React.PropsWithChildren<FormProps>): React.ReactElement => {
  const {children, onSubmit, useOutside} = props;
  const methods = useOutside ? useOutside : useForm();
  
  return (
    <FormProvider {...methods} >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
