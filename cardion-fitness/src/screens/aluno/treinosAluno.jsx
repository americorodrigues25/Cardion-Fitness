import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';

import { useGetTreino } from '~/hook/crud/treino/useGetTreino';
import { useGet } from '~/hook/crud/useGet';
import { gerarPdfTreinos } from '~/utils/gerarPdfTreinos';

import HeaderAppBack from '~/components/header/headerAppBack';

export default function TreinosAluno() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [dadosTreinos, setDadosTreinos] = useState([]);
  const [nome, setNome] = useState();
  const [nomePersonal, setNomePersonal] = useState();
  const [loadingDownload, setLoadingDownload] = useState(false);

  const { getAllTreinosByIdAluno } = useGetTreino();
  const { getById, getPersonalDoAluno } = useGet();

  // Função para buscar os treinos
  const fetchTreinos = async () => {
    try {
      setLoading(true);
      const user = getAuth().currentUser;
      if (user) {
        const idAluno = user.uid;
        const dados = await getAllTreinosByIdAluno(idAluno);
        setDadosTreinos(dados);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar treinos',
      });
    } finally {
      setLoading(false);
    }
  };

  //buscar nome do aluno
  const fetchAluno = async () => {
    try {
      const user = await getById();
      setNome(user.nome);
    } catch (error) {
      // opcional: tratar erro
    }
  };

  //buscar nome do personal
  const fetchNomePersonal = async () => {
    try {
      const personal = await getPersonalDoAluno();
      setNomePersonal(personal.nome);
    } catch (error) {
      // opcional: tratar erro
    }
  };

  // executa as funções ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchTreinos();
      fetchAluno();
      fetchNomePersonal();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-colorBackground justify-center items-center">
        <ActivityIndicator size="large" color="#6943FF" />
        <Text className="mt-4 text-base text-colorLight200">Carregando treinos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-colorBackground">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderAppBack title="Ver treinos" />

          {dadosTreinos.length === 0 ? (
            <View className="justify-center items-center px-5 pt-10">
              <Text className="text-gray-500 text-center">Nenhum treino registrado.</Text>
            </View>
          ) : (
            <>
              <View className="py-10 px-5">
                <View className="flex-row justify-between items-center">
                  <Text className="text-2xl font-bold mb-4 text-colorLight200">Meus Treinos</Text>
                  <View>
                    <Text className="text-lg font-bold text-colorLight200">Personal</Text>
                    <Text className="text-lg mb-4 text-gray-400">{nomePersonal}</Text>
                  </View>
                </View>

                {dadosTreinos.map((treino, idx) => (
                  <TouchableOpacity
                    key={treino.id || idx}
                    onPress={() => navigation.navigate('TreinoDetalhado', { treino })}
                    className="bg-colorInputs p-4 rounded-xl shadow mb-3 border-[0.2px] border-gray-600"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-colorViolet font-bold text-3xl">{treino.nome.slice(-1)}</Text>

                      <View className="flex-1 px-4">
                        <Text className="text-colorViolet font-bold">Grupos Musculares</Text>
                        <Text className="text-gray-400">{treino.tipo}</Text>
                      </View>

                      <View className="items-center self-start">
                        <Text className="text-colorViolet font-bold">{treino.dia}</Text>
                      </View>
                    </View>

                    <View className="px-5">
                      <View className="flex-row items-center mt-5 mb-2">
                        <View className="flex-row justify-center items-center">
                          <View className="bg-colorViolet p-2 rounded-full">
                            <FontAwesome5 name="dumbbell" size={15} color="#E4E4E7" />
                          </View>
                          <View className="ml-3">
                            <Text className="text-gray-400 text-lg mb-1">Sessões realizadas</Text>
                            <Text className="text-colorViolet text-2xl">
                              {treino.sessoesRealizadas?.qtd ?? 0}
                              <Text className="text-gray-400 text-base"> / {treino.sessoes ?? 0}</Text>
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Progress.Bar
                        progress={(treino.sessoesRealizadas?.qtd ?? 0) / (treino.sessoes || 1)}
                        width={null}
                        height={10}
                        color="#7c3aed"
                        unfilledColor="#e5e5e5"
                        borderWidth={0}
                        borderRadius={5}
                        animated
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="px-20 mb-10">
                <TouchableOpacity
                  disabled={loadingDownload}
                  onPress={async () => {
                    try {
                      setLoadingDownload(true);
                      await gerarPdfTreinos(dadosTreinos, nome);
                    } catch (error) {
                      Toast.show({
                        type: 'error',
                        text1: 'Erro ao gerar PDF',
                      });
                    } finally {
                      setLoadingDownload(false);
                    }
                  }}
                  className={`bg-colorViolet py-3 rounded-full ${loadingDownload ? 'opacity-60' : ''}`}
                >
                  {loadingDownload ? (
                    <ActivityIndicator size="small" color="#E4E4E7" />
                  ) : (
                    <Text className="text-colorLight200 text-center text-lg font-bold">Baixar Treino</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
