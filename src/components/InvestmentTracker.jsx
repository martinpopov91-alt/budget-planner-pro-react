import React, { useState } from 'react';

// Helper to format money
const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

function InvestmentTracker({ investments, addInvestment, deleteInvestment }) {
  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState('Buy'); // 'Buy' or 'Dividend'
  const [asset, setAsset] = useState('');
  const [platform, setPlatform] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (!asset || !amount) return alert("Asset and Amount are required");
    
    addInvestment({
      id: Date.now(),
      date,
      type,
      asset,
      platform,
      amount: parseFloat(amount)
    });

    // Reset fields
    setAsset('');
    setAmount('');
  };

  // Calculate Totals for the Top Cards
  const totalInvested = investments
    .filter(i => i.type === 'Buy')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalDividends = investments
    .filter(i => i.type === 'Dividend')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      {/* --- SUMMARY CARDS (Specific to Investments) --- */}
      <div style={{display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap'}}>
        <div className="summary-card" style={{flex: 1, minWidth: '200px'}}>
          <h3>Total Invested</h3>
          <div className="big-number positive">{formatCurrency(totalInvested)}</div>
          <div style={{color: '#888'}}>Assets Purchased</div>
        </div>
        <div className="summary-card" style={{flex: 1, minWidth: '200px'}}>
          <h3>Dividends Collected</h3>
          <div className="big-number" style={{color: 'var(--accent-gold)'}}>{formatCurrency(totalDividends)}</div>
          <div style={{color: '#888'}}>Passive Income</div>
        </div>
      </div>

      {/* --- INPUT FORM --- */}
      <div className="tracker-section">
        <div style={{borderBottom: '2px solid var(--accent-gold)', marginBottom: '15px', paddingBottom: '5px'}}>
          <h3 style={{color: 'var(--accent-gold)'}}>Log Investment Activity</h3>
        </div>

        <div className="input-form" style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px', background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #444'}}>
          
          <div style={{display:'flex', flexDirection:'column'}}>
            <label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}} />
          </div>

          <div style={{display:'flex', flexDirection:'column'}}>
            <label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Action</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}}>
              <option value="Buy">💰 Buy Asset</option>
              <option value="Dividend">💎 Dividend</option>
            </select>
          </div>

          <div style={{display:'flex', flexDirection:'column', flex: 1}}>
            <label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Asset (e.g. AAPL)</label>
            <input type="text" value={asset} onChange={e => setAsset(e.target.value)} placeholder="Ticker or Coin" style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px', width: '100%'}} />
          </div>

          <div style={{display:'flex', flexDirection:'column', flex: 1}}>
            <label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Platform</label>
            <input type="text" value={platform} onChange={e => setPlatform(e.target.value)} placeholder="e.g. Robinhood" style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px', width: '100%'}} />
          </div>

          <div style={{display:'flex', flexDirection:'column', width: '120px'}}>
            <label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px', width: '100%'}} />
          </div>

          <button className="btn" onClick={handleSubmit} style={{height: '36px', backgroundColor: 'var(--accent-gold)', color: 'black'}}>Log Entry</button>
        </div>

        {/* --- TABLE --- */}
        <h3>Asset Log</h3>
        <div style={{maxHeight: '400px', overflowY: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9em'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #444', color: '#888'}}>
                <th style={{textAlign:'left', padding:'8px'}}>Date</th>
                <th style={{textAlign:'left', padding:'8px'}}>Action</th>
                <th style={{textAlign:'left', padding:'8px'}}>Asset</th>
                <th style={{textAlign:'left', padding:'8px'}}>Platform</th>
                <th style={{textAlign:'right', padding:'8px'}}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {investments.sort((a,b) => new Date(b.date) - new Date(a.date)).map(inv => (
                <tr key={inv.id} style={{borderBottom: '1px solid #2a2a2a'}}>
                  <td style={{padding:'10px'}}>{inv.date}</td>
                  <td>
                    {/* BADGES */}
                    <span className="badge" style={{
                      backgroundColor: inv.type === 'Buy' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 215, 0, 0.15)',
                      color: inv.type === 'Buy' ? '#81c784' : '#ffd700',
                      border: inv.type === 'Buy' ? '1px solid #2e7d32' : '1px solid #ffb300'
                    }}>
                      {inv.type === 'Buy' ? '💰 BUY' : '💎 DIVIDEND'}
                    </span>
                  </td>
                  <td style={{fontWeight:'bold'}}>{inv.asset}</td>
                  <td style={{color:'#888'}}>{inv.platform}</td>
                  <td style={{textAlign:'right', fontFamily:'monospace', fontSize:'1.1em'}}>
                    {formatCurrency(inv.amount)}
                  </td>
                  <td style={{textAlign:'right'}}>
                    <button onClick={() => deleteInvestment(inv.id)} className="btn-delete" style={{background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'1.2em'}}>&times;</button>
                  </td>
                </tr>
              ))}
              {investments.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color:'#666'}}>No investments logged yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InvestmentTracker;