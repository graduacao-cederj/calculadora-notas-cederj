# Calculadora de Notas CEDERJ

Aplicação web para simular o cálculo de notas e status final de aprovação de um
aluno, seguindo a metodologia de avaliação utilizada pelo CEDERJ. A aplicação é
composta por um **backend em FastAPI** e um **frontend em HTML, CSS (Bootstrap)
e JavaScript puro**.

<p align="center">
<a href="https://calculadora-notas-cederj.koyeb.app/" target="_blank">
    <img src="https://img.shields.io/badge/-Acessar%20Calculadora-005500?style=for-the-badge&logo=koyeb&logoColor=white" alt="launch app" target="_blank"></a> 
</p>

## 🎓 Sobre o CEDERJ

O **CEDERJ** (Centro de Educação Superior à Distância do Estado do Rio de
Janeiro) é um consórcio público de ensino superior que oferece cursos de
graduação à distância, integrando instituições como UFRJ, UFF, UERJ, UNIRIO,
entre outras. O modelo de avaliação do CEDERJ é padronizado e amplamente adotado
por seus cursos, com regras claras sobre composição de notas e critérios de
aprovação.

### 📊 Metodologia de Cálculo

* **N1 = AD1 × 0.2 + AP1 × 0.8**
* **N2 = AD2 × 0.2 + AP2 × 0.8**
* **N  = (N1 + N2) / 2**

Regras de aprovação:

* Se **N ≥ 6** → **Aprovado**
* Se **N < 6** → AP3 é obrigatória
  * **NF = (máximo entre N1 e N2 + AP3) / 2**
  * Se **NF ≥ 5** → **Aprovado**
  * Caso contrário → **Reprovado**

## 🔧 Estrutura do Projeto

```
project/
├── backend/
│   ├── main.py               # API FastAPI com o endpoint /avaliar
│   └── disciplina.py         # Classe Disciplina com a lógica de cálculo
├── frontend/
│   ├── index.html            # Página principal com formulário e resultados
│   ├── styles.css            # Estilos visuais e responsividade
│   └── script.js             # Lógica de interação e comunicação com backend
├── tests/
│   └── test_disciplina.py    # Testes unitários para a lógica de notas
```

## Tech Stack

- Python 3.12+
- FastAPI 0.115+
- Pytest
- Docker
- Taskipy
- Poetry
- Bootstrap 5.3+

## Executando o Projeto Localmente

Faça build do projeto e inicie os containers Docker:

```bash
docker compose up --build
```

### Setup Local sem Docker para Desenvolvimento

Para configurar o ambiente local sem Docker, siga os passos abaixo:

```bash
git clone git@github.com:graduacao-cederj/calculadora-notas-cederj.git
cd calculadora-notas-cederj

# Crie um ambiente virtual
uv venv .venv
source .venv/bin/activate

# Instale as dependências do projeto usando Poetry
poetry install --all-groups

# Listar as tarefas disponíveis
task --list

# Executar os testes
task test

# Rodar a aplicação
task run
```

## 🚀 Backend (FastAPI)

### Descrição:

* Recebe via `POST /avaliar` um JSON com as notas.
* Processa com a classe `Disciplina`.
* Retorna nota final (`nf`), status (`aprovado`) e notas mínimas necessárias:
  * para N2, AP2 ou AP3, dependendo da situação do aluno.

## 🎨 Frontend (HTML + Bootstrap + JS)

### Funcionalidades:

* Campos de entrada para AD1, AP1, AD2, AP2 e AP3.
* Campos de AD2, AP2 e AP3 são exibidos dinamicamente conforme preenchimento.
* Placeholders atualizados com notas mínimas para aprovação automaticamente.
* Tabela de resultados exibida progressivamente:
  * Nota 1, Nota 2, Média, Nota Final.
  * Notas mínimas calculadas para aprovação.
  * Status com destaque visual (verde/vermelho).

### Responsividade:

* Interface escura, responsiva, centralizada e adaptada a desktops e dispositivos móveis.
* Área de conteúdo realçada em monitores grandes.

## ✅ Funcionalidades em Destaque

* Cálculo reativo em tempo real com base nos inputs.
* Exibição seletiva dos campos conforme progresso do preenchimento.
* Feedback claro com animações e realce visual no status.
* Código estruturado para manutenção e extensibilidade.

## 📄 Licença

Distribuído sob licença MIT. Livre para uso, modificação e distribuição com
atribuição.

## Citando o Projeto

Se você utilizar este projeto em uma publicação científica ou em aulas,
considere citar como:

    F. L. S. Bustamante, Calculadora de Notas CEDERJ, 2025. Disponível em:
    https://github.com/graduacao-cederj/calculadora-notas-cederj
