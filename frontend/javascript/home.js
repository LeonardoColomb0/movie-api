const pesquisa = document.getElementById("pesquisa");
const filtroGenero = document.getElementById("filtroGenero");

// LISTAR FILMES PARA CLIENTE
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

                <p>
                    <strong>Avaliação:</strong><br>
                    ${"⭐".repeat(Math.max(1, Math.round((filme.nota ?? 0) / 2)))}
                    (${filme.nota ?? 0}/10)
                </p>

                <button onclick="verDetalhes(${filme.id})">
                    Ver detalhes
                </button>
            </div>
        `;
    });
}

// VER DETALHES
function verDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}

// EVENTOS
pesquisa.addEventListener("input", carregarFilmes);
filtroGenero.addEventListener("change", carregarFilmes);

// CARREGAR AO ABRIR
carregarFilmes();