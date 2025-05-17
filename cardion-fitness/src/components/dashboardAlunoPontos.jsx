import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import { useGet } from '~/hook/crud/useGet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardGraficoAlunos = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { buscarAlunosOrdenadosPorPontos } = useGet();
  const [posicaoAluno, setPosicaoAluno] = useState(null);
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoPontos, setAlunoPontos] = useState('');
  useEffect(() => {
    const carregarDados = async () => {
      const alunos = await buscarAlunosOrdenadosPorPontos();
        //setDados(alunos);
        // quando quiser trazer todos é so usar o de cima, como imagino que sera um top 5 ou top 3, usa passando o slice msm
      setDados(alunos.slice(0, 5));

       // Posição do aluno logado
      const alunoId = await AsyncStorage.getItem('uid');
      const index = alunos.findIndex(a => a.id === alunoId);
      if (index !== -1) {
        setPosicaoAluno(index + 1); // posição começa do 1
        setAlunoNome(alunos[index].nome);
        setAlunoPontos(alunos[index].pontos)
      }

      setLoading(false);
    };

    carregarDados();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#6943FF"
        style={{ marginTop: 20 }}
      />
    );
  }

  if (dados.length === 0) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#E4E4E7' }}>
        Nenhum dado disponível.
      </Text>
    );
  }

  const chartData = {
    labels: dados.map(aluno =>
      aluno.nome.length > 8 ? aluno.nome.slice(0, 8) + '…' : aluno.nome
    ),
    datasets: [
      {
        data: dados.map(aluno => aluno.pontos)
      }
    ]
  };

  const chartWidth = Dimensions.get('window').width - 32;

  return (
    <View style={{ backgroundColor: '#1F2937', padding: 16, borderRadius: 12 }}>
      <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>
        Ranking Top 5 de Pontos
      </Text>
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

       {posicaoAluno && (
        <Text style={{ marginTop: 16, color: '#F9FAFB', textAlign: 'center' }}>
          Sua posição: <Text style={{color:"#6943FF"}} >#{posicaoAluno}</Text> - {alunoNome} - {alunoPontos} pts
        </Text>
      )}
    </View>
  );
};

export default DashboardGraficoAlunos;
