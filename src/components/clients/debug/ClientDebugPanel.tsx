import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { useAuth } from '../../../contexts/AuthContext';
import { testFirebaseConnection, loadClientsFromFirestore } from '../store/firebase/firebaseUtils';
import { createSampleClient, createMultipleSampleClients } from '../utils/createSampleClient';
import { useClientStore } from '../hooks/useClientStore';
import { Loader2, Database, Users, Plus, RefreshCw, Bug } from 'lucide-react';

const ClientDebugPanel: React.FC = () => {
  const { user } = useAuth();
  const { clients } = useClientStore();
  const [isLoading, setIsLoading] = useState(false);
  const [debugResults, setDebugResults] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugResults(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testFirebaseConnectivity = async () => {
    setIsLoading(true);
    addDebugLog("🔍 Testing Firebase connection...");
    
    try {
      const connectionOk = await testFirebaseConnection();
      if (connectionOk) {
        addDebugLog("✅ Firebase connection successful");
      } else {
        addDebugLog("❌ Firebase connection failed");
      }
    } catch (error) {
      addDebugLog(`❌ Firebase connection error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const loadAndAnalyzeClients = async () => {
    if (!user?.id) {
      addDebugLog("❌ No user ID available");
      return;
    }

    setIsLoading(true);
    addDebugLog(`🔍 Loading clients for user: ${user.id}`);
    
    try {
      const firestoreClients = await loadClientsFromFirestore(user.id);
      addDebugLog(`📊 Found ${firestoreClients.length} clients in Firestore`);
      
      firestoreClients.forEach(client => {
        addDebugLog(`📝 Client: ${client.name} (ID: ${client.id}, Stage: ${client.birthStage || 'NOT SET'})`);
      });

      addDebugLog(`🏪 Current store has ${clients.length} clients`);
      
      const targetClient = firestoreClients.find(c => c.id === 'client-f33ee714-4e52-4683-a754-34fd1aa3f9de');
      if (targetClient) {
        addDebugLog(`🎯 Target client found: ${targetClient.name}`);
      } else {
        addDebugLog(`⚠️ Target client 'client-f33ee714-4e52-4683-a754-34fd1aa3f9de' not found`);
      }
      
    } catch (error) {
      addDebugLog(`❌ Error loading clients: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const createSampleClientData = async () => {
    if (!user?.id) {
      addDebugLog("❌ No user ID available");
      return;
    }

    setIsLoading(true);
    addDebugLog("📝 Creating sample client...");
    
    try {
      const sampleClient = await createSampleClient(user.id);
      addDebugLog(`✅ Sample client created: ${sampleClient.name} (ID: ${sampleClient.id})`);
      addDebugLog("🔄 Refreshing page to load new data...");
      
      // Refresh the page to reload data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      addDebugLog(`❌ Error creating sample client: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const createMultipleClients = async () => {
    if (!user?.id) {
      addDebugLog("❌ No user ID available");
      return;
    }

    setIsLoading(true);
    addDebugLog("📝 Creating multiple sample clients...");
    
    try {
      const sampleClients = await createMultipleSampleClients(user.id);
      addDebugLog(`✅ Created ${sampleClients.length} sample clients`);
      sampleClients.forEach(client => {
        addDebugLog(`   - ${client.name} (${client.birthStage})`);
      });
      addDebugLog("🔄 Refreshing page to load new data...");
      
      // Refresh the page to reload data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      addDebugLog(`❌ Error creating sample clients: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const clearDebugLogs = () => {
    setDebugResults([]);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsExpanded(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="p-4 bg-white border-2 border-red-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-red-700 flex items-center">
            <Bug className="h-4 w-4 mr-2" />
            Client Debug Panel
          </h3>
          <Button 
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
          >
            ✕
          </Button>
        </div>

        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-sm">
            <strong>User:</strong> {user?.email || 'Not logged in'}<br/>
            <strong>User ID:</strong> {user?.id || 'N/A'}<br/>
            <strong>Clients in store:</strong> {clients.length}
          </AlertDescription>
        </Alert>

        <div className="space-y-2 mb-4">
          <Button 
            onClick={testFirebaseConnectivity}
            disabled={isLoading}
            size="sm"
            className="w-full"
          >
            <Database className="h-4 w-4 mr-2" />
            Test Firebase Connection
          </Button>
          
          <Button 
            onClick={loadAndAnalyzeClients}
            disabled={isLoading}
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze Current Data
          </Button>
          
          <Button 
            onClick={createSampleClientData}
            disabled={isLoading}
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Sample Client
          </Button>
          
          <Button 
            onClick={createMultipleClients}
            disabled={isLoading}
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Create Multiple Clients
          </Button>
        </div>

        {debugResults.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Debug Log:</h4>
              <Button 
                onClick={clearDebugLogs}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="bg-black text-green-400 p-2 rounded text-xs max-h-48 overflow-y-auto font-mono">
              {debugResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Processing...</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientDebugPanel;