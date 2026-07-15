// ================= LOGIN =================

const adminLogado =
    localStorage.getItem("movieflixAdminLogado");

if (adminLogado !== "true") {

    alert("Faça login como administrador.");

    window.location.href = "login.html";
}
let filmeEditando = null;

const formulario = document.getElementById("filmeForm");
const pesquisa = document.getElementById("pesquisa");
const filtroGenero = document.getElementById("filtroGenero");
const botaoBuscarTmdb = document.getElementById("buscarTmdb");

const API_FILMES = "http://localhost:8080/filmes";
const API_TMDB = "http://localhost:8080/tmdb";

// CONVERTE OS GÊNEROS DA TMDB PARA OS GÊNEROS DO MOVIEFLIX
function converterGenero(generoTmdb) {
    const mapaGeneros = {
        "Action": "Ação",
        "Ação": "Ação",

        "Adventure": "Aventura",
        "Aventura": "Aventura",

        "Comedy": "Comédia",
        "Comédia": "Comédia",

        "Drama": "Drama",

        "Science Fiction": "Ficção",
        "Ficção científica": "Ficção",
        "Ficção Científica": "Ficção",

        "Horror": "Terror",
        "Terror": "Terror",

        "Romance": "Romance",

        "Thriller": "Suspense",
        "Suspense": "Suspense",

        "Mystery": "Suspense",
        "Mistério": "Suspense",

        "Animation": "Animação",
        "Animação": "Animação",

        "Documentary": "Documentário",
        "Documentário": "Documentário",

        "Fantasy": "Aventura",
        "Fantasia": "Aventura",

        "Crime": "Ação",

        "Family": "Outro",
        "Família": "Outro",

        "History": "Drama",
        "História": "Drama",

        "War": "Ação",
        "Guerra": "Ação",

        "Music": "Outro",
        "Música": "Outro",

        "Western": "Outro",
        "TV Movie": "Outro"
    };

    return mapaGeneros[generoTmdb] || "Outro";
}

// CADASTRAR OU EDITAR
formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const notaInput = document.getElementById("nota").value;
    const nota = notaInput !== "" ? Number(notaInput) : null;

    if (nota !== null && (nota < 0 || nota > 10)) {
        alert("Valor inválido! A nota deve ser entre 0 e 10.");
        return;
    }

    const filme = {
        titulo: document.getElementById("titulo").value || "",
        descricao: document.getElementById("descricao").value || "",
        genero: document.getElementById("genero").value || "Outro",
        diretor: document.getElementById("diretor").value || "",
        imagem: document.getElementById("imagem").value || "",
        banner: document.getElementById("banner").value || "",
        logo: document.getElementById("logo").value || "",
        trailer: document.getElementById("trailer").value || "",

        anoLancamento: document.getElementById("anoLancamento").value
            ? Number(document.getElementById("anoLancamento").value)
            : null,

        duracao: document.getElementById("duracao").value
            ? Number(document.getElementById("duracao").value)
            : null,

        nota: nota
    };

    const url = filmeEditando
        ? `${API_FILMES}/${filmeEditando}`
        : API_FILMES;

    const metodo = filmeEditando ? "PUT" : "POST";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filme)
        });

        if (resposta.ok) {
            alert(
                filmeEditando
                    ? "Filme atualizado!"
                    : "Filme cadastrado!"
            );

            formulario.reset();
            filmeEditando = null;

            await carregarFilmes();
        } else {
            const erro = await resposta.text();

            console.error(erro);
            alert("Erro ao salvar o filme.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar com a API.");
    }
});

