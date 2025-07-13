import { auth } from '@/config/firebase';

interface AuthVerificationResult {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  error?: string;
}

/**
 * Verifies that the user is fully authenticated with a valid token
 * This prevents race conditions where auth.currentUser exists but token isn't ready
 */
export const verifyAuthenticationState = async (): Promise<AuthVerificationResult> => {
  console.log("🔐 Verifying authentication state...");
  
  // Check if user exists
  if (!auth.currentUser) {
    console.log("❌ No current user found");
    return {
      isAuthenticated: false,
      userId: null,
      token: null,
      error: "No authenticated user"
    };
  }

  const userId = auth.currentUser.uid;
  console.log(`👤 Found user: ${userId}`);

  try {
    // Force refresh to ensure token is valid and up-to-date
    console.log("🔄 Getting fresh authentication token...");
    const token = await auth.currentUser.getIdToken(true);
    
    if (!token) {
      console.log("❌ Failed to get authentication token");
      return {
        isAuthenticated: false,
        userId: null,
        token: null,
        error: "Failed to get authentication token"
      };
    }

    console.log("✅ Authentication verified successfully");
    console.log(`🎫 Token length: ${token.length} characters`);
    
    return {
      isAuthenticated: true,
      userId,
      token
    };
  } catch (error) {
    console.error("❌ Error verifying authentication:", error);
    return {
      isAuthenticated: false,
      userId: null,
      token: null,
      error: `Authentication verification failed: ${error.message}`
    };
  }
};

/**
 * Waits for authentication to be ready with retry logic
 */
export const waitForAuthentication = async (maxRetries: number = 3, delayMs: number = 1000): Promise<AuthVerificationResult> => {
  console.log(`⏳ Waiting for authentication (max ${maxRetries} retries)...`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Authentication attempt ${attempt}/${maxRetries}`);
    
    const result = await verifyAuthenticationState();
    
    if (result.isAuthenticated) {
      console.log(`✅ Authentication ready on attempt ${attempt}`);
      return result;
    }
    
    if (attempt < maxRetries) {
      console.log(`⏱️ Authentication not ready, waiting ${delayMs}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log("❌ Authentication failed after all retries");
  return {
    isAuthenticated: false,
    userId: null,
    token: null,
    error: `Authentication not ready after ${maxRetries} attempts`
  };
};