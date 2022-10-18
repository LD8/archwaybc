import { Button, Header, Icon } from '@cloudscape-design/components'
import React, { useEffect, useRef, useState } from 'react'
import { IAppProps } from '../App'

const MainHeader: React.FC<IAppProps> = ({ signOut, user }) => {
  const refBtn = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  useEffect(() => {
    if (refBtn.current) {
      const btn = refBtn.current
      const handleEnter = () => setHovering(true)
      const handleLeave = () => setHovering(false)
      btn.addEventListener('mouseenter', handleEnter)
      btn.addEventListener('mouseleave', handleLeave)
      return () => {
        btn.removeEventListener('mouseenter', handleEnter)
        btn.removeEventListener('mouseleave', handleLeave)
      }
    }
  }, [])
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
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>
              {user?.username && (
                <>
                  <Icon name='user-profile' />
                  <span style={{ paddingLeft: '10px' }}>
                    Welcome! {user.username}
                  </span>
                </>
              )}
            </h3>
            <div ref={refBtn}>
              <Button variant='normal' onClick={signOut}>
                <Icon name={hovering ? 'unlocked' : 'lock-private'} />
                <span className='space-left'>Sign Out</span>
              </Button>
            </div>
          </div>
        }
      >
        <span className='font-fancy'>ArchwayBC</span>
      </Header>

      {/* <Alert>This is a generic alert.</Alert> */}
    </div>
  )
}

export default MainHeader
