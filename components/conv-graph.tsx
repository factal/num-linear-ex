'use client'

const ITER = 50

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dynamic from 'next/dynamic';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Exercice 8.1 (3)',
    },
  },
};

const labels: number[] = []
for (let i = 0; i < ITER; i++) {
  labels.push(1 + i)
}

const rust = import('../wasm/pkg')




export async function ConvGraph() {

  const a: Float64Array = Float64Array.from([
     1, 2,  2, 1,
    -1, 2,  1, 0, 
     0, 1, -2, 2, 
     1, 2,  1, 2
  ])
  const b = Float64Array.from([1, 1, 1, 1])
  const init = Float64Array.from([0, 0, 0, 0])

  const errors = await rust.then((m) => {
    let temp: Float64Array = Float64Array.from([0, 0, 0, 0])

    const iters: number[][] = [[], [], []]
    temp = m.solve_8_1(4, a, b, temp, ITER)

     console.log(temp)

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < ITER; j++) {
        iters[i].push(temp[j * 4 + i * ITER * 4], temp[j * 4 + i * ITER * 4 + 1], temp[j * 4 + i * ITER * 4 + 2], temp[j * 4 + i * ITER * 4 + 3])
      }
    }

    console.log(temp[80], iters[2][0], iters[2][1], iters[2][2], iters[2][3])

    const errors: number[][] = [[], [], []]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < ITER; j++) {
        errors[i].push(Math.pow(((iters[i][j * 4] - 0.5) ** 2 + Math.abs(iters[i][j * 4 + 1] - 1) ** 2 + Math.abs(iters[i][j * 4 + 2] + 0.5) ** 2 + Math.abs(iters[i][j * 4 + 3] + 0.5) ** 2), 0.5))
      }
    }

    

    return errors
  })

  console.log(errors)

  const data = {
    labels,
    datasets: [
      // {
      //   label: 'L2 error of 1',
      //   data: errors[0],
      //   borderColor: 'rgb(255, 99, 132)',
      //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
      // },
      // {
      //   label: 'L2 error of 2',
      //   data: errors[1],
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
      {
        label: 'L2 error of 3',
        data: errors[2],
        borderColor: 'rgb(3, 252, 65)',
        backgroundColor: 'rgba(3, 252, 65, 0.5)',
      }
    ],
  };


  return <Line options={options} data={data} />;
}