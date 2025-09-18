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
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

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
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '1.5rem', 
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        📈 {company} Stock Price Trend
      </h3>
      
      <div style={{ overflowX: 'auto', padding: '10px 0' }}>
        <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
          {/* Grid lines */}
          <g>
            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerHeight} stroke="#ddd" strokeWidth="1" />
            <line x1={paddingLeft} y1={paddingTop + innerHeight} x2={paddingLeft + innerWidth} y2={paddingTop + innerHeight} stroke="#ddd" strokeWidth="1" />
          </g>

          {/* Y-axis grid lines */}
          {yTicks.map((t, idx) => (
            <g key={`y-${idx}`}>
              <line x1={paddingLeft} y1={yScale(t)} x2={paddingLeft + innerWidth} y2={yScale(t)} stroke="#f5f5f5" strokeWidth="1" />
              <text x={paddingLeft - 12} y={yScale(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#666" fontWeight="500">
                ${t.toFixed(0)}
              </text>
            </g>
          ))}

          {/* X-axis grid lines */}
          {xTicks.map((t, idx) => (
            <g key={`x-${idx}`}>
              <line x1={xScale(t)} y1={paddingTop} x2={xScale(t)} y2={paddingTop + innerHeight} stroke="#f8f8f8" strokeWidth="1" />
              <text x={xScale(t)} y={paddingTop + innerHeight + 20} textAnchor="middle" fontSize="11" fill="#666" fontWeight="500">
                {t}
              </text>
            </g>
          ))}

          {/* Price line */}
          <path d={linePath} fill="none" stroke="#1976d2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {series.map((p, i) => (
            <g key={i}>
              <circle cx={xScale(Number(p.year))} cy={yScale(Number(p.price))} r={4} fill="#1976d2" stroke="#fff" strokeWidth="2" />
              <circle cx={xScale(Number(p.year))} cy={yScale(Number(p.price))} r={6} fill="none" stroke="#1976d2" strokeWidth="1" opacity="0.3" />
            </g>
          ))}
        </svg>
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        color: '#666',
        fontStyle: 'italic'
      }}>
        Historical stock prices from {minYear} to {maxYear}
      </div>
    </div>
  );
}

export default PriceChart;


