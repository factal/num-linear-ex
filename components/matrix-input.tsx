'use client'

import { Add, CheckCircle, ErrorOutline, Remove } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Chip, Input, Stack, Table, Typography } from '@mui/joy'
import { Key, TransitionStartFunction, memo, useCallback, useState } from 'react'

const checkInvertible = (size: number, mat: number[][]) => {
  const rust = import('../wasm/pkg')

  const a: Float64Array = Float64Array.from(mat.flat())

  return rust.then(m => m.is_invertible(size, a))
}

function InputNumber(props: { key: Key, value: number, onChange: (value: number) => void, onInvalidNumber: (value: string) => void }) {
  const { value, onChange, onInvalidNumber } = props

  const [localValue, setLocalValue] = useState(props.value.toString())

  const onChangeHandler = (value: string) => {
    if (value === '') {
      setLocalValue(value)
      onInvalidNumber(value)
      return
    }
    const newValue = Number(value)

    if (isNaN(newValue)) {
      setLocalValue(value)
      onInvalidNumber(value)
    } else {
      setLocalValue(newValue.toString())
      onChange(newValue)
    }
  }

  return (
    <Input
      key={props.key}
      color={(isNaN(Number(localValue)) || localValue === '') ? 'danger' : 'neutral'}
      variant='soft'
      size='sm'
      sx={{ width: '32px', margin: '0px', textAlign: 'right' }}
      value={localValue}
      onChange={e => onChangeHandler(e.target.value)}
    />
  )
}

function Matrix(props: {
  size: number,
  setSize: (size: number) => void,
  mat: number[][],
  setMat: (mat: number[][]) => void,
  vec: number[][],
  setVec: (vec: number[][]) => void,
  startTransition: TransitionStartFunction,
  isValidCalc: boolean
}) {
  const { size, setSize, mat, setMat, vec, setVec, startTransition, isValidCalc } = props

  const [isValid, setIsValid] = useState(true)
  const [isInvertible, setIsInvertible] = useState(true)

  const handleMatInputChange = useCallback((i: number, j: number, value: number) => {
    setIsValid(true)
    startTransition(() => {
      const newMat = mat.map(row => [...row])
      newMat[i][j] = value
      
      setMat(newMat)
      checkInvertible(size, newMat).then(isInvertible => {
        setIsInvertible(isInvertible)
      })
      
    })
  }, [mat, setMat, size, startTransition])

  const handleVecInputChange = useCallback((i: number, j: number, value: number) => {
    setIsValid(true)
    startTransition(() => {
      const newVec = vec.map(row => [...row])
      newVec[i][j] = value
      setVec(newVec)
    })
  }, [startTransition, vec, setVec])



  const handleInvalidNumber = () => {
    setIsValid(false)
  }

  const renderMatObj = (mat: number[][]) => {
    return mat.map((row, i) => {
      return <tr key={`tr-mat${i}`} >
        {row.map((v, j) => {
          return <td key={`td-mat-${i}-${j}`} className='m-0 p-0'>
            <InputNumber
              key={`input-mat-${i}-${j}`}
              value={v}
              onChange={e => handleMatInputChange(i, j, e)}
              onInvalidNumber={() => handleInvalidNumber()}
            />
          </td>
        })}
      </tr>
    })
  }

  const renderVecObj = (mat: number[][]) => {
    return mat.map((row, i) => {
      return <tr key={`tr-vec-${i}`} className="w-full whitespace-nowrap">
        {row.map((v, j) => {
          return (
            <td key={`td-vec-${i}-${j}`} className="whitespace-nowrap m-0">
              <InputNumber
                key={`input-vec-${i}-${j}`}
                value={v}
                onChange={e => handleVecInputChange(i, j, e)}
                onInvalidNumber={() => handleInvalidNumber()}
              />
            </td>
          )
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

    checkInvertible(size, newMat).then(isInvertible => {
      setIsInvertible(isInvertible)
    })
  }

  const onSub = () => {
    if (size === 1) {
      return
    }
    const newMat = mat.map(row => row.slice(0, size - 1))
    newMat.pop()
    setMat(newMat)
  
    const newVec = vec.slice(0, -1);
    setVec(newVec)
  
    setSize(size - 1)

    checkInvertible(size, newMat).then(isInvertible => {
      setIsInvertible(isInvertible)
    })
  }

  const CoeffMat = (props: {mat: number[][]}) => {
    const { mat } = props
    return (
      <Table
        variant='soft'
        borderAxis='both'
        sx={{width: 'fit-content'}}
      >
        <tbody>
          {renderMatObj(mat)}
        </tbody>
      </Table >
    )
  }

  const ConstVec = (props: {vec: number[][]}) => {
    const { vec } = props
    return (
      <Table
        variant='soft'
        borderAxis='both'
        sx={{width: 'fit-content'}}
      >
        <tbody>
          {renderVecObj(vec)}
        </tbody>
      </Table >
    )
  }

 const MemoCoeffMat = memo(CoeffMat)

  const randomizeMatAndVec = () => {
    const newMat = mat.map(row => row.map(() => Math.random() * 10))
    const newVec = vec.map(row => row.map(() => Math.random() * 10))

    setMat(newMat)
    setVec(newVec)
  }

  return (
    <div>
      <div className='h-8' />
      {/* <Stack
        spacing={0.5}
        sx={{}}
      > */}
      <Card>
        <div className='w-fit m-auto'>
          <CardActions>
            <div className='flex flex-row m-auto mb-4'>
              <Chip variant='solid' color='neutral' onClick={onAdd}><Add /></Chip>
              <Typography fontSize='xl' sx={{alignItems: 'flex-start', alignmentBaseline: 'central', paddingX: '12px'}} >{size}</Typography>
              <Chip variant='solid' color='neutral' onClick={onSub} disabled={size == 1}><Remove /></Chip>
            </div>
          </CardActions>

          
          <CardContent>
          <Stack spacing={1}>
            <div className='flex flex-row w-fit gap-4'>
              <MemoCoeffMat mat={mat} />
              <ConstVec vec={vec} />
            </div>
          </Stack>
          </CardContent>
        </div>

        <Button>
          <Typography level='body1' color='primary' onClick={randomizeMatAndVec}>Randomize</Typography>
        </Button>
        
        <Stack direction='row' spacing={2} justifyContent='center'>
          <Typography
            level='body3'
            color='danger'
            sx={{ alignSelf: 'flex-end'}}
            startDecorator={isInvertible ? null : <ErrorOutline />}
          >
            {isInvertible ? '' : 'Not invertible'}
          </Typography>

          <Typography
            level='body3'
            color='danger'
            sx={{ alignSelf: 'flex-end'}}
            startDecorator={isValid ? null : <ErrorOutline />}
          >
            {isValid ? '' : 'Invalid input'}
          </Typography>

          <Typography
            level='body3'
            color='danger'
            sx={{ alignSelf: 'flex-end'}}
            startDecorator={isValidCalc ? null : <ErrorOutline />}
          >
            {isValidCalc ? '' : 'Invalid calculation: maybe one of M is not invertible'}
          </Typography>
        </Stack>
      </Card>
    </div>
  )
}

export default Matrix