import {
  Box,
  Header,
  Pagination,
  StatusIndicator,
  Table,
  TextFilter,
} from '@cloudscape-design/components'
import React, { useEffect, useState } from 'react'
import { Image, Video } from '../models'
import LabelModal from './LabelModal'
import { useCollection } from '@cloudscape-design/collection-hooks'

const TabPane: React.FC<{
  loading: boolean
  isVideo?: boolean
  marked?: boolean
  content?: (Image | Video)[]
}> = ({ isVideo = false, marked = false, loading, content = [] }) => {
  const [filteredContent, setFilteredContent] = useState(content)
  const [itemKey, setItemKey] = useState<string>()
  const [filteringText, setFilteringText] = useState('')
  const [currentPageIndex, setCurrentPageIndex] = useState(1)

  useEffect(() => {
    if (content.length) {
      if (filteringText) {
        setFilteredContent(
          content.filter(
            ({ itemKey, category }) =>
              itemKey.includes(filteringText) ||
              category?.includes(filteringText),
          ),
        )
      } else {
        setFilteredContent(content)
      }
    }
  }, [filteringText, content])

  return (
    <>
      <Table<Image | Video>
        header={
          marked ? (
            <Header>
              Total
              <span style={{ padding: '0 10px' }}>{content.length}</span>
              {isVideo ? 'videos' : 'images'} marked
            </Header>
          ) : (
            <Header>
              <span style={{ padding: '0 10px' }}>{content.length}</span>
              {isVideo ? 'videos' : 'images'} to be marked
            </Header>
          )
        }
        items={filteredContent}
        loading={loading}
        loadingText='Loading resources'
        columnDefinitions={[
          {
            id: 'itemKey',
            header: 'Item Key',
            cell: (item) => item.itemKey || '-',
            sortingField: 'itemKey',
          },
          {
            id: 'category',
            header: 'Category',
            cell: (item) => item.category || '-',
            sortingField: 'category',
          },
          {
            id: 'marked',
            header: 'Marked',
            cell: ({ marked }) => (
              <StatusIndicator type={marked ? 'success' : 'info'}>
                {marked ? 'done' : 'not yet'}
              </StatusIndicator>
            ),
          },
          {
            id: 'createdAt',
            header: 'Created At',
            cell: (item) => `${item.createdAt}` || '-',
          },
          {
            id: 'updatedAt',
            header: 'Updated At',
            cell: (item) => `${item.updatedAt}` || '-',
          },
        ]}
        empty={
          <Box textAlign='center' color='inherit'>
            <b>No resources</b>
            <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
              No {isVideo ? 'videos' : 'images'} to display.
            </Box>
            {/* <Button>Create resource</Button> */}
          </Box>
        }
        filter={
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder='Find instances'
            filteringAriaLabel='Filter instances'
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
        }
        pagination={
          <Pagination
            ariaLabels={{
              nextPageLabel: 'Next page',
              previousPageLabel: 'Previous page',
              pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
            }}
            currentPageIndex={currentPageIndex}
            onChange={({ detail }) =>
              setCurrentPageIndex(detail.currentPageIndex)
            }
            pagesCount={filteredContent.length / 1}
          />
        }
      />
      <LabelModal
        isVideo={isVideo}
        itemKey={itemKey}
        visible={!!itemKey}
        onDismiss={() => setItemKey(undefined)}
      />
    </>
  )
}

export default TabPane
