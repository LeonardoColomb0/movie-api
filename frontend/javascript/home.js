const pesquisa = document.getElementById("pesquisa");
const filtroGenero = document.getElementById("filtroGenero");

const listaFilmes = document.getElementById("listaFilmes");
const setaEsquerda = document.getElementById("setaEsquerda");
const setaDireita = document.getElementById("setaDireita");

const destaqueAnterior =
    document.getElementById("destaqueAnterior");

const destaqueProximo =
    document.getElementById("destaqueProximo");

const indicadoresDestaque =
    document.getElementById("indicadoresDestaque");

const API_FILMES = "http://localhost:8080/filmes";

const TEMPO_DESTAQUE = 10000;

let filmesCarregados = [];
let filmesDoDestaque = [];

let indiceDestaque = 0;
let intervaloDestaque = null;

// ================= CARREGAR FILMES =================

async function carregarFilmes() {
    try {
        const resposta = await fetch(API_FILMES);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os filmes.");
        }

        filmesCarregados = await resposta.json();

        prepararDestaques(filmesCarregados);
        renderizarCatalogo();

    } catch (erro) {
        console.error(erro);

        listaFilmes.innerHTML = `
            <p>Não foi possível carregar os filmes.</p>
        `;
    }
}

// ================= CATÁLOGO =================

function renderizarCatalogo() {
    const textoPesquisa =
        pesquisa.value.trim().toLowerCase();

    const generoSelecionado =
        filtroGenero.value;

    const filmesFiltrados =
        filmesCarregados.filter(filme => {

            const titulo =
                filme.titulo?.toLowerCase() || "";

            const passouPesquisa =
                titulo.includes(textoPesquisa);

            const passouGenero =
                generoSelecionado === "" ||
                filme.genero === generoSelecionado;

            return passouPesquisa && passouGenero;
        });

    listaFilmes.innerHTML = "";

    filmesFiltrados.forEach(filme => {

        const imagemPoster =
            filme.imagem || "../img/poster-default.png";

        listaFilmes.innerHTML += `
            <div
                class="card"
                onclick="verDetalhes(${filme.id})"
            >
                <img
                    src="${imagemPoster}"
                    alt="${filme.titulo || "Filme"}"
                >

                <div class="card-info">
                    <h3>${filme.titulo || ""}</h3>

                    <p>
                        ⭐ ${filme.nota ?? 0}/10
                    </p>

                    <p>
                        📅 ${filme.anoLancamento ?? ""}
                    </p>

                    <button class="btn-card">
                        Ver detalhes →
                    </button>
                </div>
            </div>
        `;
    });

    listaFilmes.scrollLeft = 0;

    setTimeout(atualizarSetasCatalogo, 50);
}

// ================= DESTAQUES =================

function prepararDestaques(filmes) {
    if (!filmes || filmes.length === 0) {
        return;
    }

    filmesDoDestaque = filmes.filter(filme => {
        return filme.banner || filme.imagem;
    });

    if (filmesDoDestaque.length === 0) {
        filmesDoDestaque = filmes;
    }

    indiceDestaque = Math.floor(
        Math.random() * filmesDoDestaque.length
    );

    criarIndicadores();
    exibirDestaque(indiceDestaque);
    iniciarTrocaAutomatica();
}

function criarIndicadores() {
    indicadoresDestaque.innerHTML = "";

    filmesDoDestaque.forEach((filme, indice) => {

        const ponto = document.createElement("button");

        ponto.type = "button";
        ponto.className = "ponto-destaque";

        ponto.setAttribute(
            "aria-label",
            `Mostrar ${filme.titulo}`
        );

        ponto.addEventListener("click", function () {
            irParaDestaque(indice);
        });

        indicadoresDestaque.appendChild(ponto);
    });

    atualizarIndicadores();
}

function atualizarIndicadores() {
    const pontos =
        indicadoresDestaque.querySelectorAll(
            ".ponto-destaque"
        );

    pontos.forEach((ponto, indice) => {
        ponto.classList.toggle(
            "ativo",
            indice === indiceDestaque
        );
    });
}

