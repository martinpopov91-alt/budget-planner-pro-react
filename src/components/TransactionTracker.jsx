import React, { useState } from 'react';

function TransactionTracker({ transactions, addTransaction, deleteTransaction, budgetData, currency }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expenses'); 
  const [category, setCategory] = useState('');

  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(num);
  const availableCategories = budgetData[type] ? Object.keys(budgetData[type]) : [];

  const handleSubmit = () => {
    if (!desc || !amount || !category) return alert("Please fill in all fields");
    addTransaction({ id: Date.now(), date, description: desc, amount: parseFloat(amount), type, category });
    setDesc(''); setAmount('');
  };

  return (
    <div className="tracker-section">
      <div style={{borderBottom: '2px solid #333', marginBottom: '15px'}}><h3>Add Transaction</h3></div>
      <div className="input-form" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'end', marginBottom: '20px', background: '#252525', padding: '15px', borderRadius: '8px'}}>
        <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}} /></div>
        <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Type</label><select value={type} onChange={e => setType(e.target.value)} style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}}><option value="Income">Income</option><option value="Bills">Bills</option><option value="Expenses">Expenses</option><option value="Savings">Savings</option><option value="Debt">Debt</option></select></div>
        <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Category</label><select value={category} onChange={e => setCategory(e.target.value)} style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}}><option value="">Select...</option>{availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
        <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Description</label><input type="text" value={desc} onChange={e => setDesc(e.target.value)} style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}} /></div>
        <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.8em', color:'#aaa', marginBottom:'5px'}}>Amount</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{padding:'8px', background:'#333', border:'1px solid #444', color:'white', borderRadius:'4px'}} /></div>
        <button className="btn" onClick={handleSubmit} style={{height:'36px'}}>Add</button>
      </div>

      <h3>Recent History</h3>
      <div style={{maxHeight: '400px', overflowY: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9em'}}>
          <thead><tr style={{borderBottom: '1px solid #444', color: '#888'}}><th style={{textAlign:'left', padding:'8px'}}>Date</th><th style={{textAlign:'left', padding:'8px'}}>Category</th><th style={{textAlign:'left', padding:'8px'}}>Description</th><th style={{textAlign:'right', padding:'8px'}}>Amount</th><th></th></tr></thead>
          <tbody>
            {transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => (
              <tr key={t.id} style={{borderBottom: '1px solid #2a2a2a'}}>
                <td style={{padding:'10px'}}>{t.date}</td>
                <td><span style={{background:'#333', padding:'2px 6px', borderRadius:'4px', fontSize:'0.85em'}}>{t.category}</span></td>
                <td style={{color:'#ccc'}}>{t.description}</td>
                <td style={{textAlign:'right', fontWeight:'bold', color: t.type === 'Income' ? 'var(--accent-green)' : 'white'}}>{formatCurrency(t.amount)}</td>
                <td style={{textAlign:'right'}}><button onClick={() => deleteTransaction(t.id)} className="btn-delete">&times;</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTracker;