import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import NextLink from 'next/link';
import { Typography, IconButton, Box, Breadcrumbs, Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Form from '../../components/Form';
import { FieldDate, FieldSelect } from '../../components/Field';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import numeric from '../../libs/numeric';
import { TransactionInterface } from '@fibonacci/interfaces';
import { fetchTransactions, setAccount } from '../../store/actions/transactions';
import { fetchAccounts } from '../../store/actions/accounts';

const Transactions = () => {
  const [days, setDays] = useState(null);

  const { records: transactions, status, error, dateFrom, dateTo, account } = useSelector((state: any) => state.transactions);
  const { records: accounts } = useSelector((state: any) => state.accounts);

  const dispatch = useDispatch();
  dispatch(fetchAccounts());

  const formMethods = useForm();
  const dateFromWatch = formMethods.watch('date-from');
  const dateToWatch = formMethods.watch('date-to');
  const accountWatch = formMethods.watch('account');

  const columns = [
    {
      name: 'date',
      header: 'Data',
      cell: (row) => moment.utc(row.date).format('DD/MM')
    },
    {
      name: 'type',
      header: 'Tipo',
      cell: (row) => {
        switch (row.type) {
          case TransactionInterface.TransactionType.Adjustment: return 'Ajuste';
          case TransactionInterface.TransactionType.Buy: return 'Compra';
          case TransactionInterface.TransactionType.Dividend: return 'Dividendo';
          case TransactionInterface.TransactionType.Emolumento: return 'Emolumento';
          case TransactionInterface.TransactionType.Fee: return 'Taxa';
          case TransactionInterface.TransactionType.Investment: return 'Aporte';
          case TransactionInterface.TransactionType.JCP: return 'JCP';
          case TransactionInterface.TransactionType.Profit: return 'Provento';
          case TransactionInterface.TransactionType.Rent: return 'Aluguel';
          case TransactionInterface.TransactionType.Sell: return 'Venda';
          case TransactionInterface.TransactionType.Whithdraw: return 'Retirada';
          default: return '-';
        }
      }
    },
    {
      name: 'description',
      header: 'Descrição'
    },
    {
      name: 'value',
      header: 'Valor',
      cell: (row) => <Typography variant="body2" color={row.value < 0 ? 'secondary' : 'primary'}>{numeric.currency(row.value)}</Typography>,
      align: 'right'
    },
    {
      name: 'action',
      header: '',
      cell: (row) => (
        <NextLink href={`/transaction/${row.id}`}>
          <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
  ];

  useEffect(() => {
    if (dateFromWatch && dateToWatch) {
      setDays(dateToWatch.diff(dateFromWatch, 'days'));
      dispatch(fetchTransactions({ dateFrom: dateFromWatch, dateTo: dateToWatch }));
    }
  }, [dateFromWatch, dateToWatch]);

  useEffect(() => {
    dispatch(setAccount(accountWatch));
  }, [accountWatch])

  const setDate = (days: number) => {
    formMethods.setValue('date-from', moment().subtract(days, 'days'));
    formMethods.setValue('date-to', moment());
  }

  return (
    <Layout>
      <Head>
        <title>Extrato</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Extrato</Typography>
        </Breadcrumbs>
      </Box>
      <Form useOutside={formMethods} onSubmit={null}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box>
              <FieldDate
                name="date-from"
                value={dateFrom}
                label="Data Inicial"
                rules={{required: true}}
              />
            </Box>
            <Box ml={2}>
              <FieldDate
                name="date-to"
                value={dateTo}
                label="Data Final"
                rules={{required: true}}
              />
            </Box>
            <Box ml={2} style={{ width: 200 }}>
              <FieldSelect
                name="account"
                value={account}
                label="Conta"
                rules={{required: true}}
                options={[
                  { value: 'all', label: 'Todas' },
                  ...accounts.map(x => ({ value: x.id, label: x.name }))
                ]}
              />
            </Box>
          </Box>
          <Box display="flex">
            <Box ml={2}>
              <Chip label="7 dias" variant="default" color={days === 7 ? 'primary' : 'default'} onClick={() => setDate(7)} />
            </Box>
            <Box ml={2}>
              <Chip label="15 dias" variant="default" color={days === 15 ? 'primary' : 'default'} onClick={() => setDate(15)} />
            </Box>
            <Box ml={2}>
              <Chip label="30 dias" variant="default" color={days === 30 ? 'primary' : 'default'} onClick={() => setDate(30)} />
            </Box>
          </Box>
        </Box>
      </Form>
      <Table 
        columns={columns}
        data={transactions.filter(x => account !== 'all' ? x.account.id === account : true)}
        loading={status === 'loading'}
        error={error}
      >
        <NextLink href="/transaction/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Transactions;
