# Sistema de Análise de Satisfação do Cliente - Projeto 3 SEBRAE

## Descrição do Projeto

Este projeto tem como objetivo medir a satisfação do cliente **sem a necessidade de perguntas diretas**, utilizando análise de comportamento dentro de uma plataforma digital.

A ideia central é interpretar ações do usuário como cliques, tempo de permanência, abandono de fluxos e frequência de uso para gerar **insights inteligentes sobre engajamento, satisfação e possíveis problemas na experiência**.

---

## Objetivo

Criar um sistema que permita:

* Identificar problemas na experiência do usuário
* Detectar sinais de insatisfação de forma indireta
* Ajudar na tomada de decisão baseada em dados reais de uso
* Reduzir dependência de pesquisas tradicionais (ex: NPS, formulários)

---

## Principais Funcionalidades

### Mapa de Calor de Interações

* Rastreia cliques, rolagens e áreas ignoradas
* Visualização com cores:

  * 🔴 Alta interação
  * 🟡 Média
  * 🟢 Baixa
* Permite identificar pontos de interesse e desinteresse

---

### Detector de Abandono Inteligente

* Identifica onde os usuários estão saindo da plataforma
* Dashboard com ranking de páginas mais críticas
* Visualização em funil (entrada → saída)
* Alertas para quedas abruptas de retenção

---

### Score de Engajamento por Cliente

* Gera um índice baseado em:

  * Frequência de uso
  * Profundidade de navegação
  * Reuso de funcionalidades
* Classificação:

  * Baixo
  * Médio
  * Alto engajamento
* Ranking de usuários

---

### Alertas de Comportamento Atípico

* Detecta quedas ou mudanças incomuns no uso
* Gera notificações automáticas
* Histórico de alertas para análise futura
* Baseado em análise estatística (ex: desvio padrão)

---

### Análise de Conclusão de Serviços

* Acompanha jornadas (ex: inscrição, solicitação)
* Mostra:

  * Taxa de conclusão
  * Etapas com maior abandono
* Visualização em formato de funil

---

### Sinais Implícitos de Insatisfação

* Detecta comportamentos como:

  * Longos períodos sem acesso
  * Demora excessiva em tarefas
* Classifica risco de churn:

  * Baixo
  * Médio
  * Alto
* Exibe timeline do usuário

---

### Taxa de Retorno do Usuário

* Analisa frequência de uso ao longo do tempo
* Identifica padrões de retenção
* Comparações entre períodos
* Sistema de “streak” para engajamento

---

## Tecnologias Utilizadas

* **Java** → processamento e lógica de negócio
* **PostgreSQL** → armazenamento de dados
* **APIs externas** → coleta de comportamento

---

## Diferencial do Projeto

Ao invés de perguntar ao usuário “Você está satisfeito?”, o sistema **observa o comportamento real** e transforma isso em métricas confiáveis.

Isso reduz:

* Viés de resposta
* Baixa taxa de participação em pesquisas
* Dados inconsistentes