// LISTAR FILMES
async function carregarFilmes() {
    try {
        const resposta = await fetch(API_FILMES);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os filmes.");
        }

        const filmes = await resposta.json();

        const textoPesquisa = pesquisa.value.toLowerCase();
        const generoSelecionado = filtroGenero.value;

        const filmesFiltrados = filmes.filter(filme => {
            const titulo = filme.titulo?.toLowerCase() || "";

            const passouPesquisa =
                titulo.includes(textoPesquisa);

            const passouGenero =
                generoSelecionado === "" ||
                filme.genero === generoSelecionado;

            return passouPesquisa && passouGenero;
        });

        const lista = document.getElementById("listaFilmes");

        lista.innerHTML = "";

        filmesFiltrados.forEach(filme => {
            lista.innerHTML += `
                <div class="card">
                    <img
                        src="${filme.imagem || "../img/poster-default.png"}"
                        alt="${filme.titulo || "Filme"}"
                        style="
                            width: 100%;
                            height: 350px;
                            object-fit: cover;
                            border-radius: 10px;
                            margin-bottom: 15px;
                        "
                    >

                    <h3>${filme.titulo || ""}</h3>

                    <p>
                        <strong>Descrição:</strong>
                        ${filme.descricao ?? ""}
                    </p>

                    <p>
                        <strong>Gênero:</strong>
                        ${filme.genero ?? ""}
                    </p>

                    <p>
                        <strong>Diretor:</strong>
                        ${filme.diretor ?? ""}
                    </p>

                    <p>
                        <strong>Ano:</strong>
                        ${filme.anoLancamento ?? ""}
                    </p>

                    <p>
                        <strong>Duração:</strong>
                        ${filme.duracao ?? ""} min
                    </p>

                    <p>
                        <strong>Nota:</strong>
                        ${filme.nota ?? 0}/10
                    </p>

                    <p>
                        <strong>Trailer:</strong>
                        ${filme.trailer ? "Disponível" : "Não informado"}
                    </p>

                    <div class="acoes">
                        <button
                            class="btn-editar"
                            onclick="editarFilme(${filme.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="deletarFilme(${filme.id})"
                        >
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar os filmes.");
    }
}

// EDITAR
async function editarFilme(id) {
    try {
        const resposta = await fetch(`${API_FILMES}/${id}`);

        if (!resposta.ok) {
            throw new Error("Filme não encontrado.");
        }

        const filme = await resposta.json();

        document.getElementById("titulo").value =
            filme.titulo ?? "";

        document.getElementById("descricao").value =
            filme.descricao ?? "";

        document.getElementById("genero").value =
            converterGenero(filme.genero);

        document.getElementById("diretor").value =
            filme.diretor ?? "";

        document.getElementById("imagem").value =
            filme.imagem ?? "";

        document.getElementById("banner").value =
            filme.banner ?? "";

        document.getElementById("logo").value =
            filme.logo ?? "";

        document.getElementById("trailer").value =
            filme.trailer ?? "";

        document.getElementById("anoLancamento").value =
            filme.anoLancamento ?? "";

        document.getElementById("duracao").value =
            filme.duracao ?? "";

        document.getElementById("nota").value =
            filme.nota ?? "";

        filmeEditando = id;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar o filme para edição.");
    }
}

// DELETAR
async function deletarFilme(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este filme?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_FILMES}/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            alert("Filme excluído com sucesso!");
            await carregarFilmes();
        } else {
            alert("Erro ao excluir o filme.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar com a API.");
    }
}

// BUSCAR NA TMDB PELO BACKEND
botaoBuscarTmdb.addEventListener("click", async function () {
    const titulo = document.getElementById("titulo").value.trim();

    if (!titulo) {
        alert("Digite o título do filme primeiro.");
        return;
    }

    try {
        const resposta = await fetch(
            `${API_TMDB}?titulo=${encodeURIComponent(titulo)}`
        );

        if (!resposta.ok) {
            alert("Filme não encontrado na TMDB.");
            return;
        }

        const filme = await resposta.json();

        document.getElementById("titulo").value =
            filme.titulo ?? "";

        document.getElementById("descricao").value =
            filme.descricao ?? "";

        document.getElementById("genero").value =
            converterGenero(filme.genero);

        document.getElementById("diretor").value =
            filme.diretor ?? "";

        document.getElementById("duracao").value =
            filme.duracao ?? "";

        document.getElementById("anoLancamento").value =
            filme.anoLancamento ?? "";

        document.getElementById("nota").value =
            filme.nota !== null && filme.nota !== undefined
                ? Number(filme.nota).toFixed(1)
                : "";

        document.getElementById("imagem").value =
            filme.imagem ?? "";

        document.getElementById("banner").value =
            filme.banner ?? "";

        document.getElementById("logo").value =
            filme.logo ?? "";

        document.getElementById("trailer").value =
            filme.trailer ?? "";

        alert("Informações da TMDB carregadas!");
    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar informações na TMDB.");
    }
});

// EVENTOS
pesquisa.addEventListener("input", carregarFilmes);
filtroGenero.addEventListener("change", carregarFilmes);

// CARREGAR AO ABRIR
carregarFilmes();
const btnLogout =
    document.getElementById("btnLogout");

btnLogout.addEventListener("click", () => {

    localStorage.removeItem("movieflixAdminLogado");

    window.location.href = "login.html";

});