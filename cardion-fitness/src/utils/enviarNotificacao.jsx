import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { getAuth } from 'firebase/auth';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


import { SERVER_URL } from '~/apiConfig/config';

export const enviarMensagem = async (titulo,mensagem) => {
        
        const { data } = await Notifications.getExpoPushTokenAsync();
        finalToken = data;

        const auth = getAuth();
        const user = auth.currentUser;

        const token = await user.getIdToken();

        await fetch(`${SERVER_URL}/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            title: titulo,
            body: mensagem,
            token:data
        }),
        });
    };
