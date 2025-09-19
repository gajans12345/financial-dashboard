import React, { useEffect, useState } from 'react';

export function RadarChart({ company, size = 300 }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/ratio/${encodeURIComponent(company)}`);
        if (!res.ok) throw new Error('Failed fetching ratio data');
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
    return <div style={{ padding: '12px', color: '#666' }}>Loading financial ratios…</div>;
  }

  if (error) {
    return <div style={{ padding: '12px', color: '#d32f2f' }}>Failed to load chart: {error}</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <div style={{ padding: '12px', color: '#666' }}>No ratio data available.</div>;
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size * 0.35;

  // Define the metrics and their ranges for normalization
  const metrics = [
    { key: 'payoutRatio', label: 'Payout Ratio', max: 1.0, format: (v) => `${(v * 100).toFixed(1)}%` },
    { key: 'forwardPE', label: 'Forward P/E', max: 40, format: (v) => v.toFixed(1) },
    { key: 'trailingPE', label: 'Trailing P/E', max: 40, format: (v) => v.toFixed(1) },
    { key: 'shortRatio', label: 'Short Ratio', max: 5, format: (v) => v.toFixed(1) },
    { key: 'quickRatio', label: 'Quick Ratio', max: 3, format: (v) => v.toFixed(2) },
    { key: 'currentRatio', label: 'Current Ratio', max: 3, format: (v) => v.toFixed(2) },
    { key: 'pegRatio', label: 'PEG Ratio', max: 3, format: (v) => v.toFixed(2) }
  ];

  // Calculate points for the radar chart
  const points = metrics.map((metric, index) => {
    const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
    const normalizedValue = Math.min(data[metric.key] / metric.max, 1);
    const radius = normalizedValue * maxRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, value: data[metric.key], label: metric.label, format: metric.format };
  });

  // Create the polygon path
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

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
          🎯
        </div>
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.6rem', 
          color: '#2c3e50',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          {company} Financial Ratios
        </h3>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0'
      }}>
        <svg width={size} height={size} style={{ display: 'block' }}>
          {/* Background circles */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, index) => (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={maxRadius * ratio}
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          ))}

          {/* Grid lines */}
          {metrics.map((metric, index) => {
            const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
            const endX = centerX + maxRadius * Math.cos(angle);
            const endY = centerY + maxRadius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <path
            d={pathData}
            fill="rgba(25, 118, 210, 0.2)"
            stroke="#1976d2"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={6}
                fill="#1976d2"
                stroke="#fff"
                strokeWidth="3"
                filter="drop-shadow(0 2px 4px rgba(25, 118, 210, 0.4))"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={10}
                fill="none"
                stroke="#1976d2"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          ))}

          {/* Labels */}
          {points.map((point, index) => {
            const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
            const labelRadius = maxRadius + 30;
            const labelX = centerX + labelRadius * Math.cos(angle);
            const labelY = centerY + labelRadius * Math.sin(angle);
            
            return (
              <g key={index}>
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#2c3e50"
                  fontWeight="600"
                >
                  {point.label}
                </text>
                <text
                  x={labelX}
                  y={labelY + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fill="#1976d2"
                  fontWeight="700"
                >
                  {point.format(point.value)}
                </text>
              </g>
            );
          })}
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
        {metrics.map((metric, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e50' }}>
              {metric.label}:
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1976d2' }}>
              {metric.format(data[metric.key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadarChart;
