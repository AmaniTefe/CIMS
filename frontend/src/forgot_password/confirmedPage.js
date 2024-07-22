import React from 'react'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
function ConfirmedPage() {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/')
    }
  return (
    <div>
      <Typography variant="h4" sx={{ m: 1, textAlign: 'center' }}>
           email confirmed, please login
            </Typography>
            <button onClick={handleClick} >go to login</button>
    </div>
  )
}

export default ConfirmedPage
