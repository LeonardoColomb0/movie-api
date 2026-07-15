const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

async function carregarDetalhes() {
    try {
        const resposta = await fetch(`http://localhost:8080/filmes/${id}`);

        if (!resposta.ok) {
            throw new Error("Filme não encontrado.");
        }

        const filme = await resposta.json();

        const poster = filme.imagem || "../img/poster-default.png";
        const banner = filme.banner || "../img/banner-default.jpg";

        let tituloOuLogo;

        if (filme.logo) {
            tituloOuLogo = `
                <img
                    src="${filme.logo}"
                    alt="${filme.titulo}"
                    class="logo-filme-detalhes"
                >
            `;
        } else {
            tituloOuLogo = `
                <h1>${filme.titulo}</h1>
            `;
        }

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

                        ${tituloOuLogo}

                        <p class="nota">
                            ⭐ ${filme.nota ?? 0}/10
                            • 📅 ${filme.anoLancamento ?? ""}
                            • 🎭 ${filme.genero ?? ""}
                        </p>

                        <p>
                            ${filme.descricao ?? "Sem descrição disponível."}
                        </p>

                        <p>
                            <strong>🎬 Diretor:</strong>
                            ${filme.diretor || "Não informado"}
                        </p>

                        <p>
                            <strong>⏱ Duração:</strong>
                            ${filme.duracao ? `${filme.duracao} min` : "Não informada"}
                        </p>

                        <button
    class="btn-trailer"
    onclick="abrirTrailer('${filme.trailer ?? ""}')"
>
    ▶ Assistir Trailer
</button>

                    </div>

                </div>
            </section>
        `;
    } catch (erro) {
        console.error(erro);

        document.getElementById("detalhesFilme").innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar os detalhes do filme.
            </p>
        `;
    }
}
function abrirTrailer(url) {
    if (!url) {
        alert("Trailer não disponível para este filme.");
        return;
    }

    window.open(url, "_blank");
}

carregarDetalhes();