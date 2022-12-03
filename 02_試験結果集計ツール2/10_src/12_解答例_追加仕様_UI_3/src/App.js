import { Grid } from '@mui/material';
import './App.css';

import FileSummaryTable from './components/FileSummaryTable';
import DateSummaryTable from './components/DateSummaryTable';
import UserSummaryTable from './components/UserSummaryTable';

function App() {
  return (
    <div className="App">
      <Grid container direction='column'>
        <Grid item>
          <FileSummaryTable />
        </Grid>
        <Grid item container>
          <Grid sm={6}><DateSummaryTable /></Grid>
          <Grid sm={6}><UserSummaryTable /></Grid>
        </Grid>
        <Grid item>
          chart1
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
