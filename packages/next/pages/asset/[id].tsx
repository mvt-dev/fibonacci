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
import { AssetInterface } from '@fibonacci/interfaces';
import useService from '../../hooks/useService';
import { snackbarShowSuccess, snackbarShowError } from '../../store/actions/snackbar';
import DialogAlert from '../../components/DialogAlert';
import { get, create, update, remove } from '../../services/assetService';
import { fetchAssets } from '../../store/actions/assets';

const Asset = () => {
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { data: asset, loading } = id !== 'new' ? useService(get, id) : { data: null, loading: false };

  const onSubmit = async (formData) => {
    try {
      if (id !== 'new') {
        await update({id, ...formData});
        dispatch(snackbarShowSuccess('Cotação atualizada com sucesso'));
      } else {
        await create(formData);
        dispatch(snackbarShowSuccess('Cotação criada com sucesso'));
      }
      dispatch(fetchAssets({ force: true }));
      router.back();
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  };

  const onRemove = async () => {
    try {
      await remove(Number(id));
      dispatch(fetchAssets({ force: true }));
      router.back();
      dispatch(snackbarShowSuccess('Cotação removida com sucesso'));
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
        <title>{asset?.name || 'Nova'} - Cotações</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <NextLink href="/asset" replace>Cotações</NextLink>
          <Typography color="primary">{asset?.name || 'Nova'}</Typography>
        </Breadcrumbs>
      </Box>
      {loading && (<Box my={3}><LinearProgress /></Box>)}
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <FieldText
            name="name"
            value={asset?.name}
            label="Nome"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldText
            name="symbol"
            value={asset?.symbol}
            label="Símbolo"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="type"
            value={asset?.type}
            label="Tipo"
            rules={{required: true}}
            options={[
              {value: AssetInterface.AssetType.FixedBR, label: 'Renda Fixa'},
              {value: AssetInterface.AssetType.StockBR, label: 'Ação'},
              {value: AssetInterface.AssetType.ReitBR, label: 'FII'},
              {value: AssetInterface.AssetType.StockUS, label: 'Stock'},
              {value: AssetInterface.AssetType.Crypto, label: 'Criptomoeda'},
            ]}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Button type="submit" variant="contained" color="primary">Confirmar</Button>
            <NextLink href="/asset" replace><Button className={classes.cancelButton} variant="outlined" color="primary">Cancelar</Button></NextLink>
          </Box>
          {id !== 'new' && (
            <Button variant="outlined" color="secondary" onClick={() => setShowRemove(true)}>Remover</Button>
          )}
        </Box>
      </Form>
      <DialogAlert
        title="Remover Cotação"
        description="Confirma a remoção da cotação?"
        open={showRemove}
        close={() => setShowRemove(false)}
        confirm={onRemove}
      />
    </Layout>
  );
};

export default Asset;
