import React from 'react';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        {children} {/* This will render the content of the active route */}
      </div>
    </div>
  );
};

export default Layout;
