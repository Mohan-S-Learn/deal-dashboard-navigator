import React, { useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import VersionManagement from '../components/VersionManagement';
import DealMaster from '../components/DealMaster';
import Revenue from '../components/Revenue/Revenue';
import ResourceEfforts from '../components/ResourceEfforts/ResourceEfforts';
import DebugPanel from '../components/DebugPanel';
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

type View = 'login' | 'dashboard' | 'version-management' | 'deal-master' | 'revenue' | 'resource-efforts';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [selectedQuoteName, setSelectedQuoteName] = useState<string>('');

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleDealClick = (dealId: string) => {
    console.log('Deal clicked:', dealId);
    setSelectedDealId(dealId);
    setCurrentView('version-management');
  };

  const handleQuoteClick = (dealId: string, quoteName: string) => {
    console.log('Quote clicked:', dealId, quoteName);
    setSelectedDealId(dealId);
    setSelectedQuoteName(quoteName);
    setCurrentView('deal-master');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDealId('');
    setSelectedQuoteName('');
  };

  const handleBackToVersionManagement = () => {
    setCurrentView('version-management');
    setSelectedQuoteName('');
  };

  const handleBackToDealMaster = () => {
    setCurrentView('deal-master');
  };

  const handleNavigateToRevenue = () => {
    setCurrentView('revenue');
  };

  const handleNavigateToResourceEfforts = () => {
    setCurrentView('resource-efforts');
  };

  const renderNavigation = () => {
    if (currentView === 'login') return null;

    return (
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    IT Services Portal
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Enterprise Solutions</p>
                </div>
              </div>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Button
                      variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                      onClick={handleBackToDashboard}
                      className={`font-semibold transition-all duration-200 ${
                        currentView === 'dashboard' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      My Deals
                    </Button>
                  </NavigationMenuItem>
                  {selectedDealId && (
                    <NavigationMenuItem>
                      <Button
                        variant={currentView === 'version-management' ? 'default' : 'ghost'}
                        onClick={handleBackToVersionManagement}
                        className={`font-semibold transition-all duration-200 ${
                          currentView === 'version-management'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        Scenario Builder
                      </Button>
                    </NavigationMenuItem>
                  )}
                  {selectedQuoteName && (
                    <>
                      <NavigationMenuItem>
                        <Button
                          variant={currentView === 'deal-master' ? 'default' : 'ghost'}
                          onClick={handleBackToDealMaster}
                          className={`font-semibold transition-all duration-200 ${
                            currentView === 'deal-master'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          Deal Master
                        </Button>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Button
                          variant={currentView === 'revenue' ? 'default' : 'ghost'}
                          onClick={handleNavigateToRevenue}
                          className={`font-semibold transition-all duration-200 ${
                            currentView === 'revenue'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          Revenue
                        </Button>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Button
                          variant={currentView === 'resource-efforts' ? 'default' : 'ghost'}
                          onClick={handleNavigateToResourceEfforts}
                          className={`font-semibold transition-all duration-200 ${
                            currentView === 'resource-efforts'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          Resource Efforts
                        </Button>
                      </NavigationMenuItem>
                    </>
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
        return (
          <>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              <DebugPanel />
            </div>
            <Dashboard onDealClick={handleDealClick} />
          </>
        );
      case 'version-management':
        return <VersionManagement dealId={selectedDealId} onBack={handleBackToDashboard} onQuoteClick={handleQuoteClick} />;
      case 'deal-master':
        return <DealMaster dealId={selectedDealId} quoteName={selectedQuoteName} onBack={handleBackToVersionManagement} />;
      case 'revenue':
        return <Revenue dealId={selectedDealId} quoteName={selectedQuoteName} onBack={handleBackToDealMaster} />;
      case 'resource-efforts':
        return <ResourceEfforts dealId={selectedDealId} quoteName={selectedQuoteName} onBack={handleBackToDealMaster} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {renderNavigation()}
        {renderCurrentView()}
      </div>
    </AuthProvider>
  );
};

export default Index;
