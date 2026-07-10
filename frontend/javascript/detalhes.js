const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

async function carregarDetalhes() {
    const resposta = await fetch(`http://localhost:8080/filmes/${id}`);
    const filme = await resposta.json();

    const poster = filme.imagem || "../img/poster-default.png";
    const banner = filme.banner || "../img/banner-default.jpg";

    document.getElementById("detalhesFilme").innerHTML = `
        <section 
            class="hero-detalhes" 
            style="background-image: url('${banner}')"
        >
            <div class="detalhes-container">
                <img
                    class="poster-detalhes"
                    src="${poster}"
                    alt="${filme.titulo}"
                >

                <div class="info-detalhes">
                    <h1>${filme.titulo}</h1>

                    <p class="nota">
                        ⭐ ${filme.nota ?? 0}/10 
                        • 📅 ${filme.anoLancamento ?? ""}
                        • 🎭 ${filme.genero ?? ""}
                    </p>

                    <p>${filme.descricao ?? "Sem descrição disponível."}</p>

                    <p><strong>🎬 Diretor:</strong> ${filme.diretor ?? "Não informado"}</p>
                    <p><strong>⏱ Duração:</strong> ${filme.duracao ?? ""} min</p>

                    <button class="btn-trailer">
                        ▶ Assistir Trailer
                    </button>
                </div>
            </div>
        </section>
    `;
}

carregarDetalhes();