import { createSampleClient } from '@/components/clients/utils/createSampleClient';
import { loadClientsForCurrentUser } from '@/components/clients/store/clientStore';

export const createSampleClientForCurrentUser = async () => {
  const userId = '9qhlF8F1TYcuye5V8kJw2uPWl1c2';
  
  console.log('🚀 Creating sample client for user:', userId);
  
  try {
    await createSampleClient(userId);
    console.log('✅ Sample client created, refreshing store...');
    
    // Refresh the client store
    await loadClientsForCurrentUser();
    console.log('✅ Client store refreshed');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating sample client:', error);
    return false;
  }
};

// Add to window for easy testing
(window as any).createSampleClientForCurrentUser = createSampleClientForCurrentUser;