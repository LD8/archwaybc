import { useCollection } from '@cloudscape-design/collection-hooks'
import {
  Box,
  Button,
  CollectionPreferences,
  CollectionPreferencesProps,
  Pagination,
  StatusIndicator,
  Table,
  TextFilter,
} from '@cloudscape-design/components'
import React, { useState } from 'react'
import { Image, Video } from '../models'
import { regulateTime } from '../utils'
import MarkingModal from './MarkingModal'

export type IMedia = Image | Video
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_VISIBLE = ['itemKey', 'category', 'marked', 'updatedAt']

const TabPane: React.FC<{
  loading: boolean
  isVideo?: boolean
  marked?: boolean
  refresh: () => void
  content?: IMedia[]
}> = ({ isVideo = false, marked = false, loading, content = [], refresh }) => {
  const [preferences, setPreferences] =
    useState<CollectionPreferencesProps.Preferences>({
      pageSize: DEFAULT_PAGE_SIZE,
      visibleContent: DEFAULT_VISIBLE,
      wrapLines: false,
    })
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection<IMedia>(content, {
    filtering: {
      empty: (
        <EmptyState title='No instances' subtitle='No instances to display.' />
      ),
      noMatch: (
        <EmptyState
          title='No matches'
          subtitle='We can not find a match.'
          action={
            <Button onClick={() => actions.setFiltering('')}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  })
  const [itemData, setItemData] = useState<IMedia>()

  return (
    <div style={{ marginTop: '0.5rem' }} className='table-container'>
      <MarkingModal
        isVideo={isVideo}
        itemData={itemData}
        visible={!!itemData}
        onDismiss={() => setItemData(undefined)}
        refresh={refresh}
      />
      <Table<IMedia>
        {...collectionProps}
        stickyHeader
        variant='embedded'
        selectionType='multi'
        loading={loading}
        loadingText='Loading resources'
        visibleColumns={preferences.visibleContent}
        items={items}
        onRowClick={({ detail: { item } }) => setItemData(item)}
        wrapLines={preferences.wrapLines}
        pagination={
          <Pagination
            {...paginationProps}
            ariaLabels={{
              nextPageLabel: 'Next page',
              previousPageLabel: 'Previous page',
              pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
            }}
          />
        }
        filter={
          <TextFilter
            {...filterProps}
            filteringPlaceholder='Find instances looping through all fields'
            filteringAriaLabel='Filter instances'
            countText={`Found ${filteredItemsCount} instance(s)`}
          />
        }
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
            cell: (item) => regulateTime(item.createdAt),
            sortingField: 'createdAt',
          },
          {
            id: 'updatedAt',
            header: 'Updated At',
            cell: (item) => regulateTime(item.updatedAt),
            sortingField: 'updatedAt',
          },
        ]}
        preferences={
          <CollectionPreferences
            title='Preferences'
            cancelLabel='Cancel'
            confirmLabel='Confirm'
            onConfirm={({ detail }) => setPreferences(detail)}
            preferences={preferences}
            wrapLinesPreference={{
              label: 'Wrap lines',
              description: 'Wrap lines description',
            }}
            pageSizePreference={{
              title: 'Select page size',
              options: [
                { value: 10, label: '10 resources' },
                { value: 20, label: '20 resources' },
                { value: 40, label: '40 resources' },
                { value: 60, label: '60 resources' },
                { value: 80, label: '80 resources' },
                { value: 100, label: '100 resources' },
              ],
            }}
            visibleContentPreference={{
              title: 'Select visible content',
              options: [
                {
                  label: 'Main resource properties',
                  options: [
                    {
                      id: 'itemKey',
                      label: 'Item Key',
                      editable: false,
                    },
                    { id: 'category', label: 'Category' },
                    {
                      id: 'marked',
                      label: 'Marked',
                    },
                    {
                      id: 'createdAt',
                      label: 'Created At',
                    },
                    {
                      id: 'updatedAt',
                      label: 'Updated At',
                    },
                  ],
                },
              ],
            }}
          />
        }
      />
    </div>
  )
}

export default TabPane

function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <Box textAlign='center' color='inherit'>
      <Box variant='strong' textAlign='center' color='inherit'>
        {title}
      </Box>
      <Box variant='p' padding={{ bottom: 's' }} color='inherit'>
        {subtitle}
      </Box>
      {action}
    </Box>
  )
}
