# KaBe (Base de Conhecimento IA)

## Descrição

Criação de base de conhecimento ampla de nossa solução, com informações sobre o modelo de dados, arquitetura da aplicação, tecnologias, regras de negocios, bibliotecas, nomenclaturas, procedures. Esta base será utilizada para que uma IA possa inicialmente ajudar a identificar pontos que precisam ser alterados para implementar novas features, calcular tempo de desenvolvimento, fazer code review, montar testes e posteriormente ser utilizada para poder realizar codificações.

As bases de consultas conterão:

- Base Vetorial em pgVector para descrição de regras de negócio, definições

- Base Neo4j para graph e criação de relacionamentos entre os itens

## Membros

- Gustavo Leme

- Felipe Pinheiro

- Ivan/Sousa (Apoio e definições)

## Solução a ser utilizada

- Kilocode / Kilocli

## Regras

- Usar o AGENTS.md como "manual de integração" para que a IA entenda o projeto a cada nova sessão, conter:

  - Descrição dos projetos

  - Stack de tecnologias

  - Ferramentas disponiveis (MCP, agentes, skills)

  - Seções com padrões de nomenclatura de pastas, arquivos, nomes campos, nomes procedures

  - Padrão de interação com o Neo4J (Nós, conteudo)

  - O que contem na base vetorial

  - Arquitetura da aplicação

  - Padrão de pastas

- Usar MCP para interação com bancos de dados

- IA deve sempre buscar contexto primeiro nas bases de dados

- Base Graph (Neo4j)

  - Os nós no graph devem ser em inglês

  - Os tipos de nós no graph

  - Relacionamento entre tabelas

  - Campos pertencentes as tabelas

  - Detalhes e qual informação é gravada no campo

  - Relacionamento entre arquivos

  - Relacionamento entre métodos

- Base vetorial irá conter:

  - Detalhamento de regras de negocios

  - Descrição de funcionalidades

  - Descrição, campos e informações contidas em cada tela

- Avaliar modelo para embedding local (ex: Ollama)

- Criação de skills personalizadas para cada função

  - Code Reviewer

  - Avaliar as skills do projeto ring

- Skill de memoria (Auto healing)

## Primeiro Use Case:

- Montar plano de implementação completa de uma tela de cadastro, edição de dados de cliente. Plano deve conter:

  - O que precisa ser alterado no dev de tela

  - Alterações necessarias na classe CaseBusiness

  - Codigo da procedure

  - Plano de Testes

  - Script de testes

  - Seguir padrões de nomes no objetos, tabelas, campos, procedures