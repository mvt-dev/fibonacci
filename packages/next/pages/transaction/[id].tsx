import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
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
import { AccountType } from '../../interfaces/AccountInterface';
import { TransactionType } from '../../interfaces/TransactionInterface';
import { fetchTransactions } from '../../store/actions/transactions';
import { fetchAccounts } from '../../store/actions/accounts';
import { fetchCategories } from '../../store/actions/categories';
import { fetchInvestment } from '../../store/actions/investment';
import { fetchExpenses } from '../../store/actions/expenses';
import { fetchBalance } from '../../store/actions/balance';

interface TransactionProps {
  id: string;
}

const Transaction = (props: TransactionProps) => {
  const { id } = props;
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [accountType, setAccounType] = useState(null);
  const [redirect, setRedirect] = useState(true);
  const [date, setDate] = useState(moment());
  const { records: accounts } = useSelector((state: any) => state.accounts);
  const { records: categories } = useSelector((state: any) => state.categories);
  
  const dispatch = useDispatch();
  dispatch(fetchAccounts());
  dispatch(fetchCategories());

  const router = useRouter();

  const {data: transaction, loading} = id !== 'new' ? useService(get, id) : { data: null, loading: false };

  useEffect(() => {
    if (transaction) setDate(moment.utc(transaction.date));
  }, [transaction]);

  const types = accountType === AccountType.Investment ? [
    {value: TransactionType.Buy, label: 'Compra'},
    {value: TransactionType.Sell, label: 'Venda'},
    {value: TransactionType.Investment, label: 'Aporte'},
    {value: TransactionType.Whithdraw, label: 'Retirada'},
    {value: TransactionType.Fee, label: 'Taxa'},
    {value: TransactionType.Dividend, label: 'Dividendo'},
    {value: TransactionType.Emolumento, label: 'Emolumento'},
    {value: TransactionType.JCP, label: 'JCP'},
    {value: TransactionType.Profit, label: 'Provento'},
    {value: TransactionType.Rent, label: 'Aluguel'},
    {value: TransactionType.Adjustment, label: 'Ajuste'},
  ] : [
    {value: TransactionType.Gain, label: 'Ganho'},
    {value: TransactionType.Cost, label: 'Despesa'},
    {value: TransactionType.VirtualCost, label: 'Investimento'},
    {value: TransactionType.Adjustment, label: 'Ajuste'},
  ];

  const onChangeAccount = (value) => {
    if (value) {
      setAccounType(accounts?.find(x => x.id === value)?.type);
    } else {
      setAccounType(null);
    }
  }

  const onSubmit = useCallback(async (formData) => {
    try {
      const data = {
        ...formData,
        amount: formData?.amount || 1
      }
      if (id !== 'new') {
        await update({id, ...data});
        dispatch(snackbarShowSuccess('Transação atualizada com sucesso'));
      } else {
        await create(data);
        dispatch(snackbarShowSuccess('Transação criada com sucesso'));
      }
      dispatch(fetchTransactions({ force: true }));
      dispatch(fetchAccounts({ force: true }));
      dispatch(fetchInvestment({ force: true }));
      dispatch(fetchExpenses({ force: true }));
      dispatch(fetchBalance({ force: true }));
      if (redirect) router.back();
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  }, [redirect]);

  const onRemove = async () => {
    try {
      await remove(Number(id));
      dispatch(fetchTransactions({ force: true }));
      router.back();
      dispatch(snackbarShowSuccess('Transação removida com sucesso'));
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  }

  const classes = makeStyles((theme) => ({
    cancelButton: {
      marginLeft: theme.spacing(2)
    },
    confirmContinueButton: {
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
            value={date}
            label="Data"
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
            onChange={onChangeAccount}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="type"
            value={transaction?.type}
            label="Tipo"
            rules={{required: true}}
            options={types}
          />
        </Box>
        {accountType !== AccountType.Investment && (
          <Box mb={3}>
            <FieldSelect
              name="category"
              value={transaction?.category}
              label="Categoria"
              // rules={{required: true}}
              options={categories ? categories.map(x => ({ value: x.id, label: x.name })) : []}
            />
          </Box>
        )}
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
        {accountType === AccountType.Investment && (
          <Box mb={3}>
            <FieldNumber
              name="amount"
              value={transaction?.amount || 1}
              label="Quantidade"
              rules={{required: true}}
            />
          </Box>
        )}
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Button type="submit" variant="contained" color="primary" onClick={() => setRedirect(true)}>Confirmar</Button>
            <Button type="submit" variant="contained" color="primary" className={classes.confirmContinueButton} onClick={() => setRedirect(false)}>Confirmar & Continuar</Button>
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

export async function getServerSideProps({ query }) {
  return { props: { id: query.id } };
}

export default Transaction;
