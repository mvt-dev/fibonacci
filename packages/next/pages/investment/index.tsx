import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { Typography, Box, Breadcrumbs } from '@material-ui/core';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import numeric from '../../libs/numeric';
import { fetchInvestment } from '../../store/actions/investment';
import InvestmentIndex from '../../components/InvestmentIndex';
import Indicator from '../../components/Indicator';

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
      cell: row => <Indicator value={row.variation} />,
      align: 'right',
      total: () => <Indicator value={investments.total.variation} />,
      sort: (order, a, b) => order === 'asc' ? a.variation - b.variation : b.variation - a.variation
    },
    {
      name: 'valorization',
      header: 'Valorização',
      cell: row => <Indicator value={row.valorizationPercent} />,
      align: 'right',
      total: () => <Indicator value={investments.total.valorizationPercent} />,
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
          case 'CRYPTO': return 'Criptomoedas';
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
      <Box my={2} display="flex" justifyContent="space-between" style={{ height: '80px' }}>
        <Box flexBasis="20%" pr={1}><InvestmentIndex type="asset" symbol="^BVSP" title="IBOV" /></Box>
        <Box flexBasis="20%" px={1}><InvestmentIndex type="asset" symbol="^GSPC" title="S&P 500" /></Box>
        <Box flexBasis="20%" px={1}><InvestmentIndex type="asset" symbol="IFIX.SA" title="IFIX" /></Box>
        <Box flexBasis="20%" px={1}><InvestmentIndex type="asset" symbol="BTC-USD" title="BTC" /></Box>
        <Box flexBasis="20%" pl={1}><InvestmentIndex type="currency" symbol="USDBRL" title="USD" /></Box>
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
