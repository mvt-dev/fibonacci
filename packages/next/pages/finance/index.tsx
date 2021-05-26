import React from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { Typography, Box, Breadcrumbs, Button } from '@material-ui/core';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import { FieldText, FieldSelect } from '../../components/Field';
import { snackbarShowSuccess, snackbarShowError } from '../../store/actions/snackbar';
import { getHistoricalData } from '../../services/financeService';

const Finance = () => {
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    try {
      const data = await getHistoricalData(formData.symbol);
      console.log(data);
      // dispatch(snackbarShowSuccess('Conta atualizada com sucesso'));
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  };

  return (
    <Layout>
      <Head>
        <title>Cotações</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Cotações</Typography>
        </Breadcrumbs>
      </Box>
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <FieldText
            name="symbol"
            label="Símbolo"
            rules={{required: true}}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary">Confirmar</Button>
        </Box>
      </Form>
    </Layout>
  );
};

export default Finance;
