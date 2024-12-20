import React from 'react';
import { SiTesla } from "react-icons/si";
import {MicrosoftMain} from './Microsoft';

function SidebarButton({ isActive, onClick, tabId, children }) {
  return (
    <button
      onClick={() => onClick(tabId)}
      className={`sidebar-button ${isActive ? 'sidebar-button-active' : 'sidebar-button-inactive'}`}
    >
      {children}
    </button>
  );
}

function TFSAContent() {
  return (
    <></>
  );
}

function RESPContent() {
  return (
    <></>
  );
}

function StockContent({ stock }) {
  

  return (
    <MicrosoftMain></MicrosoftMain>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('tfsa');

  function getMainContent() {
    if (activeTab === 'tfsa') return <TFSAContent />;
    if (activeTab === 'resp') return <RESPContent />;
    return <StockContent stock={activeTab} />;
    
  }

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Finance Dashboard</h2>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Accounts</h3>
          <nav className="sidebar-nav">
            <SidebarButton 
              onClick={setActiveTab} 
              tabId="tfsa" 
              isActive={activeTab === 'tfsa'}
            >
              TFSA
            </SidebarButton>
            <SidebarButton 
              onClick={setActiveTab} 
              tabId="resp" 
              isActive={activeTab === 'resp'}
            >
              RESP
            </SidebarButton>
          </nav>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Stocks</h3>
          <nav className="sidebar-nav">
            <SidebarButton 
              onClick={setActiveTab} 
              tabId="tesla" 
              isActive={activeTab === 'tesla'}
            >
              Microsoft
            </SidebarButton>
            <SidebarButton 
              onClick={setActiveTab} 
              tabId="blackrock" 
              isActive={activeTab === 'blackrock'}
            >
              BlackRock
            </SidebarButton>
            <SidebarButton 
              onClick={setActiveTab} 
              tabId="pepsico" 
              isActive={activeTab === 'pepsico'}
            >
              PepsiCo
            </SidebarButton>
          </nav>
        </div>
      </div>

      <div className="dashboard-content">
        {getMainContent()}
      </div>
    </div>
  );
}

export default Dashboard;