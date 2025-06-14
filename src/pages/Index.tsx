
import React, { useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import VersionManagement from '../components/VersionManagement';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

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

  const renderNavigation = () => {
    if (currentView === 'login') return null;

    return (
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">IT Services Portal</h1>
                </div>
              </div>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Button
                      variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                      onClick={handleBackToDashboard}
                      className="font-medium"
                    >
                      My Deals
                    </Button>
                  </NavigationMenuItem>
                  {selectedDealId && (
                    <NavigationMenuItem>
                      <Button
                        variant={currentView === 'version-management' ? 'default' : 'ghost'}
                        className="font-medium"
                      >
                        Scenario Builder
                      </Button>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="min-h-screen bg-gray-50">
        {renderNavigation()}
        {renderCurrentView()}
      </div>
    </AuthProvider>
  );
};

export default Index;
