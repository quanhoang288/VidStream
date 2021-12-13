import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../Layout/Layout';
import Navbar from '../../components/Navbar/Navbar';
import Toast from '../../components/Toast/Toast';
import { successMessages } from '../../constants/messages';

function Main({ children }) {
  const authState = useSelector((state) => state.auth);
  return (
    <Layout>
      {authState.error && <Toast variant="error" message={authState.error} />}
      {authState.registerSuccess && (
        <Toast
          variant="success"
          message={successMessages.REGISTER_SUCCESSFUL}
        />
      )}
      <Navbar />
      {children}
    </Layout>
  );
}

export default Main;
