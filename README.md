<h1 align="center">
 🏥️ Back-end 💊 PebMed 🩺
</h1>

---

# Indice

- 💬 [Sobre o Projeto](#sobre-o-projeto)
- 👨‍💻️ [Tecnogias utilizadas](#%EF%B8%8F-tecnogias-utilizadas)
- 📦️ [Como baixar o projeto](#%EF%B8%8F-como-baixar-o-projeto)
- 📝 [Documentação](#documentação)
- ✍️ [Estrutura usando DDD](#estrutura-usando-ddd-domain-driven-design)

---

## Sobre o Projeto

Este projeto de Back-end foi desenvolvido em Node.js com TypeScript no formato RESTFull utilizando a metodologia [DDD (Domain Driven Design)](https://en.wikipedia.org/wiki/Domain-driven_design).

---

## 👨‍💻️ Tecnogias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)

### Dependências

  - [Express](https://expressjs.com/)
  - [Cors](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Controle_Acesso_CORS)
  - :calendar: [Day-js](https://day.js.org/)
  - :closed_lock_with_key: [BCrypt](https://github.com/kelektiv/node.bcrypt.js)
  - [JWT](https://jwt.io/)
  - :id: [UUIDv4](https://github.com/thenativeweb/uuidv4)
  - :black_joker: [Jest](https://jestjs.io/)
  - :syringe: [TSyringe](https://github.com/microsoft/tsyringe)
  - :tada: [Celebrate](https://github.com/arb/celebrate)
  - [DotEnv](https://github.com/motdotla/dotenv)

### Banco de Dados
  - :elephant: [PostgreSQL](https://www.postgresql.org/)
  - [DBeaver](https://dbeaver.io/)
  - [Beekeper](https://www.beekeeperstudio.io/)
  - :whale: [Docker](https://www.docker.com/)
  - [TypeORM](https://typeorm.io/)

### Padronização de código

  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
  - :mouse: [Editor Config](https://editorconfig.org/)

### IDE

  - [Visual Studio Code](https://code.visualstudio.com/)

---

## 📦️ Como baixar o projeto

**Para copiar o projeto, utilize os comandos:**

```bash
  # Clonar o repositório
  ❯ https://github.com/hericke47/pebmed-api.git

  # Entrar no diretório
  ❯ cd pebmed-api
```

**Copiar arquivo com as variáveis de ambiente**

```bash
cp .env.example .env
```

**Copiar arquivo com as configurações do banco de dados**

```bash
cp ormconfig.example.js ormconfig.js
```

**Executar Docker-compose para subir o container com a api e o container com o banco de dados postgres**

```bash
docker-compose up --build -d
```

**Executar as Migrations para criação do banco de dados**

```bash
docker exec pebmed-api npm run typeorm:migration:run
```

ou

```bash
npm run typeorm:migration:run
```

**Como rodar os testes**

Com a API funcionando, execute o comando abaixo para rodar os testes unitários e testes de integração

```bash
docker exec pebmed-api npm run test
```

ou

```bash
npm run test
```

**Como ver os logs da API no docker**

```bash
docker-compose logs
```

Sendo possível usar a flag -f para acompanhar os logs em tempo real.

**Como parar a API**

```bash
docker-compose stop
```

## Documentação

Para usar e testar os endpoints da API localmente, acesse: [Documentação Localhost](http://localhost:3003/api-docs)
Para usar e testar os endpoints da API em ambiente de produção, acesse: [Documentação Em Produção](https://pebmedapi.herickexterkoetter.com.br/api-docs/)

Diagrama do banco de dados: [Diagrama ER](https://gitlab.com/hericke47/pebmed-api/-/blob/develop/ERDiagram.jpg)

Sendo também possivel instalar o [Insomnia](https://insomnia.rest/download),e importar o arquivo: [Insomnia.json](https://github.com/hericke47/pebmed-api/blob/develop/insomnia_pebmed_api.json).

## Estrutura usando DDD (Domain Driven Design)

O DDD é basicamente o conjunto de princípios com foco em domínio. O domínio é o coração do negócio que você está trabalhando, sem o domínio todo o sitema não serviria de nada. Por exemplo um domínio de uma aplicação escolar é o **Estudante**, já que sem o estudante existir não faria sentido existir uma escola.

- **src**: *Contém toda a organização do DDD, e tudo que envolve código dentro da api*
    - **@types**: *Contém todas as tipagens referentes às bibliotecas que não foram atendidas pela própria lib ou pela [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). Também contém as tipagens que alteram as utilizadas pelas bibliotecas do código.*
    - **config**: *Contém os arquivos referentes a configuração, normalmente de libs (ex.: secret e data de validade do jwt), do código.*
    - **modules**: *Contém os arquivos referentes a cada módulo do código. É importante notar que nem sempre os módulos correspondem às entidades (modelos) do Banco de Dados, pois podem existir módulos que possuem mais de uma entidade (ex.: módulo Doctors possui as entidades Doctor.ts e DoctorTokens.ts). Nesse caso, o módulo Doctors é todo o código que faz parte desse grupo.*
        - **doctors**: *Contém os arquivos referentes ao módulo Doutores.*
            - **dtos**: *Contém os arquivos referentes aos DTOs (Data Transfer Object), que representam os objetos de dados que são passados como argumentos de uma função.*
            - **infra**: *Contém os arquivos referentes a parte de infraestrutura do código.*
                - **typeorm**: *Contém os arquivos referentes ao TypeORM.*
                    - **entities**: *Contém os arquivos referentes às entidades do Banco de Dados representadas no programa.*
                    - **repositories**: *Contém os arquivos referentes aos repositories. Eles são os únicos responsáveis pela interação do programa com o Banco de Dados. Portanto, toda operação que depender do BD deverá passar por eles. Como está na pasta infra, essa é a parte do repository que implementa a lógica de comunicação com o BD no TypeORM.*
            - **repositories**: *Contém os arquivos referentes aos repositories. Eles são os únicos responsáveis pela interação do programa com o Banco de Dados. Portanto, toda operação que depender do BD deverá passar por eles. Como está fora da pasta infra, essa é a parte do repository que se comunica com a lógica implementada na infra, sem depender da implementação da lib.*
                - **fakes**: *Contém o repositório fake, que simula as operações do repositório sem se comunicar com o Banco de Dados. Utilizado para realização de testes.*
            - **useCases**: *Contém os arquivos referentes aos casos de uso. Onde vão conter pastas com contextos de funcionalidade como **CreateDoctor** e dentro desses contextos vão conter o controlador e o useCase que é onde ficará toda a regra de negócio da funcionalidade*
            - **views**: *Contém os arquivos que serão utilizados como templates no envio de emails.*
    - **shared**: *Contém todos os arquivos que são compartilhados pelos módulos*
        - **container**: *Contém os providers e o arquivo que irá gerenciar a injeção de dependências na api.*
            - **providers**: *Contém os arquivos referentes a provedores que irão fornecer novas funcionalidades ao programa (ex.: provedor para gerar Hash de senha, provedor de envio de email e etc...).*
                - **HashProvider**: *Contém os arquivos referentes ao provedor que realiza o hash de textos, geralmente utilizado para criptografar senhas.*
                    - **fakes**: *Contém o provider fake, que simula as operações do provider sem depender do recurso de terceiros (ex.: lib bcryptjs). Utilizado para realização de testes.*
                    - **implementations**: *Contém os arquivos referentes a implementação da lógica do provider no programa. É o código que de fato realiza as funcionalidades adicionadas pelo provider.*
                    - **models**: *Contém os arquivos referentes aos formatos das funções que vão ser implementadas dentro da pasta **implementations.***
        - **errors**: *Contém os arquivos referentes ao tratamento de erros do código.*
        - **infra**: *Contém os arquivos referentes a parte de infraestrutura do código.*
            - **http**: *Contém os arquivos referentes a parte de requisições HTTP.*
                - **routes**: *Contém os arquivos referentes às rotas do código.*
            - **typeorm**: *Contém os arquivos referentes ao TypeORM.*
                - **migrations:** *Contém as migrations do TypeORM.*
