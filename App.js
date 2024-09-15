
import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store/store';
import NavigationBar from './app/components/NavigationBar';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationBar/>
    </Provider>
  );
};

export default App;
