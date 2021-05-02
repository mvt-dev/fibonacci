import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { Typography, Box, Breadcrumbs, Chip } from '@material-ui/core';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import numeric from '../../libs/numeric';
import { fetchInvestment } from '../../store/actions/investment';

const Investments = () => {
  const dispatch = useDispatch();
  dispatch(fetchInvestment());
  const { records: investments, status, error } = useSelector((state: any) => state.investment);

  const columnsDefault = [
    {
      name: 'walletPercent',
      header: 'Percentual',
      cell: row => `${numeric.currency(row.walletPercent)} %`,
      align: 'right',
      sort: (order, a, b) => order === 'asc' ? a.walletPercent - b.walletPercent : b.walletPercent - a.walletPercent
    },
    {
      name: 'variation',
      header: 'Variação',
      cell: row => {
        if (row.variation === null) return '-';
        if (row.variation >= 0) return <Chip size="small" color="primary" label={`${numeric.currency(row.variation)} %`} />;
        if (row.variation < 0) return <Chip size="small" color="secondary" label={`${numeric.currency(row.variation)} %`} />;
      },
      align: 'right',
      sort: (order, a, b) => order === 'asc' ? a.variation - b.variation : b.variation - a.variation
    },
    {
      name: 'valorization',
      header: 'Valorização',
      cell: row => {
        if (row.valorization === null) return '-';
        if (row.valorizationPercent >= 0) return <Chip size="small" color="primary" label={`${numeric.currency(row.valorizationPercent)} %`} />;
        if (row.valorizationPercent < 0) return <Chip size="small" color="secondary" label={`${numeric.currency(row.valorizationPercent)} %`} />;
      },
      align: 'right',
      total: () => {
        if (investments.total.valorization === null) return '-';
        if (investments.total.valorizationPercent >= 0) return <Chip size="small" color="primary" label={`${numeric.currency(investments.total.valorizationPercent)} %`} />;
        if (investments.total.valorizationPercent < 0) return <Chip size="small" color="secondary" label={`${numeric.currency(investments.total.valorizationPercent)} %`} />;
      },
      sort: (order, a, b) => order === 'asc' ? a.valorizationPercent - b.valorizationPercent : b.valorizationPercent - a.valorizationPercent
    },
    {
      name: 'currentValue',
      header: 'Posição',
      cell: row => `R$ ${numeric.currency(row.currentValue)}`,
      align: 'right',
      total: () => `R$ ${numeric.currency(investments.total.currentValue)}`,
      sort: (order, a, b) => order === 'asc' ? a.currentValue - b.currentValue : b.currentValue - a.currentValue
    },
  ];

  const columnsTypes = [
    {
      name: 'type',
      header: 'Tipo',
      cell: row => {
        switch (row.type) {
          case 'FIXED_BR': return 'Renda Fixa';
          case 'STOCK_BR': return 'Ações';
          case 'REIT_BR': return 'FII';
          case 'STOCK_US': return 'Stock';
          case 'REIT_US': return 'REIT';
          default: return '-';
        }
      }
    },
    ...columnsDefault
  ];

  const columnsAssets = [
    {
      name: 'asset',
      header: 'Ativo'
    },
    ...columnsDefault
  ];

  return (
    <Layout>
      <Head>
        <title>Investimentos</title>
      </Head>
      <Box mb={2}>
        <Breadcrumbs>
          <Typography color="primary">Investimentos</Typography>
        </Breadcrumbs>
      </Box>
      <Box mt={1}>
        <Table columns={columnsTypes} data={investments?.types || []} loading={status === 'loading'} error={error} showSearch={false} showTotal={true} />
      </Box>
      <Box mt={2}>
        <Table columns={columnsAssets} data={investments?.assets || []} loading={status === 'loading'} error={error} />
      </Box>
    </Layout>
  );
};

export default Investments;
