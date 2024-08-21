import React from "react";
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";

const Layout = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <TopBar />
      <Dashboard /> {/* Render the Dashboard directly */}
    </div>
  );
};

export default Layout;
