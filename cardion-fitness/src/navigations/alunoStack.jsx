import { createStackNavigator } from '@react-navigation/stack';
import AlunoDrawer from './alunoDrawer';
import UserType from '~/screens/auth/userType';
import SignUp from '../screens/auth/signUp';
import ResetPassword from '~/screens/auth/resetPassword';
import LoginPassword from '~/screens/auth/loginPassword';
import UpdatePassword from '~/screens/auth/updatePassword';
import TreinosAluno from '~/screens/aluno/treinosAluno';
import TreinoDetalhado from '~/screens/aluno/treinoDetalhado';
import AvaliacaoFisica from '~/screens/aluno/avaliacaoFisica';
import DetalhesAvaliacaoFisica from '~/screens/aluno/detalhesAvaliacaoFisica';
import ListaDesafios from '~/screens/aluno/listaDesafios';
import RankingPontosDesafios from '~/screens/aluno/rankingPontosDesafios';
import RankingPontosGeral from '~/screens/aluno/rankingPontosGeral';


const Stack = createStackNavigator();

const AlunoNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="homeAluno"
                component={AlunoDrawer}
                options={{
                    gestureEnabled: false, // esse aqui bloqueia o deslize para voltar no iOS, ver onde aplicar
                }}
            />
            <Stack.Screen
                name="userType"
                options={{ headerShown: false }}
                component={UserType}
            />
            <Stack.Screen
                name='signUp'
                options={{ headerShown: false }}
                component={SignUp}
            />
            <Stack.Screen
                name='loginPassword'
                options={{ headerShown: false }}
                component={LoginPassword}
            />
            <Stack.Screen
                name='resetPassword'
                options={{ headerShown: false }}
                component={ResetPassword}
            />
            <Stack.Screen
                name='updatePassword'
                options={{ headerShown: false }}
                component={UpdatePassword}
            />
            <Stack.Screen
                name='TreinoAluno'
                options={{ headerShown: false }}
                component={TreinosAluno}
            />
            <Stack.Screen
                name='TreinoDetalhado'
                options={{ headerShown: false }}
                component={TreinoDetalhado}
            />
            <Stack.Screen
                name='AvaliacaoFisica'
                options={{ headerShown: false }}
                component={AvaliacaoFisica}
            />
            <Stack.Screen
                name='DetalhesAvaliacaoFisica'
                options={{ headerShown: false }}
                component={DetalhesAvaliacaoFisica}
            />
            <Stack.Screen
                name='ListaDesafios'
                options={{ headerShown: false }}
                component={ListaDesafios}
            />
            <Stack.Screen
                name='RankingPontosDesafios'
                options={{ headerShown: false }}
                component={RankingPontosDesafios}
            />
            <Stack.Screen
                name='RankingPontosGeral'
                options={{ headerShown: false }}
                component={RankingPontosGeral}
            />
        </Stack.Navigator>
    );
};

export default AlunoNavigation;