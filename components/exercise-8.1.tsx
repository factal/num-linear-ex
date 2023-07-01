'use client'
import { Suspense, useState } from 'react'
import { ConvGraph, SuspenseGraph } from './conv-graph'
import Matrix from './matrix-input'
import { Container, CssVarsProvider, Divider, Sheet, Typography } from '@mui/joy'
import { Line } from 'react-chartjs-2'

const INITIAL_SIZE = 4

const INITIAL_MAT = [
 [ 1, 2,  2, 1],
 [-1, 2,  1, 0],
 [ 0, 1, -2, 2],
 [ 1, 2,  1, 2]
]

const INITIAL_VEC = [[1], [1], [1], [1]]

function Ex_8_1() {
  const [size, setSize] = useState(INITIAL_SIZE)
  const [mat, setMat] = useState(INITIAL_MAT)
  const [vec, setVec] = useState(INITIAL_VEC)

  const ITER = 10
  const labels: number[] = []
for (let i = 0; i < ITER; i++) {
  labels.push(1 + i)
}
  const data = {
    labels,
    datasets: [
      {
        label: 'L2 error of 1',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'L2 error of 2',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'L2 error of 3',
        data: [],
        borderColor: 'rgb(3, 252, 65)',
        backgroundColor: 'rgba(3, 252, 65, 0.5)',
      }
    ],
  }

  return (
    <Container maxWidth='xl'>
    <Sheet>
      <CssVarsProvider defaultColorScheme='dark'>
      <Typography level='h2'>Exercice 8.1</Typography>
      <Suspense fallback={<SuspenseGraph />}>
        <ConvGraph
          size={size}
          mat={mat}
          vec={vec}
        />
      </Suspense>

      <div className='h-12' />

      <Divider />

      <Matrix
        size={size}
        setSize={setSize}
        mat={mat}
        setMat={setMat}
        vec={vec}
        setVec={setVec} 
      />
      </CssVarsProvider>
    </Sheet>
    </Container>
  )
}

export default Ex_8_1