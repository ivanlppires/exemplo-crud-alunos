/* =========================================================
   EXEMPLO DIDÁTICO — CRUD de Cadastro de Alunos
   Disciplina: Introdução ao Desenvolvimento Web — UNEMAT — 2026/1
   Professor: Ivan Luiz Pedroso Pires

   ATENÇÃO: Este arquivo NÃO É a sua avaliação. É um material
   de ESTUDO. Leia, entenda, depois ADAPTE para o tema da
   avaliação (Agenda de Contatos).

   ---------------------------------------------------------
   O que é um CRUD?
   ---------------------------------------------------------
   CRUD é a sigla das 4 operações básicas de qualquer cadastro:
     C — Create  (Criar)        -> adicionar um item novo
     R — Read    (Ler)          -> exibir os itens cadastrados
     U — Update  (Atualizar)    -> editar um item já cadastrado
     D — Delete  (Excluir)      -> remover um item

   Neste exemplo, cada "item" é um ALUNO, e cada aluno tem:
     - nome      (texto)
     - matricula (texto)

   Vamos guardar todos os alunos em um VETOR (array).
   E vamos usar o localStorage para que a lista NAO SUMA
   quando o usuário recarregar a página.
   ========================================================= */


/* =========================================================
   PARTE 1 — BUSCAR OS ELEMENTOS HTML
   ---------------------------------------------------------
   document.querySelector("#algo") busca um elemento pelo id.
   Guardamos a referência em uma const para usar depois.
   ========================================================= */

const inputNome      = document.querySelector("#nome");
const inputMatricula = document.querySelector("#matricula");
const btnSalvar      = document.querySelector("#salvar");
const btnCancelar    = document.querySelector("#cancelar");
const tituloForm     = document.querySelector("#tituloFormulario");
const divLista       = document.querySelector("#lista");


/* =========================================================
   PARTE 2 — ESTADO DA APLICACAO
   ---------------------------------------------------------
   "Estado" é a informação que muda enquanto o programa roda.

   alunos        -> vetor com todos os alunos cadastrados
   indiceEditando-> se for null, estamos CRIANDO um aluno novo.
                    Se for um número (0, 1, 2...), estamos
                    EDITANDO o aluno daquela posição do vetor.
   ========================================================= */

let alunos = [];
let indiceEditando = null;


/* =========================================================
   PARTE 3 — PERSISTENCIA com localStorage
   ---------------------------------------------------------
   O localStorage é uma "caixinha" do navegador que guarda
   texto entre uma visita e outra à página.

   - localStorage.setItem("chave", "valor")  -> grava
   - localStorage.getItem("chave")           -> lê
   - localStorage.removeItem("chave")        -> apaga

   Como o localStorage só guarda TEXTO, e nosso "alunos" é
   um VETOR de OBJETOS, usamos:
     JSON.stringify(vetor) -> transforma vetor em texto
     JSON.parse(texto)     -> transforma texto de volta em vetor
   ========================================================= */

const CHAVE_STORAGE = "alunos_idw_2026";

const salvarNoStorage = () => {
    // converte o vetor em uma string JSON e grava no navegador
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(alunos));
};

const carregarDoStorage = () => {
    // tenta ler o texto salvo. Se nunca foi salvo, vem null.
    const texto = localStorage.getItem(CHAVE_STORAGE);
    if (texto === null) {
        alunos = []; // primeira vez na página: vetor vazio
    } else {
        alunos = JSON.parse(texto); // converte texto de volta em vetor
    }
};


/* =========================================================
   PARTE 4 — RENDERIZACAO (a parte "R" do CRUD: Read)
   ---------------------------------------------------------
   "Renderizar" significa desenhar a lista de alunos na tela.
   Toda vez que a lista mudar (criar/editar/excluir), nós
   chamamos esta função para reconstruir o HTML da div.
   ========================================================= */

const mostraAlunos = () => {

    // 1) Limpa o conteúdo atual da div para começar do zero.
    divLista.innerHTML = "";

    // 2) Se o vetor estiver vazio, mostra uma mensagem amigável.
    if (alunos.length === 0) {
        divLista.innerHTML = '<p class="lista-vazia">Nenhum aluno cadastrado ainda.</p>';
        return; // sai da função porque não há o que listar
    }

    // 3) Percorre cada aluno do vetor. Aqui usamos for tradicional
    //    porque precisamos do INDICE (0, 1, 2...) para os botões
    //    de Editar e Excluir saberem em qual aluno estão agindo.
    for (let i = 0; i < alunos.length; i++) {
        const aluno = alunos[i];

        // Monta o HTML de UM aluno como uma string e concatena na div.
        // Note os "data-indice" — eles guardam o índice do aluno
        // dentro do próprio botão para sabermos qual aluno editar/excluir.
        divLista.innerHTML += `
            <div class="item">
                <div class="item-dados">
                    <strong>${aluno.nome}</strong> — matrícula: ${aluno.matricula}
                </div>
                <div class="item-acoes">
                    <button class="editar"  data-indice="${i}">Editar</button>
                    <button class="excluir" data-indice="${i}">Excluir</button>
                </div>
            </div>
        `;
    }

    // 4) Depois que os botões foram criados (acima), precisamos
    //    conectar o evento de clique a CADA UM deles. Como eles
    //    só nasceram agora (pelo innerHTML), o addEventListener
    //    tem que ser feito DEPOIS de eles aparecerem na tela.
    conectarBotoesDeCadaAluno();
};


