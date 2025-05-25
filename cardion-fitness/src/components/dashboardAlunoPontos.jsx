import React, { useEffect, useState } from 'react';
import {
    View,
    Dimensions,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGet } from '~/hook/crud/useGet';

const DashboardGraficoAlunos = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const [posicaoAluno, setPosicaoAluno] = useState(null);
    const [alunoNome, setAlunoNome] = useState('');
    const [alunoPontos, setAlunoPontos] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [uidUsuarioLogado, setUidUsuarioLogado] = useState(null);
    const itensPorPagina = 30;

    const { buscarAlunosOrdenadosPorPontos } = useGet();

    useEffect(() => {
        const carregarDados = async () => {
            const alunos = await buscarAlunosOrdenadosPorPontos();
            const alunoId = await AsyncStorage.getItem('uid');
            setUidUsuarioLogado(alunoId);
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

    const totalPaginas = Math.ceil(dados.length / itensPorPagina);

    const alunosVisiveis = mostrarTodos
        ? dados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
        : dados.slice(0, 5);

    const dadosGrafico = mostrarTodos ? dados.slice(0, 10) : dados.slice(0, 5);


    const chartData = {
        labels: dadosGrafico.map((aluno) =>
            aluno.nome.length > 8 ? aluno.nome.slice(0, 8) + '…' : aluno.nome
        ),
        datasets: [
            {
                data: dadosGrafico.map(aluno => Number(aluno.pontos) || 0)
            }
        ]
    };

    const chartWidth = Math.max(320, chartData.labels.length * 80);

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
            <Text style={{
                color: '#F9FAFB',
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 12,
                textAlign: 'center'
            }}>
                {mostrarTodos ? 'Ranking Geral de Pontos' : 'Ranking Top 5'}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={chartData}
                    width={chartWidth}
                    height={240}
                    yAxisSuffix=" pts"
                    chartConfig={{
                        backgroundColor: '#111827',
                        backgroundGradientFrom: '#111827',
                        backgroundGradientTo: '#111827',
                        decimalPlaces: 0,
                        color: () => '#3B82F6',
                        labelColor: () => '#E5E7EB',
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
                onPress={() => {
                    setMostrarTodos(!mostrarTodos);
                    setPaginaAtual(1);
                }}
                style={{
                    backgroundColor: '#6943FF',
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginTop: 16
                }}
            >
                <Text style={{ color: '#F9FAFB', fontSize: 16, fontWeight: '600' }}>
                    {mostrarTodos ? 'Top 5 de Pontos' : 'Ranking Geral de Pontos'}
                </Text>
            </TouchableOpacity>

            {mostrarTodos && (
                <Text style={{
                    color: '#D1D5DB',
                    textAlign: 'center',
                    marginTop: 12,
                    fontSize: 14
                }}>
                    Mostrando {Math.min((paginaAtual - 1) * itensPorPagina + 1, dados.length)}–{Math.min(paginaAtual * itensPorPagina, dados.length)} de {dados.length} usuários
                </Text>
            )}

            <View style={{ maxHeight: 300, marginTop: 20 }}>
                <ScrollView>
                    {alunosVisiveis.map((aluno, index) => {
                        const alunoIndexOriginal = dados.findIndex(a => a.id === aluno.id);
                        const isUsuarioLogado = aluno.id === uidUsuarioLogado;
                        const showStar = !mostrarTodos && alunoIndexOriginal < 5;
                        const showUserStar = mostrarTodos && isUsuarioLogado;

                        return (
                            <TouchableOpacity
                                key={aluno.id}
                                onPress={() =>
                                    Alert.alert(
                                        `Posição: ${alunoIndexOriginal + 1}`,
                                        `Nome: ${aluno.nome}\nPontos: ${aluno.pontos}`
                                    )
                                }
                                activeOpacity={0.7}
                                style={{ paddingVertical: 6 }}
                            >
                                <Text style={{
                                    color: '#D1D5DB',
                                    textAlign: 'center',
                                    fontSize: 15,
                                    fontWeight: '500'
                                }}>
                                    {alunoIndexOriginal + 1}. {aluno.nome} — {aluno.pontos} pts{' '}
                                    {(showStar || showUserStar) ? '⭐' : ''}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {mostrarTodos && (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 16
                }}>
                    <TouchableOpacity
                        disabled={paginaAtual === 1}
                        onPress={() => setPaginaAtual(p => Math.max(1, p - 1))}
                        style={{
                            backgroundColor: paginaAtual === 1 ? '#4B5563' : '#6943FF',
                            paddingVertical: 6,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#F9FAFB', fontWeight: '500' }}>Anterior</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={paginaAtual === totalPaginas}
                        onPress={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                        style={{
                            backgroundColor: paginaAtual === totalPaginas ? '#4B5563' : '#6943FF',
                            paddingVertical: 6,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#F9FAFB', fontWeight: '500' }}>Próxima</Text>
                    </TouchableOpacity>
                </View>
            )}
            {posicaoAluno && (
                <View style={{ marginTop: 16 }}>
                    <Text style={{ color: '#F9FAFB', textAlign: 'center', fontSize: 15, marginBottom: 4 }}>
                        {posicaoAluno === 1 ? '🥇 Você está no topo!' : `Sua posição: `}
                        {posicaoAluno !== 1 && (
                            <Text style={{ fontWeight: '600', color: '#6943FF' }}>{posicaoAluno}º lugar</Text>
                        )}
                    </Text>

                    <View style={{ height: 10, backgroundColor: '#374151', borderRadius: 5 }}>
                        <View
                            style={{
                                height: 10,
                                backgroundColor: '#6943FF',
                                width: `${((dados.length - posicaoAluno) / (dados.length - 1)) * 100}%`,
                                borderRadius: 5,
                            }}
                        />
                    </View>

                    <Text style={{ color: '#D1D5DB', textAlign: 'center', fontSize: 12, marginTop: 4 }}>
                        {posicaoAluno === 1
                            ? 'Incrível! Você lidera o ranking. 🚀'
                            : posicaoAluno <= 5
                                ? 'Ótimo trabalho! Está entre os melhores. 👏'
                                : 'Continue! Cada ponto conta. 💪'}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default DashboardGraficoAlunos;