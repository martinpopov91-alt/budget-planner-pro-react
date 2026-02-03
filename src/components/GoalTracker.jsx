import React, { useState } from 'react';

const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

function GoalTracker({ savingsData, goals, updateGoal }) {
  // savingsData = { "Emergency Fund": 500, "New Car": 0 }
  // goals = { "Emergency Fund": 10000, "New Car": 20000 }
  const categories = Object.keys(savingsData);

  // Local state to handle the "Edit Target" popup
  const [editingCat, setEditingCat] = useState(null);
  const [tempTarget, setTempTarget] = useState('');

  const handleEditClick = (cat) => {
    setEditingCat(cat);
    setTempTarget(goals[cat] || '');
  };

  const handleSave = () => {
    updateGoal(editingCat, tempTarget);
    setEditingCat(null);
  };

  return (
    <div className="tracker-section" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--accent-purple)' }}>Goal Progress</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        {categories.map(cat => {
          const current = savingsData[cat] || 0;
          const target = goals[cat] || 0;
          const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;

          return (
            <div key={cat} style={{ background: '#252525', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{cat}</span>
                {target > 0 ? (
                  <span style={{ color: 'var(--accent-green)' }}>{percent.toFixed(1)}%</span>
                ) : (
                  <button 
                    onClick={() => handleEditClick(cat)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8em', textDecoration: 'underline' }}
                  >
                    Set Target
                  </button>
                )}
              </div>

              {/* Progress Bar Background */}
              <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                {/* Progress Bar Fill */}
                <div style={{ 
                    height: '100%', 
                    width: `${percent}%`, 
                    background: percent === 100 ? 'var(--accent-green)' : 'var(--accent-purple)',
                    transition: 'width 0.5s ease' 
                }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', color: '#aaa' }}>
                <span>Saved: {formatCurrency(current)}</span>
                <span 
                  onClick={() => handleEditClick(cat)} 
                  style={{ cursor: 'pointer', borderBottom: '1px dotted #555' }}
                >
                  Goal: {target > 0 ? formatCurrency(target) : '-'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL (Simple overlay) */}
      {editingCat && (
        <div style={{
          position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', 
          display:'flex', alignItems:'center', justifyContent:'center', zIndex: 100
        }}>
          <div style={{background:'#1e1e1e', padding:'20px', borderRadius:'8px', width:'300px', border:'1px solid #444'}}>
            <h4>Set Goal for: {editingCat}</h4>
            <label style={{display:'block', marginBottom:'5px', color:'#aaa', fontSize:'0.9em'}}>Target Amount ($)</label>
            <input 
              type="number" 
              value={tempTarget} 
              onChange={e => setTempTarget(e.target.value)}
              autoFocus
              style={{width:'100%', padding:'10px', background:'#333', border:'1px solid #555', color:'white', marginBottom:'15px', borderRadius:'4px'}}
            />
            <div style={{display:'flex', gap:'10px'}}>
              <button className="btn" onClick={handleSave} style={{flex:1}}>Save</button>
              <button className="btn" onClick={() => setEditingCat(null)} style={{background:'transparent', border:'1px solid #555', flex:1}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalTracker;