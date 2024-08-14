# Dialog

## Api Node

Para executar a API em Node, primeiro instale as dependências e então crie o arquivo `.env` incluindo as variáveis de ambiente para o backend.
Para isso, execute os seguintes comandos:

```bash
cd api-node
npm install --save
cp .env.example .env
```

Altere o arquivo `.env` com os valores para todas as variáveis relacionadas ao banco de dados, bem como `JWT_SECRET`.
Então crie o conatainer para o banco de dados PostgreSQL com o seguinte comando:

```bash
sudo docker compose up
```

Após criado o container, basta iniciar o serviço da API com o comando:

```bash
npm start
```