import { AmplifyS3Image } from '@aws-amplify/ui-react-v1'
import {
  Box,
  Button,
  FormField,
  Icon,
  Link,
  Modal,
  Select,
  SelectProps,
  SpaceBetween,
} from '@cloudscape-design/components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image } from '../models'
import { coordToMouse, mouseToCoord } from '../utils'
import S3Video from './S3Video'
import { IMedia } from './TabPane'

// preferably api fetched ↓
const catOptions = [
  'Category Lorem',
  'Category Ipsum',
  'Category dolor',
  'Category consectetur',
  'Category adipisicing',
  'Category elit',
].map((v) => ({ label: v, value: v }))

export const MOUSE_INIT = () => ({
  endX: 0,
  endY: 0,
  startX: 0,
  startY: 0,
})

const MarkingModal: React.FC<{
  isVideo?: boolean
  onDismiss: () => void
  visible: boolean
  itemData?: IMedia
}> = ({ isVideo = false, onDismiss, visible, itemData }) => {
  const refSrcDiv = useRef<HTMLDivElement>(null)
  const refBoxDiv = useRef<HTMLDivElement>()
  const refMouse = useRef(
    !isVideo && (itemData as Image)?.box?.length === 4
      ? coordToMouse((itemData as Image).box as IBox)
      : MOUSE_INIT(),
  )
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>()
  const [drawStart, setDrawStart] = useState(false)
  // console.log({
  //   refMouse: refMouse.current,
  //   itemData,
  //   drawStart,
  //   refBoxDiv: refBoxDiv.current,
  // })

  const handleDismiss = useCallback(() => {
    onDismiss()
    setSelectedOption(undefined)
    setDrawStart(false)
    refBoxDiv.current = undefined
    refMouse.current = MOUSE_INIT()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const targetDiv = refSrcDiv.current
    if (targetDiv) {
      const handleClick = ({ offsetX, offsetY }: MouseEvent) => {
        if (refBoxDiv.current) {
          targetDiv.style.cursor = 'default'
          console.log({ finished: mouseToCoord(refMouse.current) })
          setDrawStart(false)
        } else {
          refMouse.current.startX = offsetX
          refMouse.current.startY = offsetY
          console.log({ begun: mouseToCoord(refMouse.current) })
          refBoxDiv.current = document.createElement('div')
          refBoxDiv.current.className = 'rectangle'
          refBoxDiv.current.style.left = `${refMouse.current.startX}px`
          refBoxDiv.current.style.top = `${refMouse.current.startY}px`
          targetDiv.appendChild(refBoxDiv.current)
        }
      }
      const handleMove = ({ offsetX, offsetY }: MouseEvent) => {
        refMouse.current.endX = offsetX
        refMouse.current.endY = offsetY
        if (refBoxDiv.current) {
          const xShift = refMouse.current.endX - refMouse.current.startX
          const yShift = refMouse.current.endY - refMouse.current.startY
          refBoxDiv.current.style.width = Math.abs(xShift) + 'px'
          refBoxDiv.current.style.height = Math.abs(yShift) + 'px'
          refBoxDiv.current.style.left =
            xShift < 0
              ? refMouse.current.endX + 'px'
              : refMouse.current.startX + 'px'
          refBoxDiv.current.style.top =
            yShift < 0
              ? refMouse.current.endY + 'px'
              : refMouse.current.startY + 'px'
        }
      }
      if (drawStart) {
        targetDiv.style.cursor = 'crosshair'
        const chd = targetDiv.firstChild
        if (chd) {
          targetDiv.removeChild(chd)
        }
        refBoxDiv.current = undefined
        refMouse.current = MOUSE_INIT()
        targetDiv.addEventListener('click', handleClick)
        targetDiv.addEventListener('mousemove', handleMove)
      } else {
        targetDiv.removeEventListener('click', handleClick)
        targetDiv.removeEventListener('mousemove', handleMove)
      }
      return () => {
        targetDiv.removeEventListener('click', handleClick)
        targetDiv.removeEventListener('mousemove', handleMove)
      }
    }
  }, [drawStart])

  if (!itemData) return null
  const { itemKey } = itemData
  return (
    <Modal
      header={`Marking image: ${itemKey}`}
      onDismiss={handleDismiss}
      visible={visible}
      closeAriaLabel='Close modal'
      size='max'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleDismiss}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => {
                alert('submit')
                handleDismiss()
              }}
            >
              Submit
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <div className='div-marking'>
        <div ref={refSrcDiv} className='div-marking-src-before' />
        <div className='div-marking-src'>
          {isVideo ? (
            <S3Video videoKey={itemKey.replace(/^public\//, '')} />
          ) : (
            <AmplifyS3Image imgKey={itemKey.replace(/^public\//, '')} />
          )}
        </div>
        <div className='div-marking-inputs'>
          <FormField
            description='Please select from the options'
            label={`${isVideo ? 'Video' : 'Image'} Category`}
          >
            <Select
              selectedOption={selectedOption || null}
              placeholder='Not selected'
              options={catOptions}
              selectedAriaLabel='Selected'
              onChange={({ detail }) =>
                setSelectedOption(detail.selectedOption)
              }
            />
          </FormField>
          {!isVideo && (
            <FormField
              description='Please draw a bounding box to the image'
              label='Image Bounding Box'
            >
              <div className='div-marking-inputs-div'>
                {drawStart ? (
                  <Button onClick={() => setDrawStart(false)}>Cancel</Button>
                ) : (
                  <Button variant='primary' onClick={() => setDrawStart(true)}>
                    Draw
                  </Button>
                )}
              </div>
            </FormField>
          )}
        </div>
        <div className='div-marking-helps'>
          <Helps />
        </div>
      </div>
    </Modal>
  )
}

export default MarkingModal

function Helps() {
  return (
    <div>
      <h3>Help panel</h3>
      <p>
        This is a paragraph with some help information regarding the marking
        system.
      </p>
      <h3>Bounding box rules</h3>
      <dl>
        <dt>
          <em>One box can be drawn</em>
        </dt>
        <dd>If needed, more boxes can be drawn once properly configured</dd>
        <dt>
          <em>Redraw is allowed</em>
        </dt>
        <dd>
          Before submission, you can draw multiple times by clicking the Draw
          button
        </dd>
        <dt>
          <em>Other rules</em>
        </dt>
        <dd>Lorem ipsum, dolor sit amet sectetur adipisicing elit</dd>
      </dl>
      <div>
        <h3>
          Learn more <Icon name='external' />
        </h3>
        <div>
          <Link href=''>Documentation</Link>
        </div>
        <div>
          <Link href=''>Customer service</Link>
        </div>
      </div>
    </div>
  )
}
