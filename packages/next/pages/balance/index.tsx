import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { Typography, Box, Breadcrumbs } from '@material-ui/core';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import numeric from '../../libs/numeric';
import { fetchBalance } from '../../store/actions/balance';

const Balance = () => {
  const dispatch = useDispatch();
  dispatch(fetchBalance());
  const { records: balance, status, error } = useSelector((state: any) => state.balance);

  const columns = [
    {
      name: 'month',
      header: 'Mês'
    },
    {
      name: 'balance',
      header: 'Caixa',
      align: 'right',
      cell: row => `R$ ${numeric.currency(row.balance)}`,
      sort: (order, a, b) => order === 'asc' ? a.balance - b.balance : b.balance - a.balance
    },
    {
      name: 'invested',
      header: 'Investido',
      align: 'right',
      cell: row => `R$ ${numeric.currency(row.invested)}`,
      sort: (order, a, b) => order === 'asc' ? a.invested - b.invested : b.invested - a.invested
    },
    {
      name: 'valorization',
      header: 'Valorização',
      align: 'right',
      cell: row => <Typography variant="body2" color="primary">R$ {numeric.currency(row.valorization)}</Typography>,
      sort: (order, a, b) => order === 'asc' ? a.valorization - b.valorization : b.valorization - a.valorization
    },
    {
      name: 'profit',
      header: 'Proventos',
      align: 'right',
      cell: row => `R$ ${numeric.currency(row.profit)}`,
      sort: (order, a, b) => order === 'asc' ? a.profit - b.profit : b.profit - a.profit
    },
    {
      name: 'gain',
      header: 'Ganhos',
      align: 'right',
      cell: row => <Typography variant="body2" color="primary">R$ {numeric.currency(row.gain)}</Typography>,
      sort: (order, a, b) => order === 'asc' ? a.gain - b.gain : b.gain - a.gain
    },
    {
      name: 'cost',
      header: 'Gastos',
      align: 'right',
      cell: row => <Typography variant="body2" color="secondary">R$ {numeric.currency(row.cost)}</Typography>,
      sort: (order, a, b) => order === 'asc' ? a.cost - b.cost : b.cost - a.cost
    },
    {
      name: 'result',
      header: 'Resultado',
      align: 'right',
      cell: row => <Typography variant="subtitle2">R$ {numeric.currency(row.result)}</Typography>,
      sort: (order, a, b) => order === 'asc' ? a.result - b.result : b.result - a.result
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Balanço</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Balanço</Typography>
        </Breadcrumbs>
      </Box>
      <Table columns={columns} data={balance} loading={status === 'loading'} error={error} showSearch={false} />
    </Layout>
  );
};

export default Balance;
