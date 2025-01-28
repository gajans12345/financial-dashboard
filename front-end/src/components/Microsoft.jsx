import React, { useState, useEffect } from 'react';

export function MicrosoftMain() {
  const [keyData, setKeyData] = useState({});

  useEffect(() => {
    fetchKeyData();
  }, []);

  const fetchKeyData = async () => {
    try {
      const response = await fetch('http://localhost:5000/Key');
      const data = await response.json();
      setKeyData(data);
    } catch (error) {
      console.error('Error fetching key data:', error);
    }
  };

  return (
    <div className="big">
      <div className="metrics-container">
        <div className="company-logo">
          <div className="logo-container">
            <h2>Microsoft</h2>
            <p>MSFT</p>
          </div>
        </div>
        <div className="metrics-row">
          <MetricCard title="STOCK PRICE" value={keyData.currentprice} />
          <MetricCard title="DIVIDEND RATE" value={keyData.dividendrate} />
          <MetricCard title="BID-ASK SPREAD" value={keyData.bidaskspread} />
          <MetricCard title="52 WEEK HIGH" value={keyData.fiftytwoweekhigh} />
          <MetricCard title="52 WEEK LOW" value={keyData.fiftytwoweeklow} />
          <MetricCard title="PEG RATIO" value={keyData.pegratio} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  const formatValue = (val) => {
    if (!val) return 'Loading...';
    const numValue = parseFloat(val);
    return isNaN(numValue) ? val : `$${numValue.toFixed(2)}`;
  };

  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p>{formatValue(value)}</p>
    </div>
  );
}