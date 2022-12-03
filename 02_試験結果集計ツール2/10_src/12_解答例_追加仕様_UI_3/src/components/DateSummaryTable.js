import * as React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import testData from '../data/test.json'


export default function DateSummaryTable() {

    const dates = testData.dates;

    const fields = Array.from(new Set(dates.flatMap(d => Object.keys(d))));
    fields.splice(0, 1) // date を除外
    
    const rows = dates.map(d => fields.map(f => d[f] ? d[f] : ''))
    
    fields[0] = '日付';
    fields[1] = '合計';
    
    return (
    <Card>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {fields.map(f => <TableCell>{f}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                {row.map(col => <TableCell>{col}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}