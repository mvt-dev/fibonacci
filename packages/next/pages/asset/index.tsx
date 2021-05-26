import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import NextLink from 'next/link';
import {Typography, IconButton, Box, Breadcrumbs} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import UpdateIcon from '@material-ui/icons/Update';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { AssetInterface } from '@fibonacci/interfaces';
import { fetchAssets } from '../../store/actions/assets';
import moment from 'moment';
import { updatePrices } from '../../services/assetService';
import { snackbarShowError } from '../../store/actions/snackbar';

const Assets = () => {
  const dispatch = useDispatch();
  dispatch(fetchAssets());
  const { records: assets, status, error } = useSelector((state: any) => state.assets);

  const columns = [
    {
      name: 'name',
      header: 'Nome'
    },
    {
      name: 'symbol',
      header: 'Código'
    },
    {
      name: 'type',
      header: 'Tipo',
      cell: (row) => {
        switch (row.type) {
          case AssetInterface.AssetType.FixedBR: return 'Renda Fixa';
          case AssetInterface.AssetType.StockBR: return 'Ações';
          case AssetInterface.AssetType.ReitBR: return 'FII';
          case AssetInterface.AssetType.StockUS: return 'Stock';
          case AssetInterface.AssetType.Crypto: return 'Criptomoedas';
          default: return '-';
        }
      }
    },
    {
      name: 'lastPrice',
      header: 'Último Preço',
      cell: row => row.lastPrice ? moment.utc(row.lastPrice).format('DD/MM/YYYY') : '-'
    },
    {
      name: 'action',
      header: '',
      cell: (row) => (
        <NextLink href={`/asset/${row.id}`}>
          <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
  ];

  const onUpdatePrices = async () => {
    try {
      const results = await updatePrices();
      console.log(results);
      dispatch(fetchAssets({ force: true }));
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  }

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
      <Table columns={columns} data={assets} loading={status === 'loading'} error={error}>
        <IconButton color="primary" onClick={onUpdatePrices}><UpdateIcon /></IconButton>
        <NextLink href="/asset/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Assets;
