const pesquisa = document.getElementById("pesquisa");
const filtroGenero = document.getElementById("filtroGenero");

async function carregarFilmes() {
    const resposta = await fetch("http://localhost:8080/filmes");
    const filmes = await resposta.json();

    carregarBanner(filmes);

    const textoPesquisa = pesquisa.value.toLowerCase();
    const generoSelecionado = filtroGenero.value;

    const filmesFiltrados = filmes.filter(filme => {
        const passouPesquisa = filme.titulo.toLowerCase().includes(textoPesquisa);

        const passouGenero =
            generoSelecionado === "" ||
            filme.genero === generoSelecionado;

        return passouPesquisa && passouGenero;
    });

    const lista = document.getElementById("listaFilmes");
    lista.innerHTML = "";

    filmesFiltrados.forEach(filme => {
        lista.innerHTML += `
            <div class="card" onclick="verDetalhes(${filme.id})">
                <img 
                    src="${filme.imagem || 'https://placehold.co/300x450?text=Sem+Imagem'}" 
                    alt="${filme.titulo}"
                >

                <div class="card-info">
                    <h3>${filme.titulo}</h3>
                    <p>⭐ ${filme.nota ?? 0}/10</p>
                    <p>📅 ${filme.anoLancamento ?? ""}</p>

                    <button class="btn-card">
                        Ver detalhes →
                    </button>
                </div>
            </div>
        `;
    });
}

function carregarBanner(filmes) {
    if (filmes.length === 0) return;

    const filmeDestaque = filmes.reduce((maior, filme) => {
        return (filme.nota ?? 0) > (maior.nota ?? 0) ? filme : maior;
    });

    const hero = document.querySelector(".hero");

    hero.style.backgroundImage = `
        linear-gradient(
            to right,
            rgba(0,0,0,.95),
            rgba(0,0,0,.75),
            rgba(0,0,0,.35)
        ),
        url('${filmeDestaque.banner || filmeDestaque.imagem || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600"}')
    `;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";

    document.querySelector(".hero-content").innerHTML = `
        <h2>${filmeDestaque.titulo}</h2>

        <p>${filmeDestaque.descricao ?? "Filme em destaque no MovieFlix."}</p>

        <p>
            ⭐ ${filmeDestaque.nota ?? 0}/10
            • 📅 ${filmeDestaque.anoLancamento ?? ""}
            • 🎭 ${filmeDestaque.genero ?? ""}
        </p>

        <button class="btn-explorar" onclick="verDetalhes(${filmeDestaque.id})">
            ▶ Ver detalhes
        </button>
    `;
}

function verDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}

pesquisa.addEventListener("input", carregarFilmes);
filtroGenero.addEventListener("change", carregarFilmes);

carregarFilmes();