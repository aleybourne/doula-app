
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "app.lovable.2faf8997ab00482fa5d99b3238ceda15",
  appName: "doula-app",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    url: "https://2faf8997-ab00-482f-a5d9-9b3238ceda15.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
