import * as React from 'react';
import {
  Card
} from '@mui/material';

import { Line } from "react-chartjs-3";

import testData from '../data/test.json';

export default function BurndownChart() {

  // 試験件数
  let count = testData.testFiles.reduce((a, v) => a += v.count, 0);
  const dates = testData.dates;
  const counts = dates.map(d => d.count);
  
  // 日々の消化数を減算していく
  for(let c in counts) {
    count -= counts[c];
    counts[c] = count;
  }

  const labels = dates.map(d => d.displayTestDate);
  const data = {
    labels,
    datasets: [{
      label: '試験項目数',
      fill:false,
      lineTension: 0,
      borderColor: 'rgb(0,0,255)',
      borderWidth: 1,
      data: counts
    }]
  };

  const options = {
    legend: {
      display: true,
      position: "bottom"
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          }
        }
      ]
    }
  };

  return (
    <Card>
      <Line data={data} options={options} />
    </Card>
  );
}
