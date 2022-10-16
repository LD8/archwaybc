import { Button, Header } from '@cloudscape-design/components'
import React from 'react'

const MainHeader: React.FC<{ signOut?: () => void }> = ({ signOut }) => {
  return (
    <div className='heading'>
      <Header
        variant='h1'
        info={
          <h4 className='font-fancy' style={{ display: 'inline', margin: 0 }}>
            Marking System
          </h4>
        }
        description='We provide safe and sound transportation services for millions every single day'
        actions={
          <Button variant='normal' onClick={signOut}>
            Sign Out
          </Button>
        }
      >
        <span className='font-fancy'>ArchwayBC</span>
      </Header>

      {/* <Alert>This is a generic alert.</Alert> */}
    </div>
  )
}

export default MainHeader
