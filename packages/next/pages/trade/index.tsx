import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { Typography, Box, Breadcrumbs } from '@material-ui/core';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import numeric from '../../libs/numeric';
import { fetchTrades } from '../../store/actions/trades';
import Indicator from '../../components/Indicator';
import moment from 'moment';

const Trade = () => {
  const dispatch = useDispatch();
  dispatch(fetchTrades());
  const { records: trades, status, error } = useSelector((state: any) => state.trades);

  moment.locale('pt-br');

  const columns = [
    {
      name: 'asset',
      header: 'Ativo'
    },
    {
      name: 'duration',
      header: 'Duração',
      cell: row => moment.duration(row.duration).humanize(),
      sort: (order, a, b) => order === 'asc' ? a.duration - b.duration : b.duration - a.duration
    },
    {
      name: 'valorizationPercent',
      header: 'Valorização',
      cell: row => <Indicator value={row.valorizationPercent} />,
      align: 'right',
      total: () => {
        const buy = trades.reduce((acc, cur) => acc + cur.buy, 0);
        const result = trades.reduce((acc, cur) => acc + cur.result, 0);
        const valorization = (result / buy) * 100;
        return <Indicator value={valorization} />
      },
      sort: (order, a, b) => order === 'asc' ? a.valorizationPercent - b.valorizationPercent : b.valorizationPercent - a.valorizationPercent
    },
    {
      name: 'result',
      header: 'Resultado',
      cell: row => `R$ ${numeric.currency(row.result)}`,
      align: 'right',
      total: () => `R$ ${numeric.currency(trades.reduce((acc, cur) => acc + cur.result, 0))}`,
      sort: (order, a, b) => order === 'asc' ? a.result - b.result : b.result - a.result
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Gastos</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Trades</Typography>
        </Breadcrumbs>
      </Box>
      <Table columns={columns} data={trades} loading={status === 'loading'} error={error} showSearch={false} showTotal={true} />
    </Layout>
  );
};

export default Trade;
