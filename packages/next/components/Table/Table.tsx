import React, { useState } from 'react';
import {
  Table as TableMaterial,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
  LinearProgress,
  Typography,
  TableFooter,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import useStyles from './Table.style';

interface TableProps {
  columns: {
    name: string;
    header: string;
    cell?: (row: any) => {};
    align?: any;
    total?: (rows: any) => {};
    sort?: (order: any, a: any, b: any) => number;
  }[];
  data: any[];
  loading?: boolean;
  error?: any;
  showSearch?: boolean;
  showTotal?: boolean;
  onClickRow?: (row: any) => any;
  isRowSelected?: (row: any) => boolean;
};

const Table = (props: React.PropsWithChildren<TableProps>): React.ReactElement => {
  const { children, columns, data, loading, error, showSearch = true, showTotal = false, onClickRow = null, isRowSelected = null } = props;
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState([null, null]);
  const classes = useStyles();

  const onSort = (column) => {
    setSort([column, sort[0] === column && sort[1] === 'asc' ? 'desc' : 'asc']);
  }

  const dataFilteredSorted = !data ? [] : data
    .filter(x => Object.keys(x).some(key => String(x[key]).toUpperCase().includes(search.toUpperCase())))
    .sort((a: any, b: any) => {
      const column = columns.find(x => x.name === sort[0]);
      if (column?.sort) return column.sort(sort[1], a, b);
      if (sort[1] === 'asc') return String(a[sort[0]]).localeCompare(b[sort[0]]);
      if (sort[1] === 'desc') return String(b[sort[0]]).localeCompare(a[sort[0]]);
      return 0;
    });

  return (
    <section>
      {showSearch && (
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            classes={{ root: classes.search }}
            label="Search..."
            size="small"
            type="search"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            value={search}
            onChange={event => setSearch(event?.target?.value || '')}
          />
          {children}
        </Box>
      )}
      {loading ? (
        <LinearProgress />
      ) : error ? (
          <Paper variant="outlined">
            <Box p={3}>
              <Typography variant="h6" color="primary">Erro ao obter dados do servidor</Typography>
              <Typography variant="body2" color="textSecondary">Por favor tente novamente recarregando a página</Typography>
            </Box>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <TableMaterial>
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={`column-${column.name}`} className={classes.header} align={column.align || 'left'} onClick={() => onSort(column.name)}>
                      <span>{column.header}</span>
                      {sort[0] === column.name && sort[1] === 'asc' && <ArrowDropDownIcon fontSize="inherit" />}
                      {sort[0] === column.name && sort[1] === 'desc' && <ArrowDropUpIcon fontSize="inherit" />}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFilteredSorted.map((row, index) => (
                  <TableRow key={`row-${index}`} onClick={() => onClickRow ? onClickRow(row) : false} hover={!!onClickRow} selected={isRowSelected ? isRowSelected(row) : false}>
                    {columns.map(({ name, align, cell }) => (
                      <TableCell key={`row-${name}-${index}`} align={align || 'left'}>
                        {cell ? cell(row) : row[name]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              {showTotal && (
                <TableFooter>
                  <TableRow>
                    {columns.map(({ align, name, total }, index) => (
                      <TableCell className={classes.footer} key={`total-${name}`} align={align || 'left'}>{index === 0 ? 'Total' : total ? total(data) : '-'}</TableCell>
                    ))}
                  </TableRow>
                </TableFooter>
              )}
            </TableMaterial>
          </TableContainer>
        )
      }
    </section>
  );
};

export default Table;
