import React, { useState, useEffect } from 'react';

// --- MASTER CATEGORY LIST ---
// We map your list to the App's 5 Sections (Income, Bills, Expenses, Savings, Debt)
const MASTER_CATEGORIES = {
  Income: [
    { name: "Wage, invoices", tag: "NEED" },
    { name: "Sale", tag: "WANT" },
    { name: "Rental income", tag: "WANT" },
    { name: "Refunds (tax, purchase)", tag: "WANT" },
    { name: "Lottery, gambling", tag: "WANT" },
    { name: "Lending, renting", tag: "WANT" },
    { name: "Interests, dividends", tag: "WANT" },
    { name: "Gifts", tag: "WANT" },
    { name: "Dues & grants", tag: "NEED" },
    { name: "Child Support (received)", tag: "NEED" },
    { name: "Checks, coupons", tag: "WANT" }
  ],
  Bills: [
    { name: "Rent", tag: "NEED" },
    { name: "Mortgage", tag: "NEED" },
    { name: "Energy, utilities", tag: "NEED" },
    { name: "Internet", tag: "NEED" },
    { name: "Phone, cell phone", tag: "NEED" },
    { name: "Water/Gas", tag: "NEED" },
    { name: "Property insurance", tag: "NEED" },
    { name: "Maintenance, repairs", tag: "NEED" },
    { name: "Services", tag: "NEED" },
    { name: "Postal services", tag: "NEED" },
    { name: "Software, apps, games", tag: "WANT" }
  ],
  Expenses: [
    // Shopping
    { name: "Groceries", tag: "NEED" },
    { name: "Clothes & shoes", tag: "WANT" },
    { name: "Drug-store, chemist", tag: "NEED" },
    { name: "Electronics, accessories", tag: "WANT" },
    { name: "Gifts, joy", tag: "WANT" },
    { name: "Health and beauty", tag: "WANT" },
    { name: "Home, garden", tag: "WANT" },
    { name: "Jewels, accessories", tag: "WANT" },
    { name: "Kids", tag: "NEED" },
    { name: "Pets, animals", tag: "WANT" },
    { name: "Stationery, tools", tag: "WANT" },
    
    // Transportation
    { name: "Fuel", tag: "NEED" },
    { name: "Public transport", tag: "NEED" },
    { name: "Vehicle maintenance", tag: "NEED" },
    { name: "Parking", tag: "NEED" },
    { name: "Taxi", tag: "WANT" },
    { name: "Business trips", tag: "NEED" },
    { name: "Long distance", tag: "WANT" },
    
    // Life & Ent
    { name: "Active sport, fitness", tag: "WANT" },
    { name: "Coffee", tag: "WANT" },
    { name: "Books, audio, subscriptions", tag: "WANT" },
    { name: "Charity, gifts", tag: "WANT" },
    { name: "Culture, sport events", tag: "WANT" },
    { name: "Education, development", tag: "NEED" },
    { name: "Health care, doctor", tag: "NEED" },
    { name: "Hobbies", tag: "WANT" },
    { name: "Holiday, trips, hotels", tag: "WANT" },
    { name: "Lottery, gambling", tag: "WANT" },
    { name: "TV, Streaming", tag: "WANT" },
    { name: "Wellness, beauty", tag: "WANT" }
  ],
  Savings: [
    { name: "Savings", tag: "SAVE" },
    { name: "Emergency Fund", tag: "SAVE" },
    { name: "Financial investments", tag: "SAVE" },
    { name: "Realty", tag: "SAVE" },
    { name: "Vehicles, chattels", tag: "SAVE" },
    { name: "Crypto", tag: "SAVE" },
    { name: "Stock Market", tag: "SAVE" }
  ],
  Debt: [
    { name: "Loan, interests", tag: "DEBT" },
    { name: "Credit Card", tag: "DEBT" },
    { name: "Leasing", tag: "DEBT" },
    { name: "Fines", tag: "DEBT" },
    { name: "Charges, Fees", tag: "DEBT" },
    { name: "Child Support (paid)", tag: "DEBT" },
    { name: "Taxes", tag: "DEBT" },
    { name: "Collections", tag: "DEBT" }
  ]
};

