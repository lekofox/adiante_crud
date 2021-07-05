<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center"> API - Gestão de cadastros médicos</h3>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation-locally">Installation locally</a></li>
      </ul>
    <li>
      <a href="#getting-started-with-heroku">Getting started (Heroku)</a>
      <ul>
        <li><a href="#prerequisites-heroku">Prerequisites</a></li>
        <li><a href="#using">Using</a></li>
      </ul>
    </li>
    <li><a href="#test-case">Test cases</a></li>
    <ul><li><a href="#seeds-data">Seeds data</li></ul>
    <li><a href="#license">License</a></li>
    <li><a href="#dev-notes">Dev Notes</a></li>
    <ul>
        <li><a href="#docker-container">Docker Container</a></li>
        <li><a href="#test-unit">Unit Test</a></li>
      </ul>
  </ol>
</details>

## About The Project

Uma API simulando o back-end de uma sistema de gestão de cadastros para médicos\
Construída no estilo RESTful utilizando Node.js, MySQL e outras dependências.\
É possível cadastrar novos médicos, desativa-los, alterar os dados e buscar por todos os campos do cadastro.


### Built With

- [express](https://expressjs.com/)
- [yup](https://www.npmjs.com/package/yup)
- [docker](https://www.docker.com/)
- [sequelize](https://sequelize.org/)
- [mysql](https://www.npmjs.com/package/mysql2)
- [newman](https://www.npmjs.com/package/newman)


<!-- GETTING STARTED -->

## Getting Started

Para utilizar a aplicação, você deve seguir os passos descritos abaixo.\
O banco de dados está hospedado na AWS e a aplicação containerizada com Docker\
Caso você não deseje utilizar docker, pode clonar o repositório e rodar localmente a aplicação seguindo os passos abaixo. 

### Prerequisites locally


- npm
  ```sh
  npm install npm@latest -g
  ```
- Sequelize-cli
  ```sh
  npm install sequelize-cli -g
  ```

### Installation locally

1. Clone o repositório
   ```sh
   git clone https://github.com/lekofox/adiante_crud
   ```
2. Instale as dependências via NPM
   ```sh
   npm install
   ```
4. Colocar o banco de dados em estado inicial
   ```sh
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
## Getting Started with Docker

Para utilizar a aplicação com o Docker siga os passos abaixo.


### Prerequisites

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

### Using

Para acessar a documentação com todas as rotas, visite https://documenter.getpostman.com/view/16508397/Tzm2Kdss#intro\
Você pode testar todas as rotas utilizando Insomnia, Postman ou o seu API Client de preferência, seguindo as rotas destacadas na documentação.\
Caso queira executar os test cases pré definidos, você pode executar o comando:
  ```npx newman run postman_test_cases.json``` 

Todos os endpoints são executados em localhost na porta 3333 (http://localhost:3333/)


## Seeds Data

Nas seeds você encontrará 8 especializações médicas que são de vital importância para o funcionamento correto da API, é necessário garantir que elas foram devidamente executadas.\
Em conjunto com as especializações, será criado também o registro de um médico (Neandro Lias, com CRM 1234567) e um registro na tabela relacional `doctor_specialization` vinculando o Neandro às especializações de Alergologia e Angiologia.

## License

Distributed under the MIT License. See `LICENSE` for more information.


## Dev notes

#### Docker Container

The first idea was building the whole application into a docker-compose file to run in every possible scenario. \
I had some problems with the integration between the two images (database and application), so I prefered to just run an docker local image of the database. \
Future releases should be in a docker-friendly development.


#### Test unit
Same as docker, the original idea was testing the whole application and build it in a TDD-like pattern. \
Actually there is a tests/app.test.js and a script to run it, but isnt running in production. \
I'm curently improving myself and learning TDD to deliver it in future releases
