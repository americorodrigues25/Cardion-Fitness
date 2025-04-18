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
        // um detalhe muito importante é de passar todas as informacoes
        // caso uma propriedade não seja passada a entidade sera atualizada com o valor null

        const updateDadosBasicos = async (data) =>{
            const role = await AsyncStorage.getItem("role")
            const uid = await AsyncStorage.getItem('uid')
                
            // TODO: terminar de implementar
            await updateDoc(doc(db, role, uid), {
                altura:data.altura,
                dataNac:data.dataNasc,
                sexo: data.sexo,
                peso: data.peso,
                altura: data.altura,
                objetivo: data.objetivo,
                xp: data.xp,
                nivel: data.nivel,
              });
    
            return true
        }
    
        return{updateDadosBasicos}
    }