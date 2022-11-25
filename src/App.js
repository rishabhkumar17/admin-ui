import React from 'react';
import './App.css';
import Users from './components/Users';

export const config = {
  endpoint: `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,
};

function App() {
  return (
    <React.Fragment>
      <Users />
    </React.Fragment>
  );
}

export default App;
