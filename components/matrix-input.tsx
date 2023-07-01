'use client'

import { Button, Chip, Input, Table, Textarea, Typography } from "@mui/joy"

const capitalize = (word: string) => {
  return word[0].toUpperCase() + word.slice(1)
}

function Matrix(props: {
  size: number,
  setSize: (size: number) => void,
  mat: number[][],
  setMat: (mat: number[][]) => void,
  vec: number[][],
  setVec: (vec: number[][]) => void,
}) {
  const { size, setSize, mat, setMat, vec, setVec } = props

  const renderMatObj = (mat: number[][]) => {
    console.log(mat)
    return mat.map((row, i) => {
      return <tr key={i} className="w-full whitespace-nowrap"   >
        {row.map((v, j) => {
          return <td key={j} className="whitespace-nowrap m-0">
            <Input
              size='sm'
              sx={{ width: '48px', margin: '0px' }}
              value={v}
              onChange={(e) => {
                parseFloat(e.target.value)
                const newMat = mat.map(row => [...row])
                newMat[i][j] = parseFloat(e.target.value)
                setMat(newMat)
              }} />
            {/* {v} */}
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

    vec.pop()
    setVec(vec)

    setSize(size - 1)
  }

  // const renderHeader = () => {
  //   return <tr>
  //     {Object.keys(INITIAL_MAT[0]).map(key => <th>{capitalize(key)}</th>)}
  //   </tr>
  // }

  const renderCoeffMat = () => {
    return (
      <Table
        variant='outlined'
        borderAxis='both'
        sx={{width: 'fit-content'}}
      >
        {/* {renderHeader()} */}
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
          {renderMatObj(vec)}
        </tbody>
      </Table >
    )
  }

  return (
    <div>
      <div className='h-12' />

      <div className='w-fit m-auto'>
        <div className='flex flex-row m-auto'>
          <Button variant='soft' onClick={onAdd}>+</Button>
          <Typography fontSize='xl' sx={{alignItems: 'flex-start', alignmentBaseline: 'central', paddingX: '12px'}} >{size}</Typography>
          <Button variant='soft' onClick={onSub}>-</Button>
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