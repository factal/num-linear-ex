'use client'

const ITER = 10

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ElementChartOptions,
  GridLineOptions,
  ChartOptions,
  ScaleOptionsByType,
  CartesianScaleTypeRegistry,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'
import { CircularProgress } from '@mui/joy'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'white',
      }
    },
    title: {
      display: true,
      text: 'L2 errors',
      color: 'white',
    },
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.2)',
        tickColor: 'grey'
      },
      border: {
        color: 'rgba(255, 255, 255, 0.2)'
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.2)',
        tickColor: 'grey'
      },
      border: {
        color: 'rgba(255, 255, 255, 0.2)'
      },
      title: {
        display: true,
        text: 'Iterations',
        color: 'white',
      }
    }
  }
}

// const ops: GridLineOptions  = {
//   tickColor: 'rgba(255, 255, 255, 0.2)',
// }

const labels: number[] = []
for (let i = 0; i < ITER; i++) {
  labels.push(1 + i)
}

const rust = import('../wasm/pkg')

export async function ConvGraph(props: {size: number, mat: number[][], vec: number[][]}) {
  const { size, mat, vec } = props
  const a: Float64Array = Float64Array.from(mat.flat())
  const b = Float64Array.from(vec.flat())
  
  const errors = await rust.then((m) => {
    let temp: Float64Array = Float64Array.from(Array(size).fill(0))

    if (m.is_invertible(size, a)) {

      const iters: number[][] = [[], [], []]
      temp = m.solve_8_1(size, a, b, temp, ITER)

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < ITER; j++) {
          for (let k = 0; k < size; k++) {
            iters[i].push(temp[j * size + i * ITER * size + k])
          }
          //iters[i].push(temp[j * 4 + i * ITER * 4], temp[j * 4 + i * ITER * 4 + 1], temp[j * 4 + i * ITER * 4 + 2], temp[j * 4 + i * ITER * 4 + 3])
        }
      }

      const exact = m.solve_linear(size, a, b)

      console.log('iters', iters)
    const errors: number[][] = [[], [], []]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < ITER; j++) {
        let err = 0
        for (let k = 0; k < size; k++) {
          err += (iters[i][j * size + k] - exact[k]) ** 2
        }
        errors[i].push(Math.pow(err, 0.5))
        // errors[i].push(Math.pow(((iters[i][j * 4] - 0.5) ** 2 + Math.abs(iters[i][j * 4 + 1] - 1) ** 2 + Math.abs(iters[i][j * 4 + 2] + 0.5) ** 2 + Math.abs(iters[i][j * 4 + 3] + 0.5) ** 2), 0.5))
      }
    }

    

    return errors
    } else {
      throw new Error('Matrix is not invertible')
    }
  }).catch((e) => {
    console.error(e)
    return [[], [], []]
  })

  // console.log(errors)

  const data = {
    labels,
    datasets: [
      {
        label: 'Method 1',
        data: errors[0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        
      },
      {
        label: 'Method 2',
        data: errors[1],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Method 3',
        data: errors[2],
        borderColor: 'rgb(3, 252, 65)',
        backgroundColor: 'rgba(3, 252, 65, 0.5)',
      }
    ],
  }


  return <Line options={options} data={data} />
}

export default ConvGraph

export const SuspenseGraph = () => {
  const dummyData = {
    labels,
    datasets: [
      {
        label: 'Method 1',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Method 2',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Method 3',
        data: [],
        borderColor: 'rgb(3, 252, 65)',
        backgroundColor: 'rgba(3, 252, 65, 0.5)',
      }
    ],
  }

  return (
    <div>
      <Line options={options} data={dummyData} />
      <CircularProgress sx={{position: 'absolute'}} />
    </div>
    
  )
}