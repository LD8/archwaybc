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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useInstanceUpdate } from '../hooks/useDataStore'
import { Image, Video } from '../models'
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

export const MOUSE_INIT = () => ({ endX: 0, endY: 0, startX: 0, startY: 0 })
const REC_STYLE_INIT = {
  width: 'unset',
  height: 'unset',
  left: 'unset',
  top: 'unset',
  display: 'none',
}
let clickInitiated = false

const MarkingModal: React.FC<{
  isVideo?: boolean
  onDismiss: () => void
  visible: boolean
  itemData?: IMedia
  refresh: () => void
}> = ({ isVideo = false, onDismiss, visible, itemData, refresh }) => {
  const refSrcDiv = useRef<HTMLDivElement>(null)
  const refBoxDiv = useRef<HTMLDivElement>(null)
  const [boxStyle, setBoxStyle] = useState<React.CSSProperties>(REC_STYLE_INIT)
  const imageBoxDefined = useMemo(
    () => !isVideo && (itemData as Image)?.box?.length === 4,
    [isVideo, itemData],
  )
  const refMouse = useRef(
    imageBoxDefined
      ? coordToMouse((itemData as Image).box as IBox)
      : MOUSE_INIT(),
  )

  useEffect(() => {
    if (imageBoxDefined) {
      // image box already defined -> draw a boxDiv
      const { startX, startY, endX, endY } = coordToMouse(
        (itemData as Image).box as IBox,
      )
      const xShift = endX - startX
      const yShift = endY - startY
      setBoxStyle({
        width: `${Math.abs(xShift)}px`,
        height: `${Math.abs(yShift)}px`,
        left: xShift < 0 ? `${endX}px` : `${startX}px`,
        top: yShift < 0 ? `${endY}px` : `${startY}px`,
        display: 'block',
      })
      return () => setBoxStyle(REC_STYLE_INIT)
    }
  }, [imageBoxDefined, itemData])

  const [drawStart, setDrawStart] = useState(false)
  useEffect(() => {
    const targetDiv = refSrcDiv.current
    if (targetDiv) {
      const handleClick = ({ offsetX, offsetY }: MouseEvent) => {
        if (!drawStart) return
        if (!clickInitiated) {
          // first click to start drawing
          refMouse.current.startX = offsetX
          refMouse.current.startY = offsetY
          console.log({ begun: mouseToCoord(refMouse.current) })
          setBoxStyle({
            width: 0,
            height: 0,
            left: `${refMouse.current.startX}px`,
            top: `${refMouse.current.startY}px`,
            display: 'block',
          })
          clickInitiated = true
        } else {
          // second click to finish drawing
          targetDiv.style.cursor = 'default'
          console.log({ finished: mouseToCoord(refMouse.current) })
          setDrawStart(false)
          clickInitiated = false
        }
      }
      const handleMove = ({ offsetX, offsetY }: MouseEvent) => {
        if (!drawStart) return
        const mouse = refMouse.current
        mouse.endX = offsetX
        mouse.endY = offsetY
        if (clickInitiated) {
          const xShift = mouse.endX - mouse.startX
          const yShift = mouse.endY - mouse.startY
          setBoxStyle({
            width: `${Math.abs(xShift)}px`,
            height: `${Math.abs(yShift)}px`,
            left: xShift < 0 ? `${mouse.endX}px` : `${mouse.startX}px`,
            top: yShift < 0 ? `${mouse.endY}px` : `${mouse.startY}px`,
          })
        }
      }

      const removeTargetListeners = () => {
        targetDiv.style.cursor = 'default'
        targetDiv.removeEventListener('click', handleClick)
        targetDiv.removeEventListener('mousemove', handleMove)
      }
      if (drawStart) {
        targetDiv.style.cursor = 'crosshair'
        setBoxStyle(REC_STYLE_INIT)
        refMouse.current = MOUSE_INIT()
        targetDiv.addEventListener('click', handleClick)
        targetDiv.addEventListener('mousemove', handleMove)
        return removeTargetListeners
      } else {
        removeTargetListeners()
      }
    }
  }, [drawStart])

  const { updating, updateInstance } = useInstanceUpdate(isVideo)
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>()
  useEffect(() => {
    if (itemData?.category) {
      setSelectedOption({ label: itemData.category, value: itemData.category })
    }
  }, [itemData?.category])
  const handleDismiss = useCallback(() => {
    onDismiss()
    setSelectedOption(undefined)
    setDrawStart(false)
    refMouse.current = MOUSE_INIT()
    setBoxStyle(REC_STYLE_INIT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!itemData) return null
  const { itemKey } = itemData
  // console.log({
  //   refMouse: refMouse.current,
  //   itemData,
  //   drawStart,
  //   refBoxDiv: refBoxDiv.current,
  //   boxStyle,
  // })
  return (
    <Modal
      header={`Marking image: ${itemKey}`}
      onDismiss={handleDismiss}
      visible={visible}
      closeAriaLabel='Close modal'
      size='max'
      data-marking-modal
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleDismiss}>
              Cancel
            </Button>
            <Button
              variant='primary'
              loading={updating}
              onClick={async () => {
                if (isVideo) {
                  const orgVid: Video = itemData as Video
                  if (!orgVid.category && !selectedOption) {
                    return toast.error('Video category not selected')
                  }
                  await updateInstance(orgVid.id, {
                    category: selectedOption?.value || orgVid.category,
                  })
                } else {
                  // isImage
                  const orgImg: Image = itemData as Image
                  if (!orgImg.category && !selectedOption) {
                    return toast.error('Image category not selected')
                  }
                  if (
                    !imageBoxDefined &&
                    refBoxDiv.current?.style.display !== 'block'
                  ) {
                    return toast.error('Image bounding box is not defined')
                  }
                  await updateInstance(orgImg.id, {
                    category: selectedOption?.value || orgImg.category,
                    box: mouseToCoord(refMouse.current),
                  })
                }
                refresh()
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
        <div ref={refSrcDiv} className='div-marking-src-before'>
          <div ref={refBoxDiv} className='rectangle' style={boxStyle} />
        </div>
        <div className='div-marking-src'>
          {isVideo ? (
            <S3Video videoKey={itemKey.replace(/^public\//, '')} />
          ) : (
            <AmplifyS3Image imgKey={itemKey.replace(/^public\//, '')} />
          )}
        </div>
        <div className='div-marking-src-after font-fancy'>
          Loading {isVideo ? 'Video' : 'Image'}...
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
                    {imageBoxDefined ? 'Redefined Bounding Box' : 'Draw'}
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
