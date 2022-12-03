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

const fields = [
  'file',
  'count',
  'ok',
  'ng',
  'pending',
  'confirmOk',
  'fixOk'
]
const rows = testData.testFiles.map(d => fields.map(f => d[f]));


export default function DateSummaryTable() {
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