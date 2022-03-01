import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Box, Breadcrumbs } from '@material-ui/core';
import Layout from '../../../components/Layout';
import Form from '../../../components/Form';
import { FieldDate, FieldSelect } from '../../../components/Field';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { fetchAssets } from '../../../store/actions/assets';
import { getPrices } from '../../../services/assetService';
import MultilineChart from '../../../components/MultilineChart';

const AssetPrice = () => {
  const [data, setData] = useState(null);
  const { records: assets } = useSelector((state: any) => state.assets);
  const router = useRouter();
  const dispatch = useDispatch();

  const { id } = router.query;
  dispatch(fetchAssets());

  const formMethods = useForm({
    defaultValues: {
      'date-from': moment().subtract(90, 'days'),
      'date-to': moment()
    }
  });

  const dateFromWatch = formMethods.watch('date-from');
  const dateToWatch = formMethods.watch('date-to');
  const assetWatch = formMethods.watch('asset');

  useEffect(() => {
    if (assetWatch) {
      router.push(`/asset/${assetWatch}/price`);
    }
  }, [assetWatch]);

  useEffect(() => {
    if (id && dateFromWatch && dateToWatch) {
      getPrices(Number(id), dateFromWatch.format('YYYY-MM-DD'), dateToWatch.format('YYYY-MM-DD'))
        .then(response => {
          setData(response.map(x => ({ date: new Date(x.date), value: x.close, position: x.position })));
        });
    }
  }, [id, dateFromWatch, dateToWatch]);

  return (
    <Layout>
      <Head>
        <title>Cotação</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Cotação</Typography>
        </Breadcrumbs>
      </Box>
      <Form useOutside={formMethods} onSubmit={null}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box style={{ width: 200 }}>
              <FieldSelect
                name="asset"
                value={id}
                label="Ativo"
                rules={{required: true}}
                options={assets.map(x => ({ value: x.id, label: x.name }))}
              />
            </Box>
            <Box ml={2}>
              <FieldDate
                name="date-from"
                // value={moment().subtract(30, 'days')}
                label="Data Inicial"
                rules={{required: true}}
              />
            </Box>
            <Box ml={2}>
              <FieldDate
                name="date-to"
                // value={moment()}
                label="Data Final"
                rules={{required: true}}
              />
            </Box>
          </Box>
        </Box>
      </Form>
      {data && <MultilineChart data={data} />}
    </Layout>
  );
};

export default AssetPrice;
