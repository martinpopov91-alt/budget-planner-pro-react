import React, { useState, useEffect } from 'react';

function SyncModal({ isOpen, onClose, onSaveKeys, onPush, onPull, lastSyncTime }) {
  const [token, setToken] = useState('');
  const [gistId, setGistId] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Load existing keys when modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('gh_creds') || '{}');
      setToken(saved.token || '');
      setGistId(saved.gistId || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    onSaveKeys(token, gistId);
    alert("Keys Saved to Browser!");
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '12px',
        width: '90%', maxWidth: '500px', border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
           <h2 style={{margin:0, color:'white'}}>☁️ Cloud Sync (GitHub)</h2>
           <button onClick={onClose} style={{background:'none', border:'none', color:'#888', fontSize:'1.5em', cursor:'pointer'}}>&times;</button>
        </div>

        {/* HELP SECTION */}
        <div style={{background:'#2a2a2a', padding:'10px', borderRadius:'6px', marginBottom:'20px', fontSize:'0.85em', color:'#aaa'}}>
           <div style={{display:'flex', justifyContent:'space-between', cursor:'pointer'}} onClick={() => setShowHelp(!showHelp)}>
              <strong>How do I get these keys?</strong>
              <span>{showHelp ? '▲' : '▼'}</span>
           </div>
           {showHelp && (
             <ol style={{paddingLeft:'20px', marginTop:'10px'}}>
               <li>Go to <strong>github.com/settings/tokens</strong> (Generate New Token).</li>
               <li>Select scope: <strong>"gist"</strong>. Copy the token.</li>
               <li>Go to <strong>gist.github.com</strong> and create a secret gist named "budget.json".</li>
               <li>Copy the ID from the URL (the long code at the end).</li>
             </ol>
           )}
        </div>

        {/* INPUTS */}
        <div style={{marginBottom:'15px'}}>
          <label style={{display:'block', color:'#888', marginBottom:'5px', fontSize:'0.9em'}}>GitHub Token (PAT)</label>
          <input 
            type="password" 
            value={token} 
            onChange={e => setToken(e.target.value)} 
            placeholder="ghp_..."
            style={{width:'100%', padding:'10px', background:'#333', border:'1px solid #555', color:'white', borderRadius:'4px'}}
          />
        </div>

        <div style={{marginBottom:'20px'}}>
          <label style={{display:'block', color:'#888', marginBottom:'5px', fontSize:'0.9em'}}>Gist ID</label>
          <input 
            type="text" 
            value={gistId} 
            onChange={e => setGistId(e.target.value)} 
            placeholder="e.g. 8f44a..."
            style={{width:'100%', padding:'10px', background:'#333', border:'1px solid #555', color:'white', borderRadius:'4px'}}
          />
        </div>

        {/* ACTIONS */}
        <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
           <button className="btn" onClick={handleSave} style={{flex:1, background:'#444'}}>💾 Save Keys</button>
        </div>

        <div style={{borderTop:'1px solid #333', paddingTop:'20px', display:'flex', gap:'15px'}}>
           <button className="btn" onClick={onPush} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
             ⬆️ Push Data
           </button>
           <button className="btn" onClick={onPull} style={{flex:1, backgroundColor:'var(--accent-green)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
             ⬇️ Pull Data
           </button>
        </div>

        {lastSyncTime && (
          <div style={{textAlign:'center', marginTop:'15px', color:'#666', fontSize:'0.8em'}}>
            Last Action: {lastSyncTime}
          </div>
        )}

      </div>
    </div>
  );
}

export default SyncModal;