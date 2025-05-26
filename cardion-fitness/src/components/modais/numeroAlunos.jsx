import { View, Text, Modal, TextInput, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function NumerosAlunos({
    showMessageModal,
    setShowMessageModal,
    alunos,
    busca,
    setBusca,
    selectedAluno,
    setSelectedAluno,
    alunosFiltrados,
}) {

    return (
        <Modal transparent visible={showMessageModal} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/80 px-6">
                <View className="bg-colorDark100 rounded-2xl p-6 w-full max-h-[80%]">

                    {!selectedAluno ? (
                        <>
                            <Text className="text-xl font-bold text-center mb-4 text-colorLight200">
                                Deseja conversar com algum aluno?
                            </Text>

                            <TextInput
                                placeholder="Busque o aluno"
                                placeholderTextColor="#A1A1AA"
                                className="bg-colorDark100 text-colorLight200 px-4 py-4 rounded-xl mb-4"
                                value={busca}
                                onChangeText={setBusca}
                            />

                            {alunos.length === 0 ? (
                                <Text className="text-center text-colorLight300 mb-4">Nenhum aluno cadastrado ainda.</Text>
                            ) : (
                                <ScrollView className="mb-4">
                                    {alunosFiltrados.length === 0 ? (
                                        <Text className="text-center text-colorLight300">Nenhum aluno encontrado.</Text>
                                    ) : (
                                        alunosFiltrados.map((aluno, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                className="py-3 px-4 border-b border-colorDark100"
                                                onPress={() => setSelectedAluno(aluno)}
                                            >
                                                <Text className="text-lg text-colorLight300">{aluno.nome}</Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </ScrollView>
                            )}

                            <TouchableOpacity
                                className="bg-colorViolet py-3 rounded-full items-center mt-2"
                                onPress={() => {
                                    setShowMessageModal(false)
                                    setBusca('')
                                    setSelectedAluno(null)
                                }}
                            >
                                <Text className="text-colorLight200 font-bold">Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {selectedAluno.telefone ? (
                                <>
                                    <Text className='text-xl font-bold text-center mb-10 text-colorLight200'>
                                        {selectedAluno.telefone}
                                    </Text>
                                    <Text className="text-xl font-bold text-center mb-10 text-colorLight200">
                                        Deseja ir para o WhatsApp de {selectedAluno.nome}?
                                    </Text>
                                </>
                            ) : (
                                <Text className="text-xl font-bold text-center mb-10 text-colorLight200">
                                    Nenhum número cadastrado para {selectedAluno.nome}.
                                </Text>
                            )}

                            {selectedAluno.telefone ? (
                                <View className="flex-row justify-between gap-4">
                                    <TouchableOpacity
                                        className="flex-1 bg-colorViolet py-3 rounded-full items-center"
                                        onPress={() => {
                                            const telefone = selectedAluno.telefone?.replace(/\D/g, '');
                                            const url = `https://wa.me/55${telefone}`;
                                            Linking.openURL(url);
                                            setShowMessageModal(false);
                                            setSelectedAluno(null);
                                            setBusca('');
                                        }}
                                    >
                                        <Text className="text-white font-bold">Sim</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-1 bg-gray-300 py-3 rounded-full items-center"
                                        onPress={() => setSelectedAluno(null)}
                                    >
                                        <Text className="text-gray-800 font-bold">Não</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    className="bg-gray-300 py-3 rounded-full items-center"
                                    onPress={() => setSelectedAluno(null)}
                                >
                                    <Text className="text-gray-800 font-bold">Voltar</Text>
                                </TouchableOpacity>
                            )}

                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}