/* =========================================================
   PARTE 5 — CONECTAR OS BOTOES DE EDITAR E EXCLUIR
   ---------------------------------------------------------
   document.querySelectorAll(".classe") devolve TODOS os
   elementos com aquela classe (um "NodeList", parecido com
   um vetor). Usamos for...of para passar por cada um e
   conectar um evento de clique.
   ========================================================= */

const conectarBotoesDeCadaAluno = () => {

    const botoesEditar  = document.querySelectorAll(".item-acoes .editar");
    const botoesExcluir = document.querySelectorAll(".item-acoes .excluir");

    for (const botao of botoesEditar) {
        botao.addEventListener("click", () => {
            // Pega o índice que ficou guardado no atributo data-indice.
            // Como ele vem como texto, convertemos para número com parseInt.
            const indice = parseInt(botao.dataset.indice);
            entrarModoEdicao(indice);
        });
    }

    for (const botao of botoesExcluir) {
        botao.addEventListener("click", () => {
            const indice = parseInt(botao.dataset.indice);
            excluirAluno(indice);
        });
    }
};


/* =========================================================
   PARTE 6 — CREATE (Criar) e UPDATE (Atualizar)
   ---------------------------------------------------------
   Os dois cabem no MESMO botão "Salvar". A diferença é:
     - se indiceEditando é null  -> criamos um aluno novo (push)
     - se tem um número          -> substituímos o aluno daquela
                                    posição pelo conteúdo do form
   ========================================================= */

btnSalvar.addEventListener("click", () => {

    // 1) Pega o que o usuário digitou e tira espaços das pontas.
    const nome      = inputNome.value.trim();
    const matricula = inputMatricula.value.trim();

    // 2) Validação simples: nenhum campo pode estar vazio.
    if (nome === "" || matricula === "") {
        alert("Preencha nome e matrícula antes de salvar.");
        return; // sai da função sem fazer nada
    }

    // 3) Monta o objeto que representa um aluno.
    const aluno = {
        nome: nome,
        matricula: matricula
    };

    // 4) Decide se é CREATE ou UPDATE.
    if (indiceEditando === null) {
        // CREATE: adiciona no final do vetor.
        alunos.push(aluno);
    } else {
        // UPDATE: substitui o aluno que está naquela posição.
        alunos[indiceEditando] = aluno;
    }

    // 5) Persiste no localStorage e atualiza a tela.
    salvarNoStorage();
    mostraAlunos();
    limparFormulario();
});


/* =========================================================
   PARTE 7 — DELETE (Excluir)
   ---------------------------------------------------------
   splice(indice, 1) remove 1 item do vetor a partir daquele índice.
   ========================================================= */

const excluirAluno = (indice) => {
    // Pede confirmação antes de apagar. É uma boa prática.
    const confirmar = confirm(`Excluir o aluno "${alunos[indice].nome}"?`);
    if (!confirmar) return;

    alunos.splice(indice, 1);

    // Se o usuário estava editando justamente o aluno que foi excluído,
    // saímos do modo edição para evitar bug.
    if (indiceEditando === indice) {
        sairModoEdicao();
    }

    salvarNoStorage();
    mostraAlunos();
};


/* =========================================================
   PARTE 8 — MODO EDICAO (auxiliares do Update)
   ---------------------------------------------------------
   Quando o usuário clica em "Editar":
     - copiamos os dados do aluno para os inputs
     - guardamos o índice na variável indiceEditando
     - trocamos o título do form e mostramos o botão Cancelar
   ========================================================= */

const entrarModoEdicao = (indice) => {
    const aluno = alunos[indice];

    inputNome.value      = aluno.nome;
    inputMatricula.value = aluno.matricula;

    indiceEditando = indice;

    tituloForm.textContent = "Editando aluno";
    btnSalvar.textContent  = "Atualizar";
    btnCancelar.classList.remove("escondido");

    // Leva o usuário até o formulário (útil em telas pequenas).
    inputNome.focus();
};

const sairModoEdicao = () => {
    indiceEditando = null;
    tituloForm.textContent = "Novo aluno";
    btnSalvar.textContent  = "Salvar";
    btnCancelar.classList.add("escondido");
};

const limparFormulario = () => {
    inputNome.value      = "";
    inputMatricula.value = "";
    sairModoEdicao();
};

btnCancelar.addEventListener("click", () => {
    limparFormulario();
});


/* =========================================================
   PARTE 9 — INICIALIZACAO
   ---------------------------------------------------------
   Quando o JS termina de ser lido, executamos essas duas
   linhas para começar com a lista já carregada do storage.
   ========================================================= */

carregarDoStorage();
mostraAlunos();
