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

const testers = testData.testers;

const fields = [
  'tester',
  'count'
]
const rows = testers.map(d => fields.map(f => d[f] ? d[f] : ''))

fields[0] = 'テスター';
fields[1] = '合計';

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