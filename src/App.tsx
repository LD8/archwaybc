import {
  Button,
  Heading,
  TabItem,
  Tabs,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import '@cloudscape-design/global-styles/index.css'
import React from 'react'
import './App.css'
import TabPane from './components/TabPane'

const App: React.FC<{ signOut?: () => void }> = ({ signOut }) => {
  return (
    <View className='App'>
      <View
        as='nav'
        backgroundColor='1px solid var(--amplify-colors-white)'
        boxShadow='3px 3px 5px 6px var(--amplify-colors-neutral-20)'
        height='60px'
      >
        <Heading level={3} style={{ display: 'inline' }}>
          ABC Airline
        </Heading>
        <Button onClick={signOut}>Sign Out</Button>
      </View>

      <Tabs justifyContent='flex-start'>
        <TabItem title='Image Table'>
          <TabPane />
        </TabItem>
        <TabItem title='Video Table'>
          <TabPane isVideo />
        </TabItem>
      </Tabs>
    </View>
  )
}

export default withAuthenticator(App)
