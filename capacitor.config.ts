import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d456b81ef9914f068fce1b4b23dedca0',
  appName: 'Cosmic Astrology AI',
  webDir: 'dist',
  server: {
    url: 'https://d456b81e-f991-4f06-8fce-1b4b23dedca0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
