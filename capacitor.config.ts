
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "app.lovable.2faf8997ab00482fa5d99b3238ceda15",
  appName: "Doula Care",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    url: "https://2faf8997-ab00-482f-a5d9-9b3238ceda15.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
    backgroundColor: "#ffffff",
    allowsLinkPreview: false,
    preferredContentMode: "mobile"
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
