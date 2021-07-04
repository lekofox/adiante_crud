## Desenvolver um sistema que faça a gestão de cadastros de médicos. O Sistema deve suportar as seguintes operações:

    Insert
    Update
    Select
    Soft Delete

## No cadastro do médico, devem ser cadastrados os seguintes itens:

    Nome do médico com no máximo 120 caractéres
    CRM: somente números com no máximo 7 caracteres
    Telefone fixo: somente números
    Telefone celular: somente números
    CEP: somente números (Ao cadastrar o CEP, deve ser feita uma reqisição via XHR para a API dos correios e retornar todos os dados de endereço do cliente).
    Especialidade médica (mínimo de duas especialidades)

## Itens importantes:

    Done - Estar no padrão REST
    Done - Criar mecanismo de busca por todos os campos do cadastro do médico, incluindo o endereço
    Done - Utilizar ferramenta de validação (exemplo: YUP)
    Funções especialistas (Realizam somente uma operação)
    Para documentação e requisição utilizar o Postman, Insomnia ou Swagger (Enviar junto com o teste o workspace utilizado)
    Subir o código em repositório público do GitHub
    Criar arquivo docker compose para avaliação do teste
    Testes unitários
    Testes "end to end"

## Diferenciais

    Testes de integração
    Done - AWS (ECS, RDS)
    Done - Estruturação de banco de dados MySQL


## Ferramentas para serem utilizadas no desenvolvimento (Escolha entre as duas linguagens citadas abaixo)

    Node.JS (Seguir as seguintes orientações)

    NestJS
    TypeScript
    Sequelize ou TypeORM
    Migrations e Seeds

## To-Do

Adicionar length correto das migrations
** refatorar estrutura e isolar responsabilidades de código
docker compose do db (local)
heroku
documentacao