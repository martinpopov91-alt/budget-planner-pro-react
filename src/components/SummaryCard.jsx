import React from 'react';

function SummaryCard({ title, value, subtitle, isPositive = true }) {
  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <div className={`big-number ${isPositive ? 'positive' : 'negative'}`}>{value}</div>
      {subtitle && <div style={{fontSize:'0.9em', color:'var(--text-muted)'}}>{subtitle}</div>}
    </div>
  );
}
export default SummaryCard;