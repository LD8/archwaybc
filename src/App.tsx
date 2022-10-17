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
import { Toaster } from 'react-hot-toast'

const App: React.FC<{ signOut?: () => void }> = ({ signOut }) => {
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
            <div className='btn-mark-switch'>
              <Button
                loading={loadingImages || loadingVideos}
                onClick={() => setMarked(false)}
                variant={`${marked ? 'normal' : 'primary'}`}
              >
                To Be Marked
              </Button>
            </div>
            <div className='btn-mark-switch'>
              <Button
                loading={loadingImages || loadingVideos}
                onClick={() => setMarked(true)}
                variant={`${marked ? 'primary' : 'normal'}`}
              >
                Already Marked
              </Button>
            </div>
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

export default withAuthenticator(App)
