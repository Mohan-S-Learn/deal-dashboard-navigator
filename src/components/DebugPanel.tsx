
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { syncDealsToDatabase, testDatabaseConnection } from '../services/dataSync';

const DebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testConnection = async () => {
    setLoading(true);
    addLog('Testing database connection...');
    const success = await testDatabaseConnection();
    addLog(`Database connection: ${success ? 'SUCCESS' : 'FAILED'}`);
    setLoading(false);
  };

  const testDealsQuery = async () => {
    setLoading(true);
    addLog('Testing deals query...');
    try {
      const { data, error } = await supabase
        .from('Deals')
        .select('*');
      
      if (error) {
        addLog(`Query error: ${error.message}`);
      } else {
        addLog(`Query success: Found ${data?.length || 0} deals`);
        if (data && data.length > 0) {
          addLog(`First deal: ${JSON.stringify(data[0])}`);
        }
      }
    } catch (error) {
      addLog(`Query exception: ${error}`);
    }
    setLoading(false);
  };

  const testSync = async () => {
    setLoading(true);
    addLog('Testing deal sync...');
    const success = await syncDealsToDatabase();
    addLog(`Sync result: ${success ? 'SUCCESS' : 'FAILED'}`);
    setLoading(false);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Debug Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button onClick={testConnection} disabled={loading} size="sm">
            Test Connection
          </Button>
          <Button onClick={testDealsQuery} disabled={loading} size="sm">
            Test Query
          </Button>
          <Button onClick={testSync} disabled={loading} size="sm">
            Test Sync
          </Button>
          <Button onClick={clearLogs} variant="outline" size="sm">
            Clear Logs
          </Button>
        </div>
        
        <div className="bg-gray-100 p-3 rounded text-xs max-h-40 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
