import React from 'react';
import { SiTesla } from "react-icons/si";
import {MicrosoftMain} from './Microsoft';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function SidebarButton({ isActive, onClick, tabId, children }) {
  return (
    <button
    // This calls onClick when button was clicked
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
  // Active Tab is a state variable, tracking current tab
  // SetActiveTab is a function that updates the activeTab value
  const [activeTab, setActiveTab] = React.useState('tfsa'); // TFSA is default

  const [clicked, updateClicked] = React.useState(false);


  function getMainContent() {
    // Return correct tab, based on what is clicked
    if (activeTab === 'tfsa') return <TFSAContent />;
    if (activeTab === 'resp') return <RESPContent />;
    return <StockContent stock={activeTab} />;
    
  }

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
        <button
            style={{
              backgroundColor: "#1e1e2f", // Match sidebar background
              color: "#ccc", // Match sidebar text color
              padding: "10px 15px", // Adjust padding for better alignment
              border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border to define button
              borderRadius: "5px", // Rounded corners for a polished look
              cursor: "pointer", // Add pointer cursor
              width: "30%", // Make it stretch to fit the sidebar width
              textAlign: "left", // Align text/icon to the left
              display: "flex", // Use flexbox for alignment
              alignItems: "center", // Center text and icons vertically
              gap: "10px", // Add space between icon and text if needed
              transition: "background-color 0.3s ease", // Smooth hover transition
            }}
            onClick={() => {
              updateClicked(!clicked);
              
            }}
          >
            {clicked ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
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