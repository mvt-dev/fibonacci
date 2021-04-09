import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router'
import { useDispatch } from 'react-redux';
import { Typography, Box, Breadcrumbs, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import { FieldText, FieldSelect, FieldNumber, FieldDate } from '../../components/Field';
import useService from '../../hooks/useService';
import { snackbarShowSuccess, snackbarShowError } from '../../store/actions/snackbar';
import DialogAlert from '../../components/DialogAlert';
import { get, create, update, remove } from '../../services/transactionService';
import moment from 'moment';
import { list as listAccounts } from '../../services/accountService';
import { list as listCategories } from '../../services/categoryService';

const Transaction = () => {
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const {data: transaction, loading} = id !== 'new' ? useService(get, id) : { data: null, loading: false };
  const {data: accounts} = useService(listAccounts);
  const {data: categories} = useService(listCategories);

  const onSubmit = async (formData) => {
    try {
      if (id !== 'new') {
        await update({id, ...formData});
        dispatch(snackbarShowSuccess('Transação atualizada com sucesso'));
      } else {
        await create(formData);
        dispatch(snackbarShowSuccess('Transação criada com sucesso'));
      }
      router.back();
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  };

  const onRemove = async () => {
    try {
      await remove(Number(id));
      router.back();
      dispatch(snackbarShowSuccess('Transação removida com sucesso'));
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  }

  const classes = makeStyles((theme) => ({
    cancelButton: {
      marginLeft: theme.spacing(2)
    }
  }))();

  return (
    <Layout>
      <Head>
        <title>{transaction?.description || 'Nova'} - Transação</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <NextLink href="/transaction" replace>Extrato</NextLink>
          <Typography color="primary">{transaction?.description || 'Nova'}</Typography>
        </Breadcrumbs>
      </Box>
      {loading && (<Box my={3}><LinearProgress /></Box>)}
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <FieldDate
            name="date"
            value={transaction?.date ? moment.utc(transaction.date) : moment()}
            label="Data"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldText
            name="description"
            value={transaction?.description}
            label="Descrição"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldNumber
            name="value"
            value={transaction?.value}
            label="Valor"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="account"
            value={transaction?.account}
            label="Conta"
            rules={{required: true}}
            options={accounts ? accounts.map(x => ({ value: x.id, label: x.name })) : []}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="category"
            value={transaction?.category}
            label="Categoria"
            rules={{required: true}}
            options={categories ? categories.map(x => ({ value: x.id, label: x.name })) : []}
          />
        </Box>
        <Box mb={3}>
          <FieldNumber
            name="amount"
            value={transaction?.amount || 1}
            label="Quantidade"
            rules={{required: true}}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Button type="submit" variant="contained" color="primary">Confirmar</Button>
            <NextLink href="/transaction" replace><Button className={classes.cancelButton} variant="outlined" color="primary">Cancelar</Button></NextLink>
          </Box>
          {id !== 'new' && (
            <Button variant="outlined" color="secondary" onClick={() => setShowRemove(true)}>Remover</Button>
          )}
        </Box>
      </Form>
      <DialogAlert
        title="Remover Transação"
        description="Confirma a remoção da transação?"
        open={showRemove}
        close={() => setShowRemove(false)}
        confirm={onRemove}
      />
    </Layout>
  );
};

export default Transaction;
