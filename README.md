# 🔝 Cardion Fitness App

<div align="center">
  <img src="https://github.com/user-attachments/assets/5bfbcae7-a1e6-4ef1-a031-38c094c7a148" width="30%" style="max-width: 200px; margin: 5px;" />
  <img src="https://github.com/user-attachments/assets/820e5602-f313-4683-9bab-4be0fc6a9b7b" width="30%" style="max-width: 200px; margin: 5px;" />
  <img src="https://github.com/user-attachments/assets/835f3e34-ce55-4a41-86d1-dec53c760246" width="30%" style="max-width: 200px; margin: 5px;" />
</div>

## 📚 Informações sobre o projeto:
* Este projeto foi desenvolvido como conclusão do curso de Análise e Desenvolvimento de Sistemas
* Trata-se de um app mobile voltado para o setor fitness

## ❓ Como o app funciona?
#### O app Cardion Fitness possui dois fluxos principais:
🔹 Personais: podem criar treinos, avaliações e acompanhar o progresso dos alunos. <br>
🔹 Alunos: além de acesso a treinos e avaliações, têm uma experiência gamificada com rankings, conquistas, desafios e um sistema de pontuação que valoriza cada avanço.

## ⚙️ Principais funcionalidades do app:

**👤 Gestão de Usuários**  
- CRUDs de contas (criar, editar e deletar)  
- Upload de foto de perfil personalizada  

**🏋️ Gestão de Treinos e Avaliações**  
- CRUDs de treinos e avaliações físicas  
- Visualização dos treinos e avaliações  
- Sessões de treino que atualizam a barra de progresso  
- Acompanhamento de progresso  

**🎮 Gamificação e Engajamento**  
- 2 rankings gamificados com pontuações salvas por usuário  
- Conquistas desbloqueáveis  
- Desafios internos  
- Sistema de pontuação para competição entre usuários  
- Notificações de incentivo  

**💡 Outros Recursos**  
- Diversos modais interativos  
- Integração com anúncios  

---

## 🛠️ Tecnologias e ferramentas utilizadas:
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/?hl=pt-br)
- [Node.js](https://nodejs.org/pt)
- [Expo SDK 52](https://docs.expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Styled Components](https://styled-components.com/)

--- 

## ✅ Requisitos e observações técnicas:
- **Node.js** versão recomendada: `18.x` ou superior  
- **Expo**: projeto rodando com **Expo SDK 52**  
- Necessário ter **npm** instalado  
- O IP configurado em `config.js` deve ser o endereço de IP local da máquina onde a API estará rodando para possibilitar notificações e upload de imagem de perfil  

---

## 🚀 Como instalar e rodar o projeto:
```bash
# Abra um terminal e copie este repositório com o comando
$ git clone https://github.com/americorodrigues25/Cardion-Fitness.git
```

```bash
# Acesse o diretório principal da aplicação:
$ cd Cardion-Fitness

# Acesse o diretório da API:
$ cd cardion-api

# Instale as dependências:
$ npm install

# Configure o endereço de IP local no arquivo 'config.js' dentro de cardion-api
# Rode a API (Deixe-a rodando):
$ node config.js

# Volte um diretório:
$ cd ..

# Entre no diretório raiz
$ cd cardion-fitness

# Instale as dependências:
$ npm install

# Configure o mesmo endereço de IP local no arquivo 'src/apiConfig/config.js'
```

```bash
# Por fim, inicie a aplicação com:
$ npx expo start
```
_________________________________________________________
<div align="center">💻 Feito por Américo Rodrigues</div>
