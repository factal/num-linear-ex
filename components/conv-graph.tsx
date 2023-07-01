'use client'

const ITER = 10

import React, { createRef, useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'
import { CircularProgress } from '@mui/joy'

import { useMediaQuery } from 'usehooks-ts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options: ChartOptions<'line'> = {
  responsive: true,
  aspectRatio: 2,
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

const labels: number[] = []
for (let i = 0; i < ITER; i++) {
  labels.push(1 + i)
}

export function ConvGraph(props: {graphData: ChartData<'line', number[]>}) {
  const matches = useMediaQuery('(min-width: 768px)')

  const graphRef = useRef<ChartJS>(null)

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.data = props.graphData
      graphRef.current.update()
    }
  }, [props.graphData])

  useEffect(() => {
    if (graphRef.current) {
      const newOptions = {...options, aspectRatio: matches ? 2 : 1}

      graphRef.current.options = newOptions
      graphRef.current.update()
    }
  }, [matches])

  const initData = {
    labels,
    datasets: [
      {
        label: 'Jacobi',
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
      }, 
      {
        label: 'Gauss-Seidel',
        data: [],
        borderColor: 'rgb(198, 52, 235)',
        backgroundColor: 'rgba(198, 52, 235, 0.5)',
      }
    ],
  }
  
  const onUpdate = () => {

  }

  
  return(
    <Line
      height={undefined}
      width={undefined}
      // @ts-ignore
      ref={graphRef}
      options={options} 
      data={initData}
      
    />
  )
}

export default ConvGraph

export const SuspenseGraph = () => {
  const dummyData = {
    labels,
    datasets: [
      {
        label: 'Jacobi',
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
      },
      {
        label: 'Gauss-Seidel',
        data: [],
        borderColor: 'rgb(198, 52, 235)',
        backgroundColor: 'rgba(198, 52, 235, 0.5)',
      },
      
    ],
  }

  return (
    <div>
      <Line options={options} height={undefined}
      width={undefined} data={dummyData} />
      <CircularProgress sx={{position: 'absolute'}} />
    </div>
    
  )
}