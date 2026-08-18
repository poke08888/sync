import React, { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import KocAnalytics from './pages/koc/KocAnalytics';
import Settings from './pages/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'Dashboard' && <Dashboard />}
      {activeTab === 'KOC Live' && <KocAnalytics />}
      {activeTab === 'Settings' && <Settings />}
      {/* Defaults for other tabs if they were populated */}
      {activeTab !== 'Dashboard' && activeTab !== 'KOC Live' && (
        <div className="flex items-center justify-center h-full text-textMuted">
          Module {activeTab} đang được nâng cấp...
        </div>
      )}
    </DashboardLayout>
  )
}

export default App;
