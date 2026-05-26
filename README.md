<div align="center">

# Exemplo CRUD — Cadastro de Alunos

### Material de estudo · IDW · UNEMAT · 2026/1

![UNEMAT](https://img.shields.io/badge/UNEMAT-2026.1-006633?style=for-the-badge)
![Disciplina](https://img.shields.io/badge/Disciplina-IDW-0a66c2?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*Exemplo didático para a atividade avaliativa de CRUD em JavaScript*

</div>

---

## Para que serve este repositório

Este código é **material de estudo** para a atividade avaliativa de CRUD.

> **IMPORTANTE — leia antes de continuar:**
> Este exemplo cadastra **alunos** (nome + matrícula).
> A sua avaliação é de **Agenda de Contatos** (nome + telefone + email).
> Você **não pode** apenas trocar palavras e entregar este código. O objetivo é estudar este exemplo, entender cada parte, e **construir a sua própria solução** com os campos e o tema da avaliação.

---

## O que é um CRUD?

CRUD é a sigla das quatro operações básicas de qualquer sistema de cadastro:

| Letra | Operação | O que faz |
| --- | --- | --- |
| **C** | Create (Criar) | Adicionar um item novo ao cadastro |
| **R** | Read (Ler) | Mostrar os itens cadastrados na tela |
| **U** | Update (Atualizar) | Editar um item que já está cadastrado |
| **D** | Delete (Excluir) | Remover um item do cadastro |

Quase todo sistema que você usa no dia a dia é um CRUD: cadastro de produtos numa loja online, lista de tarefas, agenda de contatos, postagens em uma rede social — todos seguem esse mesmo padrão.

---

## Como rodar o exemplo

Você **não precisa instalar nada**. Basta um navegador.

1. Clone (ou baixe o ZIP) deste repositório.
2. Abra o arquivo `index.html` com duplo clique.
3. Cadastre alguns alunos, edite, exclua e **recarregue a página**: os dados continuam lá graças ao `localStorage`.

> **Dica:** se você usa VS Code, instale a extensão *Live Server* para recarregar a página automaticamente quando salvar um arquivo. Atalho: clique direito no `index.html` e escolha *Open with Live Server*.

---

## Estrutura dos arquivos

```
exemplo-crud-alunos/
├── index.html     <- estrutura da página (formulário + lista)
├── main.css       <- estilos visuais
├── main.js        <- toda a lógica do CRUD
└── README.md      <- este arquivo (explicação dos conceitos)
```

---

## Conceitos usados (com onde aparecem no código)

Cada um dos blocos abaixo é um conceito que você vai precisar reaproveitar (com adaptações) na sua avaliação. Os números das partes correspondem aos comentários `PARTE N` dentro do `main.js`.

### 1. Buscar elementos do HTML — PARTE 1

```js
const inputNome = document.querySelector("#nome");
```

`document.querySelector("#id")` procura no HTML o elemento que tem aquele `id` e devolve uma referência para ele. A partir daí você pode ler/escrever no elemento.

### 2. Estado: o vetor que guarda os dados — PARTE 2

```js
let alunos = [];
```

Um vetor (array) vazio. Cada vez que o usuário cadastra alguém, um **objeto** é colocado dentro deste vetor.

```js
const aluno = { nome: "Maria", matricula: "2026001" };
alunos.push(aluno);
```

### 3. Persistência com `localStorage` — PARTE 3

O `localStorage` guarda os dados **dentro do navegador**, então a lista não some quando a página é recarregada.

```js
localStorage.setItem("alunos_idw_2026", JSON.stringify(alunos)); // grava
const texto = localStorage.getItem("alunos_idw_2026");           // lê
const alunos = JSON.parse(texto);                                // converte de volta
```

- `JSON.stringify(vetor)` transforma o vetor em **texto**
- `JSON.parse(texto)` transforma o texto **de volta** em vetor

Isso é necessário porque o `localStorage` só armazena texto, e o nosso `alunos` é um vetor de objetos.

### 4. Renderizar a lista — PARTE 4

Toda vez que a lista muda, chamamos `mostraAlunos()`. Ela:

1. Limpa o conteúdo da `<div id="lista">` atribuindo string vazia à propriedade `.innerHTML`
2. Se o vetor está vazio, mostra uma mensagem dizendo isso
3. Caso contrário, percorre o vetor com um `for` e monta o HTML de cada aluno usando **template strings** (texto entre crases com `${variavel}` dentro)

### 5. Eventos de clique — PARTE 6, 7 e 8

```js
btnSalvar.addEventListener("click", () => {
    // código que roda quando o usuário clica
});
```

`addEventListener("click", funcao)` faz a `funcao` ser chamada toda vez que o elemento for clicado. É assim que a página "reage" ao que o usuário faz.

### 6. Validação simples

Antes de cadastrar, conferimos se os campos não estão vazios:

```js
if (nome === "" || matricula === "") {
    alert("Preencha nome e matrícula antes de salvar.");
    return; // sai da função sem cadastrar
}
```

`.trim()` tira espaços em branco das pontas — assim, digitar só espaços não passa pela validação.

### 7. UPDATE: editar um item existente — PARTE 6 e 8

A grande sacada para o UPDATE é a variável `indiceEditando`:

- Quando vale `null` → o botão "Salvar" **cria** um item novo (`push`)
- Quando vale um número (0, 1, 2...) → o botão **substitui** o item daquela posição: `alunos[indiceEditando] = aluno;`

Ao clicar em "Editar" de um aluno:
1. Os dados do aluno aparecem nos inputs
2. `indiceEditando` recebe o índice daquele aluno
3. O título do formulário muda para "Editando aluno"
4. O botão "Cancelar" aparece

### 8. DELETE: excluir um item — PARTE 7

```js
alunos.splice(indice, 1);
```

`splice(indice, 1)` remove 1 elemento do vetor a partir daquela posição. Sempre pedimos confirmação com `confirm("Tem certeza?")` antes de apagar.

### 9. `data-indice`: como o botão sabe qual aluno ele representa

Cada botão dentro da lista nasce com um atributo `data-indice="0"`, `data-indice="1"`, etc. Quando o botão é clicado, lemos esse atributo com `botao.dataset.indice` e usamos como índice do vetor. Assim conseguimos saber **qual** dos vários botões "Excluir" o usuário clicou.

---

## Erros comuns (e como evitar)

| Erro | Causa | Solução |
| --- | --- | --- |
| Lista vem em branco mesmo depois de cadastrar | Você esqueceu de chamar `mostraAlunos()` depois do `push` | Chame a função de renderização após **toda** mudança no vetor |
| Editar não funciona | Você esqueceu de conectar os botões de editar com `addEventListener` **depois** de reescrever a div | Os listeners precisam ser conectados **após** os botões existirem na tela |
| `JSON.parse` quebra a página com erro | Você gravou no storage uma vez, alterou o formato e tentou ler | Limpe o `localStorage` (DevTools → Application → Local Storage → Clear) e teste de novo |
| `parseInt(undefined)` resulta em NaN | Você esqueceu de colocar `data-indice` no botão ou errou o nome | Confira no DevTools (F12) → Elements se o atributo está lá |
| Excluí um item e o índice dos próximos ficou errado | Esse é o motivo de **sempre re-renderizar** depois de qualquer mudança | Chame `mostraAlunos()` ao final de cada operação |

---

## Antes de entregar a sua avaliação

- [ ] Os 3 arquivos (`index.html`, `main.css`, `main.js`) têm comentário com o nome dos integrantes no topo?
- [ ] O CRUD está completo? (testou criar, listar, editar e excluir?)
- [ ] Recarregou a página e os dados **continuaram** lá? (localStorage funcionando)
- [ ] Os campos da agenda de contatos são **nome, telefone e email** (não nome e matrícula)?
- [ ] Tem validação simples (não deixa cadastrar com campos vazios)?
- [ ] A pasta foi compactada em `.zip` com o nome pedido no PDF da avaliação?

---

## Autor

**Prof. Ivan Luiz Pedroso Pires**
Disciplina: Introdução ao Desenvolvimento Web — UNEMAT — 2026/1

<div align="center">

*Bom estudo! Em caso de dúvida, traga para a próxima aula.*

</div>
