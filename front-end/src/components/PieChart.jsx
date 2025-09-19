import React, { useEffect, useState } from 'react';

export function CurrentAssetsPieChart({ company, size = 300 }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/curr/${encodeURIComponent(company)}`);
        if (!res.ok) throw new Error('Failed fetching current assets data');
        const result = await res.json();
        if (isMounted) setData(result);
      } catch (e) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [company]);

  if (loading) {
    return <div style={{ padding: '12px', color: '#666' }}>Loading current assets…</div>;
  }

  if (error) {
    return <div style={{ padding: '12px', color: '#d32f2f' }}>Failed to load chart: {error}</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <div style={{ padding: '12px', color: '#666' }}>No current assets data available.</div>;
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  const categories = [
    { key: 'shortTerm', label: 'Short Term', color: '#e74c3c' },
    { key: 'receivables', label: 'Receivables', color: '#3498db' },
    { key: 'inventory', label: 'Inventory', color: '#2ecc71' },
    { key: 'hedgingAssetsCurrently', label: 'Hedging Assets', color: '#f39c12' },
    { key: 'otherCurrentAssets', label: 'Other Current', color: '#9b59b6' }
  ];

  // Calculate total and percentages
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const segments = categories.map(cat => ({
    ...cat,
    value: data[cat.key],
    percentage: (data[cat.key] / total) * 100
  })).filter(seg => seg.value > 0);

  // Calculate angles for pie segments
  let currentAngle = -Math.PI / 2; // Start from top
  const segmentsWithAngles = segments.map(segment => {
    const angle = (segment.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...segment,
      startAngle,
      endAngle,
      angle
    };
  });

  const formatCurrency = (value) => {
    return `$${value.toFixed(1)}B`;
  };

  return (
    <div style={{ 
      width: '100%', 
      marginTop: '40px',
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e8e8e8',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ 
          fontSize: '2rem', 
          marginRight: '12px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}>
          🥧
        </div>
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.6rem', 
          color: '#2c3e50',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          {company} Current Assets
        </h3>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0'
      }}>
        <svg width={size} height={size} style={{ display: 'block' }}>
          {/* Pie segments */}
          {segmentsWithAngles.map((segment, index) => {
            const startX = centerX + radius * Math.cos(segment.startAngle);
            const startY = centerY + radius * Math.sin(segment.startAngle);
            const endX = centerX + radius * Math.cos(segment.endAngle);
            const endY = centerY + radius * Math.sin(segment.endAngle);
            
            const largeArcFlag = segment.angle > Math.PI ? 1 : 0;
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
              />
            );
          })}

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.3}
            fill="#fff"
            stroke="#e0e0e0"
            strokeWidth="2"
          />

          {/* Total value in center */}
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="700"
            fill="#2c3e50"
          >
            Total
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
            fill="#1976d2"
          >
            {formatCurrency(total)}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px',
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {segments.map((segment, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: segment.color,
                borderRadius: '2px'
              }} />
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e50' }}>
                {segment.label}:
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1976d2' }}>
                {formatCurrency(segment.value)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NonCurrentAssetsPieChart({ company, size = 300 }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/noncurr/${encodeURIComponent(company)}`);
        if (!res.ok) throw new Error('Failed fetching non-current assets data');
        const result = await res.json();
        if (isMounted) setData(result);
      } catch (e) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [company]);

  if (loading) {
    return <div style={{ padding: '12px', color: '#666' }}>Loading non-current assets…</div>;
  }

  if (error) {
    return <div style={{ padding: '12px', color: '#d32f2f' }}>Failed to load chart: {error}</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <div style={{ padding: '12px', color: '#666' }}>No non-current assets data available.</div>;
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  const categories = [
    { key: 'ppe', label: 'PPE', color: '#e74c3c' },
    { key: 'intangibles', label: 'Intangibles', color: '#3498db' },
    { key: 'investments', label: 'Investments', color: '#2ecc71' },
    { key: 'otherNonCurrentAssets', label: 'Other Non-Current', color: '#f39c12' }
  ];

  // Calculate total and percentages
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const segments = categories.map(cat => ({
    ...cat,
    value: data[cat.key],
    percentage: (data[cat.key] / total) * 100
  })).filter(seg => seg.value > 0);

  // Calculate angles for pie segments
  let currentAngle = -Math.PI / 2; // Start from top
  const segmentsWithAngles = segments.map(segment => {
    const angle = (segment.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...segment,
      startAngle,
      endAngle,
      angle
    };
  });

  const formatCurrency = (value) => {
    return `$${value.toFixed(1)}B`;
  };

  return (
    <div style={{ 
      width: '100%', 
      marginTop: '40px',
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e8e8e8',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ 
          fontSize: '2rem', 
          marginRight: '12px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}>
          🍰
        </div>
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.6rem', 
          color: '#2c3e50',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          {company} Non-Current Assets
        </h3>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0'
      }}>
        <svg width={size} height={size} style={{ display: 'block' }}>
          {/* Pie segments */}
          {segmentsWithAngles.map((segment, index) => {
            const startX = centerX + radius * Math.cos(segment.startAngle);
            const startY = centerY + radius * Math.sin(segment.startAngle);
            const endX = centerX + radius * Math.cos(segment.endAngle);
            const endY = centerY + radius * Math.sin(segment.endAngle);
            
            const largeArcFlag = segment.angle > Math.PI ? 1 : 0;
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
              />
            );
          })}

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.3}
            fill="#fff"
            stroke="#e0e0e0"
            strokeWidth="2"
          />

          {/* Total value in center */}
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="700"
            fill="#2c3e50"
          >
            Total
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
            fill="#1976d2"
          >
            {formatCurrency(total)}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px',
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {segments.map((segment, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: segment.color,
                borderRadius: '2px'
              }} />
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e50' }}>
                {segment.label}:
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1976d2' }}>
                {formatCurrency(segment.value)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default { CurrentAssetsPieChart, NonCurrentAssetsPieChart };
