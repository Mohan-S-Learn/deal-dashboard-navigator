
import React, { useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import VersionManagement from '../components/VersionManagement';

type View = 'login' | 'dashboard' | 'version-management';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [selectedDealId, setSelectedDealId] = useState<string>('');

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
    setCurrentView('version-management');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDealId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onDealClick={handleDealClick} />;
      case 'version-management':
        return <VersionManagement dealId={selectedDealId} onBack={handleBackToDashboard} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <AuthProvider>
      {renderCurrentView()}
    </AuthProvider>
  );
};

export default Index;
