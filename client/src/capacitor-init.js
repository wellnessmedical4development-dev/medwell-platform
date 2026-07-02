import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

const isNative = Capacitor.isNativePlatform();

if (isNative) {
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#2C2A29' });
  setTimeout(() => SplashScreen.hide(), 500);
}

export { isNative };
