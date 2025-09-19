import React, { useEffect, useState } from 'react';

export function PriceChart({ company, height = 260 }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchSeries() {
      try {
        const res = await fetch(`http://localhost:5000/prices/${encodeURIComponent(company)}`);
        if (!res.ok) throw new Error('Failed fetching prices');
        const data = await res.json();
        if (isMounted) setSeries(data);
      } catch (e) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSeries();
    return () => { isMounted = false; };
  }, [company]);

  if (loading) {
    return <div style={{ padding: '12px', color: '#666' }}>Loading price chart…</div>;
  }

  if (error) {
    return <div style={{ padding: '12px', color: '#d32f2f' }}>Failed to load chart: {error}</div>;
  }

  if (!series.length) {
    return <div style={{ padding: '12px', color: '#666' }}>No price data.</div>;
  }

  const width = 800;
  const paddingLeft = 50;
  const paddingRight = 16;
  const paddingTop = 10;
  const paddingBottom = 30;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const years = series.map(p => Number(p.year));
  const prices = series.map(p => Number(p.price));

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const minPrice = 0; // Always start from 0
  const maxPrice = Math.max(...prices) * 1.1; // Add 10% padding at top

  const xScale = y => {
    if (maxYear === minYear) return paddingLeft + innerWidth / 2;
    return paddingLeft + ((y - minYear) / (maxYear - minYear)) * innerWidth;
  };
  const yScale = p => {
    if (maxPrice === minPrice) return paddingTop + innerHeight / 2;
    return paddingTop + (1 - (p - minPrice) / (maxPrice - minPrice)) * innerHeight;
  };

  const linePath = series
    .sort((a, b) => Number(a.year) - Number(b.year))
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(Number(p.year))} ${yScale(Number(p.price))}`)
    .join(' ');

  const xTicks = Array.from(new Set(years)).sort((a, b) => a - b);
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => minPrice + (i * (maxPrice - minPrice)) / yTicksCount);

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
          📈
        </div>
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.6rem', 
          color: '#2c3e50',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          {company} Stock Price Trend
        </h3>
      </div>
      
      <div style={{ 
        overflowX: 'auto', 
        padding: '16px 0',
        backgroundColor: '#fafbfc',
        borderRadius: '8px',
        border: '1px solid #f0f0f0'
      }}>
        <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
          {/* Background gradient */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1976d2" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#1976d2" stopOpacity="0.02"/>
            </linearGradient>
          </defs>
          
          {/* Area under the curve */}
          <path d={`${linePath} L ${xScale(maxYear)} ${paddingTop + innerHeight} L ${xScale(minYear)} ${paddingTop + innerHeight} Z`} 
                fill="url(#chartGradient)" />
          
          {/* Main grid lines */}
          <g>
            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerHeight} stroke="#d1d5db" strokeWidth="2" />
            <line x1={paddingLeft} y1={paddingTop + innerHeight} x2={paddingLeft + innerWidth} y2={paddingTop + innerHeight} stroke="#d1d5db" strokeWidth="2" />
          </g>

          {/* Y-axis grid lines */}
          {yTicks.map((t, idx) => (
            <g key={`y-${idx}`}>
              <line x1={paddingLeft} y1={yScale(t)} x2={paddingLeft + innerWidth} y2={yScale(t)} 
                    stroke={t === 0 ? "#e5e7eb" : "#f3f4f6"} strokeWidth="1" />
              <text x={paddingLeft - 16} y={yScale(t)} textAnchor="end" dominantBaseline="middle" 
                    fontSize="12" fill="#6b7280" fontWeight="600">
                ${t.toFixed(0)}
              </text>
            </g>
          ))}

          {/* X-axis grid lines */}
          {xTicks.map((t, idx) => (
            <g key={`x-${idx}`}>
              <line x1={xScale(t)} y1={paddingTop} x2={xScale(t)} y2={paddingTop + innerHeight} 
                    stroke="#f9fafb" strokeWidth="1" />
              <text x={xScale(t)} y={paddingTop + innerHeight + 22} textAnchor="middle" 
                    fontSize="12" fill="#6b7280" fontWeight="600">
                {t}
              </text>
            </g>
          ))}

          {/* Price line */}
          <path d={linePath} fill="none" stroke="#1976d2" strokeWidth="4" 
                strokeLinecap="round" strokeLinejoin="round" 
                filter="drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))" />

          {/* Data points */}
          {series.map((p, i) => (
            <g key={i}>
              <circle cx={xScale(Number(p.year))} cy={yScale(Number(p.price))} r={5} 
                      fill="#1976d2" stroke="#fff" strokeWidth="3" 
                      filter="drop-shadow(0 2px 4px rgba(25, 118, 210, 0.4))" />
              <circle cx={xScale(Number(p.year))} cy={yScale(Number(p.price))} r={8} 
                      fill="none" stroke="#1976d2" strokeWidth="1" opacity="0.2" />
            </g>
          ))}
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
        gap: '8px'
      }}>
        <span>📅</span>
        <span>Historical stock prices from {minYear} to {maxYear}</span>
        <span>•</span>
        <span>Price range: ${Math.min(...prices).toFixed(2)} - ${Math.max(...prices).toFixed(2)}</span>
      </div>
    </div>
  );
}

export default PriceChart;


