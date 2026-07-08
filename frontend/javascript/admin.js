let filmeEditando = null;

const formulario = document.getElementById("filmeForm");
const pesquisa = document.getElementById("pesquisa");
const filtroGenero = document.getElementById("filtroGenero");
const botaoBuscarTmdb = document.getElementById("buscarTmdb");

const API_KEY_TMDB = "SUA_CHAVE_TMDB_AQUI";

// CADASTRAR OU EDITAR
formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    let nota = null;

    if (document.getElementById("nota").value !== "") {
        nota = Number(document.getElementById("nota").value);

        if (nota < 0 || nota > 10) {
            alert("Valor inválido! A nota deve ser entre 0 e 10.");
            return;
        }
    }

    const filme = {
        titulo: document.getElementById("titulo").value || "",
        descricao: document.getElementById("descricao").value || "",
        genero: document.getElementById("genero").value || "Outro",
        diretor: document.getElementById("diretor").value || "",
        imagem: document.getElementById("imagem").value || "",
        banner: document.getElementById("banner").value || "",
        anoLancamento: document.getElementById("anoLancamento").value
            ? Number(document.getElementById("anoLancamento").value)
            : null,
        duracao: document.getElementById("duracao").value
            ? Number(document.getElementById("duracao").value)
            : null,
        nota: nota
    };

    const url = filmeEditando
        ? `http://localhost:8080/filmes/${filmeEditando}`
        : "http://localhost:8080/filmes";

    const metodo = filmeEditando ? "PUT" : "POST";

    const resposta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filme)
    });

    if (resposta.ok) {
        alert(filmeEditando ? "Filme atualizado!" : "Filme cadastrado!");

        formulario.reset();
        filmeEditando = null;
        carregarFilmes();
    } else {
        console.log(await resposta.text());
        alert("Erro ao salvar.");
    }
});

// LISTAR FILMES
async function carregarFilmes() {
    const resposta = await fetch("http://localhost:8080/filmes");
    const filmes = await resposta.json();

    const textoPesquisa = pesquisa.value.toLowerCase();
    const generoSelecionado = filtroGenero.value;

    const filmesFiltrados = filmes.filter(filme => {
        const passouPesquisa = filme.titulo
            .toLowerCase()
            .includes(textoPesquisa);

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
                    src="${filme.imagem || 'https://placehold.co/300x450?text=Sem+Imagem'}"
                    alt="${filme.titulo}"
                    style="
                        width:100%;
                        height:350px;
                        object-fit:cover;
                        border-radius:10px;
                        margin-bottom:15px;
                    "
                >

                <h3>${filme.titulo}</h3>

                <p><strong>Descrição:</strong> ${filme.descricao ?? ""}</p>
                <p><strong>Gênero:</strong> ${filme.genero ?? ""}</p>
                <p><strong>Diretor:</strong> ${filme.diretor ?? ""}</p>
                <p><strong>Ano:</strong> ${filme.anoLancamento ?? ""}</p>
                <p><strong>Duração:</strong> ${filme.duracao ?? ""} min</p>
                <p><strong>Nota:</strong> ${filme.nota ?? 0}/10</p>

                <div class="acoes">
                    <button class="btn-editar" onclick="editarFilme(${filme.id})">
                        ✏️ Editar
                    </button>

                    <button class="btn-excluir" onclick="deletarFilme(${filme.id})">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        `;
    });
}

// EDITAR
async function editarFilme(id) {
    const resposta = await fetch(`http://localhost:8080/filmes/${id}`);
    const filme = await resposta.json();

    document.getElementById("titulo").value = filme.titulo ?? "";
    document.getElementById("descricao").value = filme.descricao ?? "";
    document.getElementById("genero").value = filme.genero ?? "Outro";
    document.getElementById("diretor").value = filme.diretor ?? "";
    document.getElementById("imagem").value = filme.imagem ?? "";
    document.getElementById("banner").value = filme.banner ?? "";
    document.getElementById("anoLancamento").value = filme.anoLancamento ?? "";
    document.getElementById("duracao").value = filme.duracao ?? "";
    document.getElementById("nota").value = filme.nota ?? "";

    filmeEditando = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// DELETAR
async function deletarFilme(id) {
    const confirmar = confirm("Deseja realmente excluir este filme?");

    if (!confirmar) return;

    const resposta = await fetch(`http://localhost:8080/filmes/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {
        alert("Filme excluído com sucesso!");
        carregarFilmes();
    } else {
        alert("Erro ao excluir.");
    }
}

// BUSCAR NA TMDB
botaoBuscarTmdb.addEventListener("click", async function () {
    const titulo = document.getElementById("titulo").value;

    if (!titulo) {
        alert("Digite o título do filme primeiro.");
        return;
    }

    const resposta = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_TMDB}&language=pt-BR&query=${encodeURIComponent(titulo)}`
    );

    const dados = await resposta.json();

    if (!dados.results || dados.results.length === 0) {
        alert("Filme não encontrado.");
        return;
    }

    const filme = dados.results[0];

    document.getElementById("titulo").value = filme.title || "";
    document.getElementById("descricao").value = filme.overview || "";
    document.getElementById("genero").value = "Outro";
    document.getElementById("diretor").value = "";
    document.getElementById("duracao").value = "";

    document.getElementById("anoLancamento").value = filme.release_date
        ? filme.release_date.substring(0, 4)
        : "";

    document.getElementById("nota").value = filme.vote_average
        ? filme.vote_average.toFixed(1)
        : "";

    document.getElementById("imagem").value = filme.poster_path
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
        : "";

    document.getElementById("banner").value = filme.backdrop_path
        ? `https://image.tmdb.org/t/p/original${filme.backdrop_path}`
        : "";

    alert("Informações carregadas!");
});

// EVENTOS
pesquisa.addEventListener("input", carregarFilmes);
filtroGenero.addEventListener("change", carregarFilmes);

// CARREGAR AO ABRIR
carregarFilmes();