const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

async function carregarDetalhes() {
    const resposta = await fetch(`http://localhost:8080/filmes/${id}`);
    const filme = await resposta.json();

    document.getElementById("detalhesFilme").innerHTML = `
        <section class="detalhes-container">
            <img
                class="poster-detalhes"
                src="${filme.imagem || 'https://placehold.co/300x450?text=Sem+Imagem'}"
                alt="${filme.titulo}"
            >

            <div class="info-detalhes">
                <h1>${filme.titulo}</h1>

                <p class="nota">⭐ ${filme.nota ?? 0}/10</p>

                <p>${filme.descricao ?? "Sem descrição disponível."}</p>

                <p><strong>🎭 Gênero:</strong> ${filme.genero ?? ""}</p>
                <p><strong>🎬 Diretor:</strong> ${filme.diretor ?? ""}</p>
                <p><strong>📅 Ano:</strong> ${filme.anoLancamento ?? ""}</p>
                <p><strong>⏱ Duração:</strong> ${filme.duracao ?? ""} min</p>

                <button class="btn-trailer">
                    ▶ Assistir Trailer
                </button>
            </div>
        </section>
    `;
}

carregarDetalhes();