import React, { Component } from 'react';
import { Page, AppProvider } from '@shopify/polaris';

import Main from './Main'

import ApiConsole from './components/ApiConsole'

class App extends Component {
  render() {
    const { apiKey, shopOrigin } = window;

    return (
      <AppProvider shopOrigin={shopOrigin} apiKey={apiKey}>
        <Page>
          <Main />
          {/* <ApiConsole /> */}
        </Page>
      </AppProvider>
    );
  }
}

export default App;
