import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(selectedRole = 'aluno') {
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1069299101382-behgamrme4isdtaehm907m5g0sq5077f.apps.googleusercontent.com',
    androidClientId: '1069299101382-gu6chokrstihd2ou8hihg382fm2c9kfb.apps.googleusercontent.com',
    iosClientId: '1069299101382-gato9b5ej9larq0pq3b83efb5h21vtbk.apps.googleusercontent.com',
    webClientId: '1069299101382-behgamrme4isdtaehm907m5g0sq5077f.apps.googleusercontent.com',
  
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type !== 'success') return;

      setLoading(true);
      setError(null);

      try {
        const { id_token } = response.authentication;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email,
            role: selectedRole,
            createdAt: new Date(),
            provider: 'google',
          });
          setUserRole(selectedRole);
        } else {
          const data = userSnap.data();
          setUserRole(data.role);
        }

      } catch (err) {
        console.error('Erro no login com Google:', err.message);
        setError('Erro ao autenticar com Google.');
      } finally {
        setLoading(false);
      }
    };

    handleSignIn();
  }, [response]);

  return {
    promptAsync,
    loading,
    error,
    userRole,
  };
}
