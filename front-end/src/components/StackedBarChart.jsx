import React, { useEffect, useState } from 'react';

export function StackedBarChart({ company, height = 300 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/stacked/${encodeURIComponent(company)}`);
        if (!res.ok) throw new Error('Failed fetching stacked data');
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
    return <div style={{ padding: '12px', color: '#666' }}>Loading expense breakdown…</div>;
  }

  if (error) {
    return <div style={{ padding: '12px', color: '#d32f2f' }}>Failed to load chart: {error}</div>;
  }

  if (!data.length) {
    return <div style={{ padding: '12px', color: '#666' }}>No expense data available.</div>;
  }

  const width = 800;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const barWidth = innerWidth / data.length * 0.6;
  const barSpacing = innerWidth / data.length;

  // Calculate max total for THIS company's data only
  const maxTotal = Math.max(...data.map(d => d.costOfRevenue + d.operatingExpense + d.researchDevelopment + d.sga));
  
  // Use linear scaling optimized for this company's data range
  const scale = (value) => {
    if (value === 0) return 0;
    // Use linear scale with this company's max total
    const scaledHeight = (value / maxTotal) * innerHeight;
    // Ensure minimum visibility for very small values
    return Math.max(scaledHeight, 4);
  };

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const colors = {
    costOfRevenue: '#e74c3c',
    operatingExpense: '#3498db', 
    researchDevelopment: '#2ecc71',
    sga: '#f39c12'
  };

  const categories = [
    { key: 'costOfRevenue', label: 'Cost of Revenue', color: colors.costOfRevenue },
    { key: 'operatingExpense', label: 'Operating Expense', color: colors.operatingExpense },
    { key: 'researchDevelopment', label: 'R&D', color: colors.researchDevelopment },
    { key: 'sga', label: 'SGA', color: colors.sga }
  ];

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
          📊
        </div>
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.6rem', 
          color: '#2c3e50',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          {company} Expense Breakdown
        </h3>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        gap: '20px',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {categories.map(cat => (
          <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: cat.color,
              borderRadius: '3px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e50' }}>
              {cat.label}
            </span>
          </div>
        ))}
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
          
          {/* Y-axis labels with linear scale */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const value = maxTotal * ratio;
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
            const x = paddingLeft + (yearIdx * barSpacing) + (barSpacing - barWidth) / 2;
            let currentY = paddingTop + innerHeight;
            
            return (
              <g key={yearData.year}>
                {/* Cost of Revenue */}
                <rect
                  x={x}
                  y={currentY - scale(yearData.costOfRevenue)}
                  width={barWidth}
                  height={scale(yearData.costOfRevenue)}
                  fill={colors.costOfRevenue}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.9"
                />
                currentY -= scale(yearData.costOfRevenue);

                {/* Operating Expense */}
                <rect
                  x={x}
                  y={currentY - scale(yearData.operatingExpense)}
                  width={barWidth}
                  height={scale(yearData.operatingExpense)}
                  fill={colors.operatingExpense}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.9"
                />
                currentY -= scale(yearData.operatingExpense);

                {/* Research & Development */}
                <rect
                  x={x}
                  y={currentY - scale(yearData.researchDevelopment)}
                  width={barWidth}
                  height={scale(yearData.researchDevelopment)}
                  fill={colors.researchDevelopment}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.9"
                />
                currentY -= scale(yearData.researchDevelopment);

                {/* SGA */}
                <rect
                  x={x}
                  y={currentY - scale(yearData.sga)}
                  width={barWidth}
                  height={scale(yearData.sga)}
                  fill={colors.sga}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.9"
                />

                {/* Year label */}
                <text 
                  x={x + barWidth / 2} 
                  y={paddingTop + innerHeight + 20} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#6b7280" 
                  fontWeight="600"
                >
                  {yearData.year}
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
        <span>Annual expense breakdown from {Math.min(...data.map(d => d.year))} to {Math.max(...data.map(d => d.year))}</span>
        <span>•</span>
        <span>Optimized scale for {company} data</span>
        <span>•</span>
        <span>Total range: {formatCurrency(Math.min(...data.map(d => d.costOfRevenue + d.operatingExpense + d.researchDevelopment + d.sga)))} - {formatCurrency(maxTotal)}</span>
      </div>
    </div>
  );
}

export default StackedBarChart;
