import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import {
  Badge,
  Button,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  Tabs,
} from '@cloudscape-design/components'
import '@cloudscape-design/global-styles/index.css'
import React, { useState } from 'react'
import useDataStore from './hooks/useDataStore'
import TabPane from './components/TabPane'
import MainHeader from './components/MainHeader'

const App: React.FC<{ signOut?: () => void }> = ({ signOut }) => {
  const [marked, setMarked] = useState(false)
  const { images, videos, loading } = useDataStore(marked)
  console.log({
    images,
    videos,
  })

  const tabs = [
    {
      label: (
        <span>
          Image Table {images && <Badge color='blue'>{images.length}</Badge>}
        </span>
      ),
      id: 'image',
      content: <TabPane marked={marked} content={images} loading={loading} />,
    },
    {
      label: (
        <span>
          Video Table {videos && <Badge color='blue'>{videos.length}</Badge>}
        </span>
      ),
      id: 'video',
      content: (
        <TabPane isVideo marked={marked} content={videos} loading={loading} />
      ),
    },
  ]

  return (
    <ContentLayout header={<MainHeader signOut={signOut} />}>
      <Container
        footer={<MainHeader signOut={signOut} />}
        header={
          <Header
            variant='h2'
            description='Please select a category, either "To Be Marked" (default) or "Already Marked"'
          >
            Marking Categories
          </Header>
        }
      >
        <SpaceBetween size='l'>
          <SpaceBetween size='m' direction='horizontal'>
            <Button
              loading={loading}
              onClick={() => setMarked(false)}
              variant={`${marked ? 'normal' : 'primary'}`}
            >
              To Be Marked
            </Button>
            <Button
              loading={loading}
              onClick={() => setMarked(true)}
              variant={`${marked ? 'primary' : 'normal'}`}
            >
              Already Marked
            </Button>
          </SpaceBetween>
          <Tabs tabs={tabs} disableContentPaddings />
        </SpaceBetween>
      </Container>
    </ContentLayout>
  )
}

export default withAuthenticator(App)