function AddCategoryModal({ isOpen, onClose, onAdd, sectionType }) {
  const [mode, setMode] = useState('select'); // 'select' or 'custom'
  const [selected, setSelected] = useState('');
  const [customName, setCustomName] = useState('');
  const [customTag, setCustomTag] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if(isOpen) {
      setMode('select');
      setSelected('');
      setCustomName('');
      setCustomTag(sectionType === 'Savings' ? 'SAVE' : sectionType === 'Debt' ? 'DEBT' : 'WANT');
    }
  }, [isOpen, sectionType]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (mode === 'select') {
      if (!selected) return alert("Please select a category");
      const item = MASTER_CATEGORIES[sectionType].find(c => c.name === selected);
      onAdd(item.name, item.tag);
    } else {
      if (!customName) return alert("Please enter a name");
      onAdd(customName, customTag);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '12px',
        width: '90%', maxWidth: '400px', border: '1px solid #333', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{marginTop:0, color: 'var(--accent-blue)'}}>Add {sectionType} Category</h3>
        
        {/* RADIO TABS */}
        <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
          <button 
            onClick={() => setMode('select')}
            style={{
              flex:1, padding:'8px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold',
              backgroundColor: mode === 'select' ? 'var(--accent-blue)' : '#333',
              color: mode === 'select' ? 'white' : '#888'
            }}
          >
            Select from List
          </button>
          <button 
            onClick={() => setMode('custom')}
            style={{
              flex:1, padding:'8px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold',
              backgroundColor: mode === 'custom' ? 'var(--accent-blue)' : '#333',
              color: mode === 'custom' ? 'white' : '#888'
            }}
          >
            Custom Name
          </button>
        </div>

        {/* MODE: SELECT */}
        {mode === 'select' && (
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block', color:'#aaa', marginBottom:'8px', fontSize:'0.9em'}}>Common Categories</label>
            <select 
              value={selected} 
              onChange={(e) => setSelected(e.target.value)}
              style={{
                width: '100%', padding: '10px', backgroundColor: '#2c2c2c', 
                border: '1px solid #444', color: 'white', borderRadius: '6px'
              }}
            >
              <option value="">-- Choose One --</option>
              {MASTER_CATEGORIES[sectionType]?.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {selected && (
               <div style={{marginTop:'10px', fontSize:'0.85em', color:'#aaa'}}>
                 Auto-Tag: <span style={{color:'var(--accent-gold)', fontWeight:'bold'}}>
                   {MASTER_CATEGORIES[sectionType].find(c => c.name === selected)?.tag}
                 </span>
               </div>
            )}
          </div>
        )}

        {/* MODE: CUSTOM */}
        {mode === 'custom' && (
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block', color:'#aaa', marginBottom:'8px', fontSize:'0.9em'}}>Category Name</label>
            <input 
              type="text" 
              placeholder="e.g. Netflix" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              style={{
                width: '100%', padding: '10px', backgroundColor: '#2c2c2c', 
                border: '1px solid #444', color: 'white', borderRadius: '6px', marginBottom: '15px'
              }} 
            />
            
            <label style={{display:'block', color:'#aaa', marginBottom:'8px', fontSize:'0.9em'}}>Is this a Need or Want?</label>
            <div style={{display:'flex', gap:'5px'}}>
               {['NEED', 'WANT', 'SAVE', 'DEBT'].map(tag => (
                 <button 
                   key={tag}
                   onClick={() => setCustomTag(tag)}
                   style={{
                     flex:1, padding:'6px', fontSize:'0.8em', borderRadius:'4px', cursor:'pointer', border:'1px solid #444',
                     backgroundColor: customTag === tag ? '#444' : 'transparent',
                     color: customTag === tag ? 'var(--accent-green)' : '#888'
                   }}
                 >
                   {tag}
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
          <button onClick={handleAdd} className="btn" style={{flex:1}}>Add Category</button>
          <button onClick={onClose} style={{
             flex:1, background:'transparent', border:'1px solid #444', color:'#aaa', borderRadius:'4px', cursor:'pointer'
          }}>Cancel</button>
        </div>

      </div>
    </div>
  );
}

export default AddCategoryModal;