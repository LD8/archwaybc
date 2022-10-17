import { Authenticator, Image, View } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import config from './aws-exports'
import './index.css'
import reportWebVitals from './reportWebVitals'

Amplify.configure(config)

const components = {
  Header() {
    return (
      <View textAlign='center'>
        <Image
          alt='Amplify logo'
          src='https://docs.amplify.aws/assets/logo-dark.svg'
        />
      </View>
    )
  },
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Authenticator components={components}>
      {(props) => <App {...props} />}
    </Authenticator>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
