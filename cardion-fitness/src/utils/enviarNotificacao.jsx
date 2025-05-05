import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

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

        await fetch(`${SERVER_URL}/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: titulo,
            body: mensagem,
            token:data
        }),
        });
    };
