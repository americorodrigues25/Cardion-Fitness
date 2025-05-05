// // hooks/useLoginWithFacebook.js
// import { useState } from 'react';
// import * as Facebook from 'expo-facebook';
// import {
//   FacebookAuthProvider,
//   signInWithCredential
// } from 'firebase/auth';
// import {
//   getDoc,
//   doc,
//   setDoc
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';

// export function useLoginWithFacebook() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const loginWithFacebook = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       await Facebook.initializeAsync({
//         appId: 'SEU_FACEBOOK_APP_ID',
//       });

//       const { type, token } = await Facebook.logInWithReadPermissionsAsync({
//         permissions: ['public_profile', 'email'],
//       });

//       if (type === 'success' && token) {
//         const credential = FacebookAuthProvider.credential(token);
//         const result = await signInWithCredential(auth, credential);
//         const user = result.user;

//         // Verifica se já existe no Firestore
//         const userRef = doc(db, 'users', user.uid);
//         const userSnap = await getDoc(userRef);

//         if (!userSnap.exists()) {

//           await setDoc(userRef, {
//             uid: user.uid,
//             email: user.email,
//             // precisamos depois mudar a role, pra ser dinamica, mas por hora pode continuar assim
//             role: 'aluno',
//             provider: 'facebook',
//             createdAt: new Date()
//           });
//         }

//         return user;
//       } else {
//         setError('Login cancelado pelo usuário.');
//         return null;
//       }
//     } catch (err) {
//       console.error('Erro no login com Facebook:', err.message);
//       setError('Erro ao autenticar com Facebook.');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loginWithFacebook, loading, error };
// }
