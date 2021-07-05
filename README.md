<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center"> API - Gestão de cadastros médicos</h3>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o projeto</a>
      <ul>
        <li><a href="#construído-com">Construído com</a></li>
      </ul>
    </li>
    <li>
      <a href="#executando-o-projeto-localmente">Executando projeto localmente</a>
      <ul>
        <li><a href="#pré-requisitos-para-execução-local">Pré requisitios para execução local</a></li>
        <li><a href="#instalação-local">Instalação local</a></li>
      </ul>
    <li>
      <a href="#executando-com-o-docker">Executando o projeto com Docker</a>
      <ul>
        <li><a href="#pré-requisitos-docker">Pré-requisitos Docker</a></li>
        <li><a href="#utilizando">Utilizando</a></li>
      </ul>
    </li>
    <li><a href="#informações-sobre-as-seeds">Informações sobre as seeds</li>
    <ul></ul>
    <li><a href="#license">License</a></li>
    <li><a href="#dev-notes">Dev Notes</a></li>
    <ul>
        <li><a href="#docker-container">Docker Container</a></li>
        <li><a href="#testes-com-newman">Testes com Newman</a></li>
      </ul>
  </ol>
</details>

## Sobre o projeto

Uma API simulando o back-end de uma sistema de gestão de cadastros para médicos.\
Construída no estilo RESTful utilizando Node.js, MySQL e outras dependências.\
É possível cadastrar novos médicos, desativa-los, alterar os dados e buscar por todos os campos do cadastro.


### Construído com

- [express](https://expressjs.com/)
- [yup](https://www.npmjs.com/package/yup)
- [docker](https://www.docker.com/)
- [sequelize](https://sequelize.org/)
- [mysql](https://www.npmjs.com/package/mysql2)
- [newman](https://www.npmjs.com/package/newman)


<!-- GETTING STARTED -->

## Executando o projeto localmente

Para utilizar a aplicação, você deve seguir os passos descritos abaixo.\
O banco de dados está hospedado na AWS e a aplicação containerizada com Docker.\
Caso você não deseje utilizar docker, pode clonar o repositório e rodar localmente a aplicação seguindo os passos abaixo. 

### Pré-requisitos para execução local


- npm
  ```sh
  npm install npm@latest -g
  ```
- Sequelize-cli
  ```sh
  npm install sequelize-cli -g
  ```

### Instalação local

1. Clone o repositório
   ```sh
   git clone https://github.com/lekofox/adiante_crud
   ```
2. Instale as dependências via NPM
   ```sh
   npm install
   ```
4. Colocar o banco de dados em estado inicial
   ```JS
   npx sequelize db:migrate:undo:all
   ```
5. Iniciar as migrations
   ```JS
   npx sequelize db:migrate
   ```
6. Iniciar as seeds
   ```JS
   npx sequelize db:seed:all
   ```
7. Iniciar a aplicação
   ```JS
   npm run dev
   ```
## Executando com o Docker

Para utilizar a aplicação com o Docker siga os passos abaixo.

1. De pull na imagem do docker hub
```sh
  docker pull lekofox/adiante_crud
  ```
2. Execute a imagem
```sh
  docker run --name Adiante_CRUD -p 3333:3333 -d lekofox/adiante_crud
  ```
3.Você pode executar os comandos abaixo no próprio terminal do Docker.

4. Colocar o banco de dados em estado inicial
   ```JS
   npx sequelize db:migrate:undo:all
   ```
5. Iniciar as migrations
   ```JS
   npx sequelize db:migrate
   ```
6. Iniciar as seeds
   ```JS
   npx sequelize db:seed:all
   ```  

### Pré-requisitos Docker

- Docker
  ```sh
  https://www.docker.com/products/docker-desktop
  ```
- Insomnia or Postman
  ```sh
  https://insomnia.rest/download
  https://www.postman.com/downloads/
  ```

- Beekeper Studio (To check data in database)
  ```sh
  https://www.beekeeperstudio.io/
  ```

### Utilizando

Para acessar a documentação com todas as rotas, visite https://documenter.getpostman.com/view/16508397/Tzm2Kdss#intro\
Você pode testar todas as rotas utilizando Insomnia, Postman ou o seu API Client de preferência, seguindo as rotas destacadas na documentação.\
Caso queira executar os test cases pré definidos, você pode executar o comando:
  ```npx newman run postman_test_cases.json``` 

Todos os endpoints são executados em localhost na porta 3333 (http://localhost:3333/)


## Informações sobre as seeds

Nas seeds você encontrará 8 especializações médicas que são de vital importância para o funcionamento correto da API, é necessário garantir que elas foram devidamente executadas.\
Em conjunto com as especializações, será criado também o registro de um médico (Neandro Lias, com CRM 1234567) e um registro na tabela relacional `doctor_specialization` vinculando o Neandro às especializações de Alergologia e Angiologia.

## License

Distribuído sob a licença MIT.

## Dev notes

#### Docker Container

A ideia e implementação inicial era para realizar a conteinerização de todo o ambiente (aplicação e banco de dados), mas utilizando a AWS para hospedar o banco de dados, não vi necessidade de colocar o database localmente com docker.


#### Testes com Newman
Os testes foram realizados utilizando a própria interface do Postman e executando via linha de comando com a bibliotca newman, como citado anteriormente.
Diversos casos de testes foram criados (tanto para sucesso quanto para erros), e você pode testa-los usando o comando ```npx newman run postman_test_cases.json``` após instalar as dependências
