import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGet } from '~/hook/crud/useGet';

const DashboardGraficoAlunos = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const { buscarAlunosOrdenadosPorPontos } = useGet();
  const [posicaoAluno, setPosicaoAluno] = useState(null);
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoPontos, setAlunoPontos] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      const alunos = await buscarAlunosOrdenadosPorPontos();

      const alunoId = await AsyncStorage.getItem('uid');
      const index = alunos.findIndex(a => a.id === alunoId);
      if (index !== -1) {
        setPosicaoAluno(index + 1);
        setAlunoNome(alunos[index].nome);
        setAlunoPontos(alunos[index].pontos);
      }

      setDados(alunos);
      setLoading(false);
    };

    carregarDados();
  }, []);

  const alunosVisiveis = mostrarTodos ? dados : dados.slice(0, 5);

  const chartData = {
    labels: alunosVisiveis.map((aluno) =>
      aluno.nome.length > 8 ? aluno.nome.slice(0, 8) + '…' : aluno.nome
    ),
    datasets: [
      {
        data: alunosVisiveis.map(aluno => Number(aluno.pontos) || 0)
      }
    ]
  };

  const chartWidth = alunosVisiveis.length * 80;

  if (loading) {
    return <ActivityIndicator size="large" color="#6943FF" style={{ marginTop: 20 }} />;
  }

  if (dados.length === 0) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#E4E4E7' }}>
        Nenhum dado disponível.
      </Text>
    );
  }

  return (
    <View style={{ backgroundColor: '#1F2937', padding: 16, borderRadius: 12 }}>
      <Text style={{ color: '#F9FAFB', fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' }}>
        {mostrarTodos ? 'Ranking Geral de Pontos' : 'Ranking Top 5'}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={240}
          yAxisSuffix=" pts"
          chartConfig={{
            backgroundColor: '#1F2937',
            backgroundGradientFrom: '#1F2937',
            backgroundGradientTo: '#1F2937',
            decimalPlaces: 0,
            color: () => '#6943FF',
            labelColor: () => '#F9FAFB',
            propsForBackgroundLines: {
              stroke: '#374151',
            },
          }}
          verticalLabelRotation={0}
          style={{ borderRadius: 8 }}
          fromZero
          showValuesOnTopOfBars
        />
      </ScrollView>

      <TouchableOpacity
        onPress={() => setMostrarTodos(!mostrarTodos)}
        style={{
          backgroundColor: '#6943FF',
          paddingVertical: 8,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignSelf: 'center',
          marginTop: 16
        }}
      >
        <Text style={{ color: '#F9FAFB', fontWeight: '500' }}>
          {mostrarTodos ? 'Mostrar Top 5' : 'Mostrar Todos'}
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        {alunosVisiveis.map((aluno, index) => (
          <TouchableOpacity
            key={aluno.id}
            onPress={() =>
              alert(`Posição: ${index + 1}\nNome: ${aluno.nome}\nPontos: ${aluno.pontos}`)
            }
          >
            <Text style={{ color: '#E5E7EB', textAlign: 'center', marginBottom: 6 }}>
              {index + 1}. {aluno.nome} — {aluno.pontos} pts
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {posicaoAluno && (
        <Text style={{ marginTop: 16, color: '#F9FAFB', textAlign: 'center' }}>
          Sua posição: <Text style={{ fontWeight: '600', color: '#6943FF' }}>{posicaoAluno}</Text> — {alunoNome} — {alunoPontos} pts
        </Text>
      )}
    </View>
  );
};

export default DashboardGraficoAlunos;
