// CloudSync - Web Admin
// React App
// src/App.js

// Basado en:
// https://marmelab.com/react-admin/Tutorial.html
// https://aatifbandey.medium.com/test-your-react-app-with-react-testing-library-and-jest-dom-26b92201bbe3

import * as React from "react";
import { Admin } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

  const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

  const App = () => <Admin dataProvider={dataProvider} />;

  export default App;
