import React from 'react';
import {
  Paper,
  CircularProgress,
  Typography,
  Box
} from '@material-ui/core';
import useStyles from './InvestmentIndex.style';
import { getAssetPrice, getCurrencyPrice } from '../../services/financeService';
import useService from '../../hooks/useService';
import numeric from '../../libs/numeric';
import Indicator from '../Indicator';

interface InvestmentIndexProps {
  type: 'asset' | 'currency';
  symbol: string;
  title: string;
}

const InvestmentIndex = (props: InvestmentIndexProps): React.ReactElement => {
  const { type, symbol, title } = props;
  const classes = useStyles();

  const {data, loading} = useService(type === 'asset' ? getAssetPrice : getCurrencyPrice, symbol);

  return (
    <Paper className={classes.paper}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box p={2}>
          <Typography variant="button">{title}</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">{numeric.currency(data?.closePrice)}</Typography>
            <Indicator value={data?.variation} />
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default InvestmentIndex;
