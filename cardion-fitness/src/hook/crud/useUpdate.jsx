import { doc, updateDoc } from 'firebase/firestore';
// conexão Firebase
import { db, auth } from '../../firebase/firebaseConfig';



export const useUpdate = () =>
    {
        const auth = getAuth();

        // Resumo:
        // aqui o data sera um objeto contendo ou nao as propriedades
        // exemplo const user = {nome:"americo",telefone:""}
        // imagino que assim facilite pois só precisaremos passar um parametro
        // porem devemos sempre olhar aqui pra ver se a propriedade esta sendo usada
        const updateDadosBasicos = async (data) =>{
            const role = await AsyncStorage.getItem("role")
            const uid = await AsyncStorage.getItem('uid')

            // TODO: terminar de implementar
            await updateDoc(doc(db, role, uid), {
                altura:data.altura,
                dataNac:data.dataNasc,

              });
    
            return true
        }
    
        return{updateDadosBasicos}
    }