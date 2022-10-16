import { AmplifyS3Image } from '@aws-amplify/ui-react-v1'
import {
  Box,
  Button,
  FormField,
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
export const MOUSE_INIT = {
  endX: 0,
  endY: 0,
  startX: 0,
  startY: 0,
}
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
      : MOUSE_INIT,
  )
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>()
  const [drawStart, setDrawStart] = useState(false)

  const handleDismiss = useCallback(() => {
    onDismiss()
    setSelectedOption(undefined)
    setDrawStart(false)
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
          refBoxDiv.current.style.width =
            Math.abs(refMouse.current.endX - refMouse.current.startX) + 'px'
          refBoxDiv.current.style.height =
            Math.abs(refMouse.current.endY - refMouse.current.startY) + 'px'
          refBoxDiv.current.style.left =
            refMouse.current.endX - refMouse.current.startX < 0
              ? refMouse.current.endX + 'px'
              : refMouse.current.startX + 'px'
          refBoxDiv.current.style.top =
            refMouse.current.endY - refMouse.current.startY < 0
              ? refMouse.current.endY + 'px'
              : refMouse.current.startY + 'px'
        }
      }
      if (drawStart) {
        targetDiv.style.cursor = 'crosshair'
        const chd = targetDiv.firstChild
        if (chd) {
          targetDiv.removeChild(chd)
          refBoxDiv.current = undefined
          refMouse.current = MOUSE_INIT
        }
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
      header={`Label image: ${itemKey}`}
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
              description='Please select from the options'
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
      </div>
    </Modal>
  )
}

export default MarkingModal