function exibirDestaque(indice) {
    if (filmesDoDestaque.length === 0) {
        return;
    }

    const filmeDestaque =
        filmesDoDestaque[indice];

    const imagemBanner =
        filmeDestaque.banner ||
        filmeDestaque.imagem ||
        "../img/banner-default.jpg";

    const hero =
        document.querySelector(".hero");

    const heroContent =
        document.querySelector(".hero-content");

    heroContent.classList.add("trocando");

    setTimeout(() => {

        hero.style.backgroundImage =
            `url('${imagemBanner}')`;

        let tituloOuLogo;

        if (filmeDestaque.logo) {
            tituloOuLogo = `
                <img
                    class="logo-filme"
                    src="${filmeDestaque.logo}"
                    alt="${filmeDestaque.titulo}"
                >
            `;
        } else {
            tituloOuLogo = `
                <h2>${filmeDestaque.titulo}</h2>
            `;
        }

        heroContent.innerHTML = `
            ${tituloOuLogo}

            <p>
                ${
                    filmeDestaque.descricao ||
                    "Filme em destaque no MovieFlix."
                }
            </p>

            <p>
                ⭐ ${filmeDestaque.nota ?? 0}/10
                • 📅 ${filmeDestaque.anoLancamento ?? ""}
                • 🎭 ${filmeDestaque.genero ?? ""}
            </p>

            <button
                class="btn-explorar"
                onclick="verDetalhes(${filmeDestaque.id})"
            >
                ▶ Ver detalhes
            </button>
        `;

        atualizarIndicadores();

        heroContent.classList.remove("trocando");

    }, 300);
}

function irParaDestaque(indice) {
    if (
        indice < 0 ||
        indice >= filmesDoDestaque.length
    ) {
        return;
    }

    indiceDestaque = indice;

    exibirDestaque(indiceDestaque);
    iniciarTrocaAutomatica();
}

function mostrarProximoDestaque() {
    if (filmesDoDestaque.length <= 1) {
        return;
    }

    indiceDestaque =
        (indiceDestaque + 1) %
        filmesDoDestaque.length;

    exibirDestaque(indiceDestaque);
}

function mostrarDestaqueAnterior() {
    if (filmesDoDestaque.length <= 1) {
        return;
    }

    indiceDestaque =
        (
            indiceDestaque -
            1 +
            filmesDoDestaque.length
        ) % filmesDoDestaque.length;

    exibirDestaque(indiceDestaque);
}

function iniciarTrocaAutomatica() {
    pararTrocaAutomatica();

    intervaloDestaque = setInterval(() => {
        mostrarProximoDestaque();
    }, TEMPO_DESTAQUE);
}

function pararTrocaAutomatica() {
    if (intervaloDestaque !== null) {
        clearInterval(intervaloDestaque);
        intervaloDestaque = null;
    }
}

function proximoDestaqueManual() {
    mostrarProximoDestaque();
    iniciarTrocaAutomatica();
}

function destaqueAnteriorManual() {
    mostrarDestaqueAnterior();
    iniciarTrocaAutomatica();
}

// ================= ROLAGEM DO CATÁLOGO =================

function rolarCatalogo(direcao) {
    const distancia =
        Math.max(
            listaFilmes.clientWidth * 0.8,
            600
        );

    listaFilmes.scrollBy({
        left: direcao * distancia,
        behavior: "smooth"
    });
}

function atualizarSetasCatalogo() {
    const limiteDireita =
        listaFilmes.scrollWidth -
        listaFilmes.clientWidth;

    setaEsquerda.style.visibility =
        listaFilmes.scrollLeft > 5
            ? "visible"
            : "hidden";

    setaDireita.style.visibility =
        listaFilmes.scrollLeft <
        limiteDireita - 5
            ? "visible"
            : "hidden";
}

// ================= NAVEGAÇÃO =================

function verDetalhes(id) {
    window.location.href =
        `detalhes.html?id=${id}`;
}

// ================= EVENTOS =================

destaqueAnterior.addEventListener(
    "click",
    destaqueAnteriorManual
);

destaqueProximo.addEventListener(
    "click",
    proximoDestaqueManual
);

setaEsquerda.addEventListener(
    "click",
    function () {
        rolarCatalogo(-1);
    }
);

setaDireita.addEventListener(
    "click",
    function () {
        rolarCatalogo(1);
    }
);

listaFilmes.addEventListener(
    "scroll",
    atualizarSetasCatalogo
);

pesquisa.addEventListener(
    "input",
    renderizarCatalogo
);

filtroGenero.addEventListener(
    "change",
    renderizarCatalogo
);

window.addEventListener(
    "resize",
    atualizarSetasCatalogo
);

// ================= INICIAR =================

carregarFilmes();