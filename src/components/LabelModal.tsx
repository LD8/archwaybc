import { Card, SelectField, View } from '@aws-amplify/ui-react'
import { AmplifyS3Image } from '@aws-amplify/ui-react-v1'
import Box from '@cloudscape-design/components/box'
import Button from '@cloudscape-design/components/button'
import Modal from '@cloudscape-design/components/modal'
import SpaceBetween from '@cloudscape-design/components/space-between'
import React, { useEffect, useRef } from 'react'
import S3Video from './S3Video'
import { API } from 'aws-amplify'
// preferably api fetched ↓
const categories = [
  'Category Lorem',
  'Category Ipsum',
  'Category dolor',
  'Category consectetur',
  'Category adipisicing',
  'Category elit',
]

const LabelModal: React.FC<{
  itemKey?: string
  isVideo?: boolean
  onDismiss: () => void
  visible: boolean
}> = ({ itemKey, isVideo = false, onDismiss, visible }) => {
  const refDiv = useRef<HTMLDivElement>(null)
  // useEffect(() => {
  //   itemKey &&
  //     API.get('dbapis', `/videos`, {}).then(console.log)
  //   // initDraw(refDiv.current!, (coord) => console.log(coord))
  // }, [itemKey])

  if (!itemKey) return null

  return (
    <Modal
      header={`Label image: ${itemKey}`}
      onDismiss={onDismiss}
      visible={visible}
      closeAriaLabel='Close modal'
      size='max'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant='primary' onClick={() => alert('submit')}>
              Submit
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Card>
        <View ref={refDiv} marginBottom='20px'>
          {isVideo ? (
            <S3Video videoKey={itemKey} />
          ) : (
            <AmplifyS3Image imgKey={itemKey} />
          )}
        </View>
        <SelectField
          label='Category'
          descriptiveText={`Select a category for this ${
            isVideo ? 'video' : 'image'
          }`}
        >
          {categories.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </SelectField>
      </Card>
    </Modal>
  )
}

export default LabelModal
