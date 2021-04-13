import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router'
import { useDispatch } from 'react-redux';
import { Typography, Box, Breadcrumbs, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import { FieldText, FieldSelect } from '../../components/Field';
import { AccountInterface } from '@fibonacci/interfaces';
import useService from '../../hooks/useService';
import { snackbarShowSuccess, snackbarShowError } from '../../store/actions/snackbar';
import DialogAlert from '../../components/DialogAlert';
import { get, create, update, remove } from '../../services/accountService';

const Account = () => {
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { data: account, loading } = id !== 'new' ? useService(get, id) : { data: null, loading: false };

  const onSubmit = async (formData) => {
    try {
      if (id !== 'new') {
        await update({id, ...formData});
        dispatch(snackbarShowSuccess('Conta atualizada com sucesso'));
      } else {
        await create(formData);
        dispatch(snackbarShowSuccess('Conta criada com sucesso'));
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
      dispatch(snackbarShowSuccess('Conta removida com sucesso'));
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
        <title>{account?.name || 'Nova'} - Contas</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <NextLink href="/account" replace>Contas</NextLink>
          <Typography color="primary">{account?.name || 'Nova'}</Typography>
        </Breadcrumbs>
      </Box>
      {loading && (<Box my={3}><LinearProgress /></Box>)}
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <FieldText
            name="name"
            value={account?.name}
            label="Nome"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="type"
            value={account?.type}
            label="Tipo de conta"
            rules={{required: true}}
            options={[
              {value: AccountInterface.AccountType.Transaction, label: 'Conta Corrente'},
              {value: AccountInterface.AccountType.Credit, label: 'Cartão de Crédito'},
              {value: AccountInterface.AccountType.Investment, label: 'Investimento'},
            ]}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="currency"
            value={account?.currency || 'BRL'}
            label="Moeda"
            rules={{required: true}}
            options={[
              {value: AccountInterface.AccountCurrency.BRL, label: 'R$ (BRL)'},
              {value: AccountInterface.AccountCurrency.USD, label: '$ (USD)'},
            ]}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Button type="submit" variant="contained" color="primary">Confirmar</Button>
            <NextLink href="/account" replace><Button className={classes.cancelButton} variant="outlined" color="primary">Cancelar</Button></NextLink>
          </Box>
          {id !== 'new' && (
            <Button variant="outlined" color="secondary" onClick={() => setShowRemove(true)}>Remover</Button>
          )}
        </Box>
      </Form>
      <DialogAlert
        title="Remover Conta"
        description="Confirma a remoção da conta?"
        open={showRemove}
        close={() => setShowRemove(false)}
        confirm={onRemove}
      />
    </Layout>
  );
};

export default Account;
