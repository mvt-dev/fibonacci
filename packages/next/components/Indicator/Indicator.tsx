import React from 'react';
import { Chip } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import numeric from '../../libs/numeric';

interface IndicatorProps {
  value: number | null;
}

const Indicator = (props: IndicatorProps): React.ReactElement => {
  const { value } = props;

  const getColor = () => {
    if (!value) return 'default';
    if (value > 0) return 'primary';
    if (value < 0) return 'secondary';
  }

  const getIcon = () => {
    if (!value) return <UnfoldMoreIcon fontSize="small" />;
    if (value > 0) return <KeyboardArrowUpIcon fontSize="small" />;
    if (value < 0) return <KeyboardArrowDownIcon fontSize="small" />;
  }

  return (
    <Chip
      size="small"
      color={getColor()}
      label={`${numeric.currency(Math.abs(value || 0))} %`}
      icon={getIcon()}
    />
  );
};

export default Indicator;
