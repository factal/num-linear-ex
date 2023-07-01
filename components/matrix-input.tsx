'use client'

import { Button, Input, Table, Typography } from '@mui/joy'
import { TransitionStartFunction, useCallback } from 'react'

function Matrix(props: {
  size: number,
  setSize: (size: number) => void,
  mat: number[][],
  setMat: (mat: number[][]) => void,
  vec: number[][],
  setVec: (vec: number[][]) => void,
  startTransition: TransitionStartFunction
}) {
  const { size, setSize, mat, setMat, vec, setVec, startTransition } = props

  const handleMatInputChange = useCallback((i: number, j: number, value: string) => {
    console.log('handle input change')
    startTransition(() => {
      const newMat = mat.map(row => [...row])
      newMat[i][j] = parseFloat(value)
      setMat(newMat)
    })
    
  }, [mat, setMat])

  const handleVecInputChange = useCallback((i: number, j: number, value: string) => {
    console.log('handle input change')
    startTransition(() => {
      const newVec = vec.map(row => [...row])
      newVec[i][j] = parseFloat(value)
      setVec(newVec)
    })
    
  }, [vec, setVec])

  const renderMatObj = (mat: number[][]) => {
    console.log('render mat obj')
    return mat.map((row, i) => {
      return <tr key={i} className="w-full whitespace-nowrap">
        {row.map((v, j) => {
          return <td key={j} className="whitespace-nowrap m-0">
            <Input
              size='sm'
              sx={{ width: '48px', margin: '0px', textAlign: 'right' }}
              value={v}
              onChange={(e) => handleMatInputChange(i, j, e.target.value)}
            />
          </td>
        })}
      </tr>
    })
  }

  const renderVecObj = (mat: number[][]) => {
    console.log('render mat obj')
    return mat.map((row, i) => {
      return <tr key={i} className="w-full whitespace-nowrap">
        {row.map((v, j) => {
          return <td key={j} className="whitespace-nowrap m-0">
            <Input
              size='sm'
              sx={{ width: '48px', margin: '0px', textAlign: 'right' }}
              value={v}
              onChange={(e) => handleVecInputChange(i, j, e.target.value)}
            />
          </td>
        })}
      </tr>
    })
  }

  const onAdd = () => {
    const newMat = mat.map(row => [...row, 0])
    newMat.push(Array(size + 1).fill(0))
    setMat(newMat)

    setVec([...vec, [0]])

    setSize(size + 1)
  }

  const onSub = () => {
    const newMat = mat.map(row => row.slice(0, size - 1))
    newMat.pop()
    setMat(newMat)
  
    const newVec = vec.slice(0, -1);
    setVec(newVec)
  
    setSize(size - 1)
  }

  const renderCoeffMat = () => {
    return (
      <Table
        variant='outlined'
        borderAxis='both'
        sx={{width: 'fit-content'}}
      >
        <tbody>
          {renderMatObj(mat)}
        </tbody>
      </Table >
    )
  }

  const renderVec = () => {
    return (
      <Table
        variant='outlined'
        borderAxis='both'
        sx={{width: 'fit-content'}}
      >
        <tbody>
          {renderVecObj(vec)}
        </tbody>
      </Table >
    )
  }

  return (
    <div>
      <div className='h-12' />

      <div className='w-fit m-auto'>
        <div className='flex flex-row m-auto'>
          <Button variant='outlined' onClick={onAdd}>+</Button>
          <Typography fontSize='xl' sx={{alignItems: 'flex-start', alignmentBaseline: 'central', paddingX: '12px'}} >{size}</Typography>
          <Button variant='outlined' onClick={onSub}>-</Button>
        </div>
        
        <div className='flex flex-row w-fit'>
          {renderCoeffMat()}
          {renderVec()}
        </div>
      </div>
      
    </div>
  )
}

export default Matrix