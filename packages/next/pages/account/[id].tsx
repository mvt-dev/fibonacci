import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router'
import { useDispatch } from 'react-redux';
import {Typography, Box, Breadcrumbs, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import {Field, FieldTypes} from '../../components/Field';
import {AccountInterface} from '@fibonacci/services';
import useService from '../../hooks/useService';
import { snackbarShowSuccess } from '../../store/actions/snackbar';
import DialogAlert from '../../components/DialogAlert';
import { get, create, update, remove } from '../../services/accountService';

interface AccountsProps {
  AccountType: typeof AccountInterface.AccountType;
  id: string;
}

const Account = (props: AccountsProps) => {
  const {AccountType, id} = props;
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const {data: account} = useService(id !== 'new' ? get(id) : null);

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
      console.warn(error);
    }
  };

  const onRemove = async () => {
    try {
      await remove(id);
      router.back();
      dispatch(snackbarShowSuccess('Conta removida com sucesso'));
    } catch (error) {
      console.warn(error);
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
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <Field
            type={FieldTypes.TEXT}
            name="name"
            value={account?.name}
            label="Nome"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <Field
            type={FieldTypes.SELECT}
            name="type"
            value={account?.type}
            label="Tipo de conta"
            rules={{required: true}}
            options={[
              {value: AccountType.Transaction, label: 'Conta Corrente'},
              {value: AccountType.Credit, label: 'Cartão de Crédito'},
              {value: AccountType.Investment, label: 'Investimento'},
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

export async function getServerSideProps({params}) {
  return {props: {
    AccountType: AccountInterface.AccountType,
    id: params.id
  }};
}

export default Account;
