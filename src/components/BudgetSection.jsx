import React from 'react';

// Formatter now runs inside the component using the prop
function BudgetSection({ title, data, actuals, tags, updateBudget, type, addCat, delCat, currency }) {
  
  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(num);

  const categories = Object.keys(data);
  const totalBud = categories.reduce((s, c) => s + Number(data[c]), 0);
  const totalAct = categories.reduce((s, c) => s + (actuals[c] || 0), 0);

  return (
    <div className="tracker-section">
      <div style={{borderBottom:'1px solid #333', marginBottom:'10px', paddingBottom:'5px'}}><h3>{title}</h3></div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th className="money-col">Budget</th>
            <th className="money-col">Actual</th>
            <th className="action-col"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => {
            const bud = Number(data[cat]);
            const act = actuals[cat] || 0;
            const tag = tags ? tags[cat] : null;
            let badgeClass = tag === 'NEED' ? 'badge-need' : tag === 'WANT' ? 'badge-want' : 'badge-save';
            
            return (
              <tr key={cat}>
                <td>{cat} {tag && <span className={`badge ${badgeClass}`}>{tag}</span>}</td>
                <td className="money-col">
                  <input type="number" className="table-input input-budget" value={bud || ''} onChange={(e) => updateBudget(type, cat, e.target.value)} placeholder="0" />
                </td>
                <td className="money-col" style={{color: (type!=='Income' && act>bud) ? 'var(--accent-red)' : '#e0e0e0'}}>
                  {act !== 0 ? formatCurrency(act) : '-'}
                </td>
                <td className="action-col">
                  <button className="btn-delete" onClick={() => delCat(type, cat)}>&times;</button>
                </td>
              </tr>
            )
          })}
          <tr style={{fontWeight:'bold', background:'#252525'}}>
            <td>TOTAL</td>
            <td className="money-col" style={{color:'var(--accent-blue)'}}>{formatCurrency(totalBud)}</td>
            <td className="money-col">{formatCurrency(totalAct)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button className="btn-add-cat" onClick={() => addCat(type)}>+ Add {title}</button>
    </div>
  );
}
export default BudgetSection;