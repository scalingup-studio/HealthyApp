import React from "react";

import ChatBox from "../components/ChatBox";
import "./InsightsPage-TEST-CSS.css";

const InsightsPage = () => {
  return (
    <div className="insights-page">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content">
          <ChatBox />
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
