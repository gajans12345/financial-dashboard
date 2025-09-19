import React, { useEffect, useState } from 'react';

export function FlowChart({ company, height = 300 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/flow/${encodeURIComponent(company)}`);
        if (!res.ok) throw new Error('Failed fetching flow data');
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
    return <div style={{ padding: '12px', color: '#666' }}>Loading cash flow data…</div>;
  }

  if (error) {
    return <div style={{ padding: '12px', color: '#d32f2f' }}>Failed to load chart: {error}</div>;
  }

  if (!data.length) {
    return <div style={{ padding: '12px', color: '#666' }}>No cash flow data available.</div>;
  }

  const width = 800;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const barGroupWidth = innerWidth / data.length * 0.8;
  const barWidth = barGroupWidth / 2.5; // Two bars side by side with spacing
  const barSpacing = innerWidth / data.length;

  // Calculate max value for scaling (using absolute values)
  const allValues = data.flatMap(d => [Math.abs(d.freeCashFlow), Math.abs(d.capitalExpenditure)]);
  const maxValue = Math.max(...allValues);
  
  const scale = (value) => {
    const normalizedValue = Math.abs(value) / maxValue;
    return normalizedValue * innerHeight;
  };

  const formatCurrency = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000000) {
      return `$${(absValue / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
      return `$${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `$${(absValue / 1000).toFixed(1)}K`;
    } else {
      return `$${absValue.toFixed(0)}`;
    }
  };

  const colors = {
    freeCashFlow: '#2ecc71', // Green for positive cash flow
    capitalExpenditure: '#e74c3c' // Red for expenditure
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
          💰
        </div>
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.6rem', 
          color: '#2c3e50',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          {company} Cash Flow vs Capital Expenditure
        </h3>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: colors.freeCashFlow,
            borderRadius: '3px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
          <span style={{ fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>
            Free Cash Flow
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: colors.capitalExpenditure,
            borderRadius: '3px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
          <span style={{ fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>
            Capital Expenditure
          </span>
        </div>
      </div>
      
      <div style={{ 
        overflowX: 'auto', 
        padding: '16px 0',
        backgroundColor: '#fafbfc',
        borderRadius: '8px',
        border: '1px solid #f0f0f0'
      }}>
        <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
          {/* Y-axis */}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerHeight} stroke="#d1d5db" strokeWidth="2" />
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const value = maxValue * ratio;
            const y = paddingTop + innerHeight - (ratio * innerHeight);
            return (
              <g key={idx}>
                <line x1={paddingLeft} y1={y} x2={paddingLeft + innerWidth} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#6b7280" fontWeight="600">
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((yearData, yearIdx) => {
            const groupX = paddingLeft + (yearIdx * barSpacing) + (barSpacing - barGroupWidth) / 2;
            
            // Free Cash Flow bar (always positive)
            const freeCashFlowHeight = scale(Math.abs(yearData.freeCashFlow));
            const freeCashFlowY = paddingTop + innerHeight - freeCashFlowHeight;
            const freeCashFlowX = groupX;
            
            // Capital Expenditure bar (always positive)
            const capExHeight = scale(Math.abs(yearData.capitalExpenditure));
            const capExY = paddingTop + innerHeight - capExHeight;
            const capExX = groupX + barWidth + 5; // Small gap between bars
            
            return (
              <g key={yearData.year}>
                {/* Free Cash Flow bar */}
                <rect
                  x={freeCashFlowX}
                  y={freeCashFlowY}
                  width={barWidth}
                  height={freeCashFlowHeight}
                  fill={colors.freeCashFlow}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.9"
                  filter="drop-shadow(0 2px 4px rgba(46, 204, 113, 0.3))"
                />
                
                {/* Capital Expenditure bar */}
                <rect
                  x={capExX}
                  y={capExY}
                  width={barWidth}
                  height={capExHeight}
                  fill={colors.capitalExpenditure}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.9"
                  filter="drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3))"
                />

                {/* Year label */}
                <text 
                  x={groupX + barGroupWidth / 2} 
                  y={paddingTop + innerHeight + 20} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#6b7280" 
                  fontWeight="600"
                >
                  {yearData.year}
                </text>

                {/* Value labels on bars */}
                <text 
                  x={freeCashFlowX + barWidth / 2} 
                  y={freeCashFlowY - 5} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#2c3e50" 
                  fontWeight="600"
                >
                  {formatCurrency(Math.abs(yearData.freeCashFlow))}
                </text>
                
                <text 
                  x={capExX + barWidth / 2} 
                  y={capExY - 5} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#2c3e50" 
                  fontWeight="600"
                >
                  {formatCurrency(Math.abs(yearData.capitalExpenditure))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center', 
        fontSize: '0.95rem', 
        color: '#6b7280',
        fontWeight: '500',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <span>📅</span>
        <span>Cash flow analysis from {Math.min(...data.map(d => d.year))} to {Math.max(...data.map(d => d.year))}</span>
        <span>•</span>
        <span>Green bars: Free Cash Flow (absolute values)</span>
        <span>•</span>
        <span>Red bars: Capital Expenditure (absolute values)</span>
      </div>
    </div>
  );
}

export default FlowChart;
