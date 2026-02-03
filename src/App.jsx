import { useState, useEffect } from 'react'
import './App.css'
import BudgetSection from './components/BudgetSection';
import TransactionTracker from './components/TransactionTracker';
import InvestmentTracker from './components/InvestmentTracker';
import VisualReport from './components/VisualReport';
import GoalTracker from './components/GoalTracker';
import AddCategoryModal from './components/AddCategoryModal';
import SyncModal from './components/SyncModal'; // <--- IMPORT NEW COMPONENT

const formatCurrency = (num, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(num);
};

const defaultData = {
  Income: { "Salary": 0, "Freelance": 0 },
  Bills: { "Rent": 0, "Electricity": 0, "Internet": 0, "Phone": 0 },
  Expenses: { "Groceries": 0, "Dining Out": 0, "Transport": 0 },
  Savings: { "Emergency Fund": 0, "Investments": 0 },
  Debt: { "Credit Card": 0 }
};

const defaultTags = {
  "Rent": "NEED", "Electricity": "NEED", "Internet": "NEED", "Groceries": "NEED", "Phone": "NEED",
  "Dining Out": "WANT", "Entertainment": "WANT", "Transport": "NEED",
  "Emergency Fund": "SAVE", "Investments": "SAVE", "Credit Card": "DEBT"
};

