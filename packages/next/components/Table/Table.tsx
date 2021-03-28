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
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './Table.style';

interface TableProps {
  columns: {
    name: string;
    header: string;
    cell?: (row: any) => {};
  }[];
  data: any[];
};

const Table = (props: React.PropsWithChildren<TableProps>): React.ReactElement => {
  const { children, columns, data } = props;
  const [search, setSearch] = useState<string>('');
  const classes = useStyles();

  return (
    <section>
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
      <TableContainer component={Paper}>
        <TableMaterial>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={`column-${column.name}`}>{column.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
            .filter(x => Object.keys(x).some(key => String(x[key]).toUpperCase().includes(search.toUpperCase())))
            .map((row, index) => (
              <TableRow key={`row-${index}`}>
                {columns.map(({ header, name, cell, ...rest }) => (
                  <TableCell key={`row-${name}-${index}`} {...rest}>
                    {cell ? cell(row) : row[name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableMaterial>
      </TableContainer>
    </section>
  );
};

export default Table;
