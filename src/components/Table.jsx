import React, { useState } from 'react'
import { useCollection } from '@cloudscape-design/collection-hooks'
import {
  Box,
  Button,
  CollectionPreferences,
  Header,
  Pagination,
  Table,
  TextFilter,
} from '@cloudscape-design/components'
import allItems from './data'
import {
  columnDefinitions,
  getMatchesCountText,
  paginationLabels,
  collectionPreferencesProps,
} from './table-config'

function EmptyState({ title, subtitle, action }) {
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

export default function CollectionHooksTable() {
  const [preferences, setPreferences] = useState({
    pageSize: 10,
    visibleContent: ['id', 'availabilityZone', 'state'],
  })
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(allItems, {
    filtering: {
      empty: (
        <EmptyState
          title='No instances'
          subtitle='No instances to display.'
          action={<Button>Create instance</Button>}
        />
      ),
      noMatch: (
        <EmptyState
          title='No matches'
          subtitle='We can’t find a match.'
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
  const { selectedItems } = collectionProps
  return (
    <Table
      {...collectionProps}
      selectionType='multi'
      header={
        <Header
          counter={
            selectedItems.length
              ? `(${selectedItems.length}/${allItems.length})`
              : `(${allItems.length})`
          }
        >
          Instances
        </Header>
      }
      columnDefinitions={columnDefinitions}
      visibleColumns={preferences.visibleContent}
      items={items}
      pagination={
        <Pagination {...paginationProps} ariaLabels={paginationLabels} />
      }
      filter={
        <TextFilter
          {...filterProps}
          countText={getMatchesCountText(filteredItemsCount)}
          filteringAriaLabel='Filter instances'
        />
      }
      preferences={
        <CollectionPreferences
          {...collectionPreferencesProps}
          preferences={preferences}
          onConfirm={({ detail }) => setPreferences(detail)}
        />
      }
    />
  )
}