function App() {
  const [activeTab, setActiveTab] = useState('budget');

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Expenses');
  
  // NEW: Sync Modal State
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [lastSync, setLastSync] = useState('');

  // --- DATA STATE ---
  const [budgetData, setBudgetData] = useState(() => JSON.parse(localStorage.getItem('budget_v6')) || defaultData);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('trans_v6')) || []);
  const [investments, setInvestments] = useState(() => JSON.parse(localStorage.getItem('invest_v6')) || []);
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('goals_v6')) || {});
  const [categoryTags, setCategoryTags] = useState(() => JSON.parse(localStorage.getItem('tags_v2')) || defaultTags);
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem('config_v1')) || {
    period: 'custom', currency: 'USD', startDate: '', endDate: '', paycheckDate: ''
  });
  const [rollover, setRollover] = useState(() => JSON.parse(localStorage.getItem('rollover_v1')) || { budget: 0, actual: 0 });

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('budget_v6', JSON.stringify(budgetData)); }, [budgetData]);
  useEffect(() => { localStorage.setItem('trans_v6', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('invest_v6', JSON.stringify(investments)); }, [investments]);
  useEffect(() => { localStorage.setItem('goals_v6', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('config_v1', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('rollover_v1', JSON.stringify(rollover)); }, [rollover]);
  useEffect(() => { localStorage.setItem('tags_v2', JSON.stringify(categoryTags)); }, [categoryTags]);

  // --- SYNC LOGIC ---
  const handleSaveKeys = (token, gistId) => {
    localStorage.setItem('gh_creds', JSON.stringify({ token, gistId }));
  };

  const getCreds = () => JSON.parse(localStorage.getItem('gh_creds') || '{}');

  const pushToGitHub = async () => {
    const { token, gistId } = getCreds();
    if (!token || !gistId) return alert("Please save your API Token and Gist ID first.");
    
    // Bundle all data
    const bundle = {
      budgetData, transactions, investments, goals, categoryTags, config, rollover,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: {
            "budget_planner.json": { content: JSON.stringify(bundle) }
          }
        })
      });
      if (res.ok) {
        setLastSync('Pushed: ' + new Date().toLocaleTimeString());
        alert("✅ Data saved to Cloud!");
      } else {
        alert("❌ Error pushing data. Check keys.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const pullFromGitHub = async () => {
    const { token, gistId } = getCreds();
    if (!token || !gistId) return alert("Please save your API Token and Gist ID first.");

    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      const data = await res.json();
      const content = JSON.parse(data.files['budget_planner.json'].content);

      // Restore Data
      if(content.budgetData) setBudgetData(content.budgetData);
      if(content.transactions) setTransactions(content.transactions);
      if(content.investments) setInvestments(content.investments);
      if(content.goals) setGoals(content.goals);
      if(content.categoryTags) setCategoryTags(content.categoryTags);
      if(content.config) setConfig(content.config);
      if(content.rollover) setRollover(content.rollover);

      setLastSync('Pulled: ' + new Date().toLocaleTimeString());
      alert("✅ Data loaded from Cloud!");
      window.location.reload(); // Refresh to ensure clean state
    } catch (error) {
      alert("❌ Error pulling data. Check keys.");
    }
  };


  // --- APP ACTIONS ---
  const handleBudgetUpdate = (type, category, value) => { const d={...budgetData}; d[type][category]=parseFloat(value)||0; setBudgetData(d); };
  const openAddCategoryModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const confirmAddCategory = (name, tag) => {
    if(!name) return;
    const d={...budgetData}; if(!d[modalType]) d[modalType]={}; d[modalType][name]=0; setBudgetData(d); 
    const t = {...categoryTags}; t[name] = tag; setCategoryTags(t);
  };
  const handleDeleteCategory = (type, cat) => { 
      if(confirm(`Delete ${cat}?`)){ 
          const d={...budgetData}; delete d[type][cat]; setBudgetData(d); 
          const t={...categoryTags}; delete t[cat]; setCategoryTags(t);
      }
  };
  const handleAddTx = (tx) => setTransactions([...transactions, tx]);
  const handleDelTx = (id) => setTransactions(transactions.filter(t => t.id !== id));
  const handleAddInv = (inv) => setInvestments([...investments, inv]);
  const handleDelInv = (id) => setInvestments(investments.filter(i => i.id !== id));
  const handleGoalUpdate = (cat, val) => { const g={...goals}; g[cat]=parseFloat(val)||0; setGoals(g); };
  const updateConfig = (field, value) => setConfig({ ...config, [field]: value });
  const updateRollover = (field, value) => setRollover({ ...rollover, [field]: parseFloat(value) || 0 });

  // --- MATH ENGINE ---
  const getActuals = (type) => {
    const actuals = {};
    Object.keys(budgetData[type]||{}).forEach(c => actuals[c]=0);
    transactions.forEach(t => { if(t.type===type && actuals[t.category]!==undefined) actuals[t.category]+=t.amount; });
    return actuals;
  }
  const getTotal = (type) => transactions.filter(t => t.type===type).reduce((s,t) => s+t.amount, 0);
  const getBudgetTotal = (type) => Object.values(budgetData[type]||{}).reduce((s,v) => s+v, 0);

  const incomeActual = getTotal('Income') + rollover.actual;
  const billsTotal = getTotal('Bills');
  const expensesTotal = getTotal('Expenses');
  const debtTotal = getTotal('Debt');
  const savingsTotal = getTotal('Savings');
  const totalSpent = billsTotal + expensesTotal + debtTotal + savingsTotal;
  const leftToSpend = incomeActual - totalSpent;

  let daysLeft = 0;
  if(config.endDate) {
    const today = new Date();
    const end = new Date(config.endDate);
    const diffTime = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    daysLeft = diffTime > 0 ? diffTime : 0;
  }
  const dailyBudget = daysLeft > 0 ? (leftToSpend / daysLeft) : 0;
  const weeklyBudget = dailyBudget * 7;
  const money = (val) => formatCurrency(val, config.currency);

  const expenseCategories = [];
  ['Bills', 'Expenses', 'Debt'].forEach(type => {
      const acts = getActuals(type);
      Object.keys(acts).forEach(cat => {
          if(acts[cat] > 0) expenseCategories.push({ name: cat, value: acts[cat] });
      });
  });
  expenseCategories.sort((a,b) => b.value - a.value);

  return (
    <div className="container">
      {/* MODALS */}
      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={confirmAddCategory} sectionType={modalType} />
      <SyncModal isOpen={isSyncOpen} onClose={() => setIsSyncOpen(false)} onSaveKeys={handleSaveKeys} onPush={pushToGitHub} onPull={pullFromGitHub} lastSyncTime={lastSync} />

      <div className="top-bar">
        <h1>Budget Planner <span style={{color:'var(--accent-orange)', fontSize:'0.5em', verticalAlign:'super'}}>PRO</span></h1>
        <div style={{display:'flex', gap:'10px'}}>
           {/* NEW SYNC BUTTON */}
           <button className="btn" style={{backgroundColor:'transparent', border:'1px solid var(--accent-blue)', color:'var(--accent-blue)'}} onClick={() => setIsSyncOpen(true)}>
             ☁️ Cloud Sync
           </button>
           <button className="btn" style={{backgroundColor:'var(--accent-red)'}} onClick={() => {if(confirm('Reset?')) localStorage.clear(); location.reload();}}>
             Reset Data
           </button>
        </div>
      </div>

      <div className="settings-bar">
        <div className="settings-group"><span className="settings-label">Period</span><select className="settings-input" value={config.period} onChange={(e) => updateConfig('period', e.target.value)}><option value="custom">Custom Range</option><option value="month">This Month</option></select></div>
        <div className="settings-group"><span className="settings-label">Currency</span><select className="settings-input" value={config.currency} onChange={(e) => updateConfig('currency', e.target.value)}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="JPY">JPY (¥)</option><option value="CAD">CAD ($)</option></select></div>
        <div className="settings-group"><span className="settings-label">Start Date</span><input type="date" className="settings-input" value={config.startDate} onChange={(e) => updateConfig('startDate', e.target.value)} /></div>
        <div className="settings-group"><span className="settings-label">End Date</span><input type="date" className="settings-input" value={config.endDate} onChange={(e) => updateConfig('endDate', e.target.value)} /></div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab==='budget'?'active':''}`} onClick={()=>setActiveTab('budget')}>📊 Budget Dashboard</button>
        <button className={`tab-btn ${activeTab==='transactions'?'active':''}`} onClick={()=>setActiveTab('transactions')}>📝 Transaction Tracker</button>
        <button className={`tab-btn ${activeTab==='investments'?'active':''}`} onClick={()=>setActiveTab('investments')}>💎 Assets</button>
      </div>

      {activeTab === 'budget' && (
        <>
          <div className="dashboard-grid">
            <div className="summary-card">
              <div className="card-title">Amount Left To Spend</div>
              <div className={`big-number ${leftToSpend>=0?'positive':'negative'}`}>{money(leftToSpend)}</div>
              <div style={{color:'var(--text-muted)', fontSize:'0.9em'}}>Income (Inc. Rollover) - Outflow</div>
              <div className="breakdown-row">
                <div className="breakdown-item"><div className="breakdown-label">Daily Budget</div><div className="breakdown-value">{money(dailyBudget)}</div></div>
                <div className="breakdown-item"><div className="breakdown-label">Weekly Budget</div><div className="breakdown-value">{money(weeklyBudget)}</div></div>
                <div className="breakdown-item"><div className="breakdown-label">Days Left</div><div className="breakdown-value" style={{color:'white'}}>{daysLeft}</div></div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-title">Cash Flow Summary</div>
              <table className="mini-table">
                <thead><tr><th>Category</th><th style={{textAlign:'right'}}>Budget</th><th style={{textAlign:'right'}}>Actual</th></tr></thead>
                <tbody>
                    <tr><td style={{color:'var(--accent-green)'}}>+ Rollover</td><td style={{textAlign:'right'}}><input className="mini-input" type="number" value={rollover.budget} onChange={e=>updateRollover('budget',e.target.value)} /></td><td style={{textAlign:'right'}}><input className="mini-input" type="number" value={rollover.actual} onChange={e=>updateRollover('actual',e.target.value)} /></td></tr>
                    <tr><td style={{color:'var(--accent-green)'}}>+ Income</td><td style={{textAlign:'right'}}>{money(getBudgetTotal('Income'))}</td><td style={{textAlign:'right'}}>{money(getTotal('Income'))}</td></tr>
                    <tr><td colSpan="3" style={{borderBottom:'1px solid #444'}}></td></tr>
                    <tr><td>- Bills</td><td style={{textAlign:'right'}}>{money(getBudgetTotal('Bills'))}</td><td style={{textAlign:'right'}}>{money(billsTotal)}</td></tr>
                    <tr><td>- Expenses</td><td style={{textAlign:'right'}}>{money(getBudgetTotal('Expenses'))}</td><td style={{textAlign:'right'}}>{money(expensesTotal)}</td></tr>
                    <tr><td>- Savings</td><td style={{textAlign:'right'}}>{money(getBudgetTotal('Savings'))}</td><td style={{textAlign:'right'}}>{money(savingsTotal)}</td></tr>
                    <tr><td>- Debt</td><td style={{textAlign:'right'}}>{money(getBudgetTotal('Debt'))}</td><td style={{textAlign:'right'}}>{money(debtTotal)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="summary-card">
              <div className="card-title">Allocation Summary</div>
              <div style={{color:'#888', fontSize:'0.8em', marginBottom:'15px'}}>Where your money goes</div>
              <div style={{overflowY:'auto', flex:1}}>
                  {expenseCategories.slice(0, 5).map((item, idx) => {
                      const percent = totalSpent > 0 ? (item.value / totalSpent) * 100 : 0;
                      return ( <div key={idx} className="alloc-row"><div className="alloc-header"><span>{item.name}</span><span>{money(item.value)}</span></div><div className="alloc-bar-bg"><div className="alloc-bar-fill" style={{width: `${percent}%`}}></div></div></div> )
                  })}
              </div>
            </div>
            <div className="summary-card" style={{padding:0, overflow:'hidden'}}><VisualReport budgetData={budgetData} actualData={getTotal} /></div>
          </div>
          <div style={{marginBottom:'20px'}}><GoalTracker savingsData={getActuals('Savings')} goals={goals} updateGoal={handleGoalUpdate} currency={config.currency} /></div>
          <div className="main-grid">
            <BudgetSection title="Income" type="Income" data={budgetData.Income} actuals={getActuals('Income')} tags={categoryTags} updateBudget={handleBudgetUpdate} addCat={openAddCategoryModal} delCat={handleDeleteCategory} currency={config.currency} />
            <BudgetSection title="Bills" type="Bills" data={budgetData.Bills} actuals={getActuals('Bills')} tags={categoryTags} updateBudget={handleBudgetUpdate} addCat={openAddCategoryModal} delCat={handleDeleteCategory} currency={config.currency} />
            <BudgetSection title="Expenses" type="Expenses" data={budgetData.Expenses} actuals={getActuals('Expenses')} tags={categoryTags} updateBudget={handleBudgetUpdate} addCat={openAddCategoryModal} delCat={handleDeleteCategory} currency={config.currency} />
            <BudgetSection title="Savings" type="Savings" data={budgetData.Savings} actuals={getActuals('Savings')} tags={categoryTags} updateBudget={handleBudgetUpdate} addCat={openAddCategoryModal} delCat={handleDeleteCategory} currency={config.currency} />
            <BudgetSection title="Debt" type="Debt" data={budgetData.Debt} actuals={getActuals('Debt')} tags={categoryTags} updateBudget={handleBudgetUpdate} addCat={openAddCategoryModal} delCat={handleDeleteCategory} currency={config.currency} />
          </div>
        </>
      )}
      {activeTab === 'transactions' && <TransactionTracker transactions={transactions} addTransaction={handleAddTx} deleteTransaction={handleDelTx} budgetData={budgetData} currency={config.currency} />}
      {activeTab === 'investments' && <InvestmentTracker investments={investments} addInvestment={handleAddInv} deleteInvestment={handleDelInv} currency={config.currency} />}
    </div>
  )
}

export default App