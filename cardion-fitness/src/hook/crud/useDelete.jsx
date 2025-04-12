// conexão Firebase
import { db, auth } from '../../firebase/firebaseConfig';

import { doc, deleteDoc } from "firebase/firestore";
import {
    getAuth, EmailAuthProvider,
    reauthenticateWithCredential,
    } from 'firebase/auth';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDelete = () =>
    {
        const auth = getAuth();
        const user = auth.currentUser;
        
        const deleteAccount = async () => {
            Alert.alert("teste");
            const role = await AsyncStorage.getItem("role")
            Alert.alert(role)
            const uid = await AsyncStorage.getItem('uid')
            Alert.alert(uid)
            
            const credential = EmailAuthProvider.credential('Z@gmail.com', '123456');
            await reauthenticateWithCredential(user, credential);
            try 
            {
                await deleteDoc(doc(db, role, uid));
                await deleteUser(user);
            } 
            catch (error) 
            {
                Alert.alert("Erro ao excluir usuário");
                Alert.alert(error);
            }
        };
        return{deleteAccount}
    }