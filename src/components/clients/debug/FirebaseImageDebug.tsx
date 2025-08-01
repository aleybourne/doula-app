import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { useAuth } from '../../../contexts/AuthContext';
import { loadClientsFromFirestore, saveClientToFirestore } from '../store/firebase/firebaseUtils';
import { useClientStore } from '../hooks/useClientStore';

const FirebaseImageDebug: React.FC = () => {
  const { user } = useAuth();
  const { clients } = useClientStore();
  const [debugResults, setDebugResults] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugResults(prev => [...prev, message]);
  };

  const checkFirebaseImageData = async () => {
    if (!user?.id) {
      addDebugLog("❌ No user ID available");
      return;
    }

    try {
      addDebugLog("🔍 Checking Firebase image data...");
      const firestoreClients = await loadClientsFromFirestore(user.id);
      
      addDebugLog(`📊 Found ${firestoreClients.length} clients in Firebase`);
      
      firestoreClients.forEach((client, index) => {
        addDebugLog(`${index + 1}. ${client.name}`);
        addDebugLog(`   - Image: "${client.image || 'NO IMAGE FOUND'}"`);
        addDebugLog(`   - ID: ${client.id}`);
      });

      // Compare with local store
      addDebugLog(`🏪 Local store has ${clients.length} clients`);
      clients.forEach((client, index) => {
        addDebugLog(`${index + 1}. ${client.name} - Local Image: "${client.image || 'NO IMAGE'}"`);
      });

    } catch (error) {
      addDebugLog(`❌ Error: ${error}`);
    }
  };

  const fixAustinImage = async () => {
    if (!user?.id) {
      addDebugLog("❌ No user ID available");
      return;
    }

    try {
      // Find Austin client
      const austinClient = clients.find(c => c.name.startsWith("Austin"));
      if (!austinClient) {
        addDebugLog("❌ Austin client not found");
        return;
      }

      // Add a test image URL
      const updatedClient = {
        ...austinClient,
        image: "https://firebasestorage.googleapis.com/v0/b/push-environment.appspot.com/o/client-images%2Ftest-image.jpg?alt=media"
      };

      addDebugLog(`🔧 Updating Austin client with test image...`);
      await saveClientToFirestore(updatedClient);
      addDebugLog(`✅ Updated Austin client in Firebase`);

    } catch (error) {
      addDebugLog(`❌ Error updating client: ${error}`);
    }
  };

  return (
    <Card className="p-4 m-4">
      <h3 className="text-lg font-semibold mb-4">Firebase Image Debug</h3>
      
      <div className="space-y-2 mb-4">
        <Button onClick={checkFirebaseImageData}>
          Check Firebase Image Data
        </Button>
        <Button onClick={fixAustinImage} variant="outline">
          Fix Austin Image (Test)
        </Button>
      </div>

      <div className="bg-gray-100 p-3 rounded max-h-96 overflow-y-auto">
        {debugResults.map((result, index) => (
          <div key={index} className="text-sm font-mono">
            {result}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FirebaseImageDebug;