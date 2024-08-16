# Dialog

## Api Node

Para executar a API, utilize Node v20 LTS, então instale as dependências:

```bash
cd api-node
npm install --save
```

Crie o arquivo `.env` incluindo as variáveis de ambiente para o backend.
Para isso, execute os seguintes comandos:

```bash
cp .env.example .env
```

Altere o arquivo `.env` com os valores para todas as variáveis relacionadas ao banco de dados e ao Redis, bem como a variável `JWT_SECRET`.

Então crie os conatainers para o banco de dados PostgreSQL e o Redis com o seguinte comando:

```bash
sudo docker compose up
```

Após criado o container, basta iniciar o serviço da API com o comando:

```bash
npm start
```

Todos os endpoints estão documentados no arquivo [endpoints.json](./api-node/endpoints.json).

Baixe e instale o Cliente HTTP [Insmonia](https://insomnia.rest/download) e então importe o arquivo `endpoints.json` para acessar os endpoints da API. 


## Frontend NextJs

Para executar o frontend, utilize Node v20 LTS e então execute os seguintes comandos:

```bash
cd frontend-nextjs
npm install --save
npm run dev
```

Acesse então [http://localhost:3000](http://localhost:3000).

