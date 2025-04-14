import AppNavigation from '~/navigations/mainNavigation';
import Toast from 'react-native-toast-message';

import './global.css';

export default function App() {
  return (
    <>
      <AppNavigation />
      <Toast />
    </>
  );
}
