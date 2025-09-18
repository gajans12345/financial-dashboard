import React, { useState, useEffect } from 'react';
import PriceChart from './PriceChart';

export function MicrosoftMain() {
  const [keyData, setKeyData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeyData();
  }, []);

  const fetchKeyData = async () => {
    try {
      const response = await fetch('http://localhost:5000/key/Microsoft');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log("Fetched key data:", JSON.stringify(data, null, 2));
      setKeyData(data);
    } catch (error) {
      console.error('Error fetching key data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Format large numbers with commas
    if (numValue >= 1000000000) {
      return `$${(numValue / 1000000000).toFixed(1)}B`;
    } else if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}K`;
    } else {
      return `$${numValue.toFixed(2)}`;
    }
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return `${(numValue * 100).toFixed(2)}%`;
  };

  const formatRatio = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return numValue.toFixed(2);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px'
      }}>
        Loading Microsoft data...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Company Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '2.5rem', 
          color: '#333',
          fontWeight: 'bold'
        }}>
          Microsoft Corporation
        </h1>
        <p style={{ 
          margin: '0', 
          fontSize: '1.2rem', 
          color: '#666',
          fontWeight: '500'
        }}>
          MSFT
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <MetricCard 
          title="Current Price" 
          value={formatCurrency(keyData.currentprice)}
          icon="💰"
        />
        <MetricCard 
          title="Dividend Rate" 
          value={formatPercentage((keyData.dividendrate ?? 0) / 100)}
          icon="📈"
        />
        <MetricCard 
          title="Bid-Ask Spread" 
          value={formatCurrency(keyData.bidaskspread)}
          icon="📊"
        />
        <MetricCard 
          title="52-Week High" 
          value={formatCurrency(keyData.fiftytwoweekhigh)}
          icon="⬆️"
        />
        <MetricCard 
          title="52-Week Low" 
          value={formatCurrency(keyData.fiftytwoweeklow)}
          icon="⬇️"
        />
        <MetricCard 
          title="Market Cap" 
          value={formatCurrency(keyData.marketcap)}
          icon="🏢"
        />
        <MetricCard 
          title="ROE" 
          value={formatPercentage(keyData.roe)}
          icon="📋"
        />
        <MetricCard 
          title="PEG Ratio" 
          value={formatRatio(keyData.pegratio)}
          icon="⚖️"
        />
      </div>

      <PriceChart company="Microsoft" />
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
        {icon}
      </div>
      <h3 style={{ 
        margin: '0 0 10px 0', 
        fontSize: '0.9rem', 
        color: '#666',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: '0', 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        color: '#333'
      }}>
        {value}
      </p>
    </div>
  );
}