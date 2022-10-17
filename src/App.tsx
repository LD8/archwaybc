import { AmplifyUser } from '@aws-amplify/ui'
import { UseAuthenticator } from '@aws-amplify/ui-react-core'
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
import { Toaster } from 'react-hot-toast'
import MainHeader from './components/MainHeader'
import TabPane from './components/TabPane'
import useDataStore from './hooks/useDataStore'

const App: React.FC<{
  signOut?: UseAuthenticator['signOut']
  user?: AmplifyUser
}> = ({ signOut }) => {
  const [marked, setMarked] = useState(false)
  const {
    images,
    videos,
    loadingImages,
    loadingVideos,
    refreshImages,
    refreshVideos,
  } = useDataStore(marked)

  console.log({ images, videos })

  const tabs = [
    {
      id: 'image',
      label: (
        <span>
          Image Table {images && <Badge color='blue'>{images.length}</Badge>}
        </span>
      ),
      content: (
        <TabPane
          marked={marked}
          content={images}
          loading={loadingImages}
          refresh={refreshImages}
        />
      ),
    },
    {
      id: 'video',
      label: (
        <span>
          Video Table {videos && <Badge color='blue'>{videos.length}</Badge>}
        </span>
      ),
      content: (
        <TabPane
          isVideo
          marked={marked}
          content={videos}
          loading={loadingVideos}
          refresh={refreshVideos}
        />
      ),
    },
  ]

  return (
    <ContentLayout
      header={<MainHeader signOut={signOut} />}
      data-content-layout
    >
      <Container
      data-main-div
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
              data-btn-mark-switch
              // loading={loadingImages || loadingVideos}
              onClick={() => setMarked(false)}
              variant={`${marked ? 'normal' : 'primary'}`}
            >
              To Be Marked
            </Button>
            <Button
              data-btn-mark-switch
              // loading={loadingImages || loadingVideos}
              onClick={() => setMarked(true)}
              variant={`${marked ? 'primary' : 'normal'}`}
            >
              Already Marked
            </Button>
          </SpaceBetween>
          <Tabs tabs={tabs} disableContentPaddings />
        </SpaceBetween>
      </Container>
      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{ style: { width: '100%', maxWidth: '500px' } }}
      />
    </ContentLayout>
  )
}

export default App
