import {
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  View,
} from '@aws-amplify/ui-react'
import React, { useState } from 'react'
import { useGetS3List } from '../hooks/useS3'
import LabelModal from './LabelModal'

const TabImage: React.FC<{
  isVideo?: boolean
}> = ({ isVideo = false }) => {
  const { loading, list: itemList } = useGetS3List({
    path: isVideo ? 'videos/' : 'images/',
  })
  const [itemKey, setItemKey] = useState<string>()
  return (
    <>
      <Table
        caption={
          loading ? (
            <Loader size='large' variation='linear' />
          ) : (
            <View marginTop='20px'>
              {itemList ? `Total nos - ${itemList.length}` : ''}
            </View>
          )
        }
        highlightOnHover
        className='tab-table'
      >
        <TableHead>
          <TableRow>
            <TableCell as='th'>{isVideo ? 'Video' : 'Image'} Key</TableCell>
            <TableCell as='th'>Size (bytes)</TableCell>
            <TableCell as='th'>Last Modified</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemList?.map(({ key, lastModified, size }) => (
            <TableRow key={key} onClick={() => setItemKey(key)}>
              <TableCell>{key}</TableCell>
              <TableCell>{size}</TableCell>
              <TableCell>{JSON.stringify(lastModified)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <LabelModal
        isVideo={isVideo}
        itemKey={itemKey}
        visible={!!itemKey}
        onDismiss={() => setItemKey(undefined)}
      />
    </>
  )
}

export default TabImage
