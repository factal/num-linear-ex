'use client'

import { Suspense, useEffect, useState, useTransition } from 'react'
import { ConvGraph, SuspenseGraph } from './conv-graph'
import Matrix from './matrix-input'
import { Container, CssVarsProvider, Divider, Sheet, Typography } from '@mui/joy'
import { ChartData } from 'chart.js'
import { useMediaQuery } from 'usehooks-ts'

const ITER = 10

const INITIAL_SIZE = 4

const INITIAL_MAT = [
 [ 1, 2,  2, 1],
 [-1, 2,  1, 0],
 [ 0, 1, -2, 2],
 [ 1, 2,  1, 2]
]

const INITIAL_VEC = [[1], [1], [1], [1]]

const labels: number[] = []
for (let i = 0; i < ITER; i++) {
  labels.push(1 + i)
}

const initialData: ChartData<'line', number[], number> = {
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

async function solve(size: number, mat: number[][], vec: number[][]) {
  const rust = import('../wasm/pkg')

  const a: Float64Array = Float64Array.from(mat.flat())
  const b = Float64Array.from(vec.flat())
  
  const errors = await rust.then((m) => {
    if (m.is_invertible(size, a)) {
      let temp: Float64Array = Float64Array.from(Array(size).fill(0))
      const iters: number[][] = [[], [], []]
      temp = m.solve_8_1(size, a, b, temp, ITER)

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < ITER; j++) {
          for (let k = 0; k < size; k++) {
            iters[i].push(temp[j * size + i * ITER * size + k])
          }
        }
      }

      const exact = m.solve_linear(size, a, b)

      const iters2: number[] = []

      let temp2: Float64Array = Float64Array.from(Array(size).fill(0))
      temp2 = m.solve_by_gauss_seidel(size, a, b, temp2, ITER)

      for (let j = 0; j < ITER; j++) {
        for (let k = 0; k < size; k++) {
          iters2.push(temp2[j * size + k])
        }
      }

      iters.push(iters2)

      const errors: number[][] = [[], [], [], []]
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < ITER; j++) {
          let err = 0
          for (let k = 0; k < size; k++) {
            err += (iters[i][j * size + k] - exact[k]) ** 2
          }
          errors[i].push(Math.pow(err, 0.5))
        }
      }

      return errors
    } else {
      throw new Error('Matrix is not invertible')
    }
  }).catch((e) => {
    console.error(e)
    return [[], [], [], []]
  })

  return errors
}

function Ex_8_1() {
  const [size, setSize] = useState(INITIAL_SIZE)
  const [mat, setMat] = useState(INITIAL_MAT)
  const [vec, setVec] = useState(INITIAL_VEC)


  const [graphData, setGraphData] = useState<ChartData<'line', number[]>>(initialData)

  const [isPending, startTransition] = useTransition()

  // initial calculation
  useEffect(() => {
    solve(INITIAL_SIZE, INITIAL_MAT, INITIAL_VEC).then(errors => {
      const initData = {
        labels,
        datasets: [
          {
            label: 'Jacobi',
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
          }, 
          {
            label: 'Gauss-Seidel',
            data: errors[3],
            borderColor: 'rgb(198, 52, 235)',
            backgroundColor: 'rgba(198, 52, 235, 0.5)',
          }
        ],
      }
      setGraphData(initData)
    })
  }, [])

  useEffect(() => {
    console.log('effected')
    solve(size, mat, vec).then(errors => {
      const newData = {
        labels,
        datasets: [
          {
            label: 'Jacobi',
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
          }, 
          {
            label: 'Gauss-Seidel',
            data: errors[3],
            borderColor: 'rgb(198, 52, 235)',
            backgroundColor: 'rgba(198, 52, 235, 0.5)',
          }
        ]
      }
      setGraphData(newData)
    })
  }, [mat, vec])

  const matches = useMediaQuery('(min-width: 768px)')

  return (
    <Container maxWidth='xl'>
    <Sheet sx={{padding: matches ? '48px' : '12px'}} >
      
      <CssVarsProvider defaultColorScheme='dark'>
      <Typography level='h2'>Exercice 8.1</Typography>
      <Suspense fallback={<SuspenseGraph />}>
        <ConvGraph
          graphData={graphData}
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
        startTransition={startTransition}
      />
      </CssVarsProvider>
    </Sheet>
    
    </Container>
    
  )
}

export default Ex_8_1