import React from 'react';
import PatientList from './components/PatientList';
import AddPatient from './components/addPatient';
import ApolloClient from 'apollo-boost';
import {
  //ApolloProvider help react to understand apollo
  //it wrap our app and injection data from server into our app
  ApolloProvider,
} from '@apollo/client';

const client = new ApolloClient({
  //uri put endpoint(specifies the URL of our GraphQL server.)
  uri: 'http://localhost:4000/graphql',
  // cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1> Patient Name </h1>
        <PatientList />
        <AddPatient />
      </div>
    </ApolloProvider>
  );
};

export default App;
