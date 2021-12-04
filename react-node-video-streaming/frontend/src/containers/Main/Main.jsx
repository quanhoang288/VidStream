import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../Layout/Layout';
import Navbar from '../../components/Navbar/Navbar';
import Toast from '../../components/Toast/Toast';

function Main({ children }) {
  const authError = useSelector((state) => state.auth.error);
  return (
    <Layout>
      {authError && <Toast variant="error" message={authError} />}
      <Navbar />
      {children}
    </Layout>
  );
}

export default Main;
