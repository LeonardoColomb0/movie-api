package com.leonardo.movie_api.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.leonardo.movie_api.dto.TmdbFilmeDTO;

@Service
public class TmdbService {

    @Value("${tmdb.api.token}")
    private String token;

    @Value("${tmdb.api.url}")
    private String apiUrl;

    @Value("${tmdb.image.url}")
    private String imageUrl;

    private final RestClient restClient = RestClient.create();

    public TmdbFilmeDTO buscarFilmePorTitulo(String titulo) {

        // ==========================
        // 1 - PESQUISA O FILME
        // ==========================

        Map respostaBusca = restClient.get()
                .uri(apiUrl + "/search/movie?query=" + titulo + "&language=pt-BR")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(Map.class);

        List resultados = (List) respostaBusca.get("results");

        if (resultados == null || resultados.isEmpty()) {
            return null;
        }

        Map primeiroFilme = (Map) resultados.get(0);

        Integer idFilme = (Integer) primeiroFilme.get("id");

        // ==========================
        // 2 - BUSCA DETALHES COMPLETOS
        // ==========================

        Map detalhes = restClient.get()
                .uri(apiUrl + "/movie/" + idFilme + "?language=pt-BR")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(Map.class);

        String tituloFilme = (String) detalhes.get("title");
        String descricao = (String) detalhes.get("overview");

        String dataLancamento = (String) detalhes.get("release_date");

        Integer anoLancamento = null;

        if (dataLancamento != null && dataLancamento.length() >= 4) {
            anoLancamento = Integer.parseInt(dataLancamento.substring(0, 4));
        }

        Double nota = detalhes.get("vote_average") != null
                ? Double.parseDouble(detalhes.get("vote_average").toString())
                : null;

        Integer duracao = detalhes.get("runtime") != null
                ? Integer.parseInt(detalhes.get("runtime").toString())
                : null;

        String genero = "Outro";

        List generos = (List) detalhes.get("genres");

        if (generos != null && !generos.isEmpty()) {
            Map primeiroGenero = (Map) generos.get(0);
            genero = (String) primeiroGenero.get("name");
        }

        String posterPath = (String) detalhes.get("poster_path");
        String bannerPath = (String) detalhes.get("backdrop_path");

        String imagem = posterPath != null
                ? imageUrl + "/w500" + posterPath
                : null;

        String banner = bannerPath != null
                ? imageUrl + "/original" + bannerPath
                : null;

        // ==========================
        // 3 - BUSCA O DIRETOR
        // ==========================

        Map creditos = restClient.get()
                .uri(apiUrl + "/movie/" + idFilme + "/credits?language=pt-BR")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(Map.class);

        String diretor = "";

        List equipe = (List) creditos.get("crew");

        if (equipe != null && !equipe.isEmpty()) {
            for (Object obj : equipe) {
                Map pessoa = (Map) obj;

                String cargo = (String) pessoa.get("job");

                if ("Director".equals(cargo)) {
                    diretor = (String) pessoa.get("name");
                    break;
                }
            }
        }

        // ==========================
        // 4 - BUSCA AS LOGOS
        // ==========================

        Map imagens = restClient.get()
                .uri(apiUrl + "/movie/" + idFilme
                        + "/images?include_image_language=pt,en,null")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(Map.class);

        String logo = null;

        List logos = (List) imagens.get("logos");

        if (logos != null && !logos.isEmpty()) {

            Map logoEscolhida = null;

            for (Object obj : logos) {
                Map logoAtual = (Map) obj;

                String idioma = (String) logoAtual.get("iso_639_1");

                if ("pt".equals(idioma)) {
                    logoEscolhida = logoAtual;
                    break;
                }
            }

            if (logoEscolhida == null) {
                for (Object obj : logos) {
                    Map logoAtual = (Map) obj;

                    String idioma = (String) logoAtual.get("iso_639_1");

                    if ("en".equals(idioma)) {
                        logoEscolhida = logoAtual;
                        break;
                    }
                }
            }

            if (logoEscolhida == null) {
                logoEscolhida = (Map) logos.get(0);
            }

            String filePath = (String) logoEscolhida.get("file_path");

            if (filePath != null) {
                logo = imageUrl + "/original" + filePath;
            }
        }

        // ==========================
        // 5 - BUSCA O TRAILER
        // ==========================

        Map videos = restClient.get()
                .uri(apiUrl + "/movie/" + idFilme + "/videos?language=pt-BR")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(Map.class);

        String trailer = null;

        List resultadosVideos = (List) videos.get("results");

        if (resultadosVideos != null && !resultadosVideos.isEmpty()) {

            for (Object obj : resultadosVideos) {
                Map video = (Map) obj;

                String site = (String) video.get("site");
                String tipo = (String) video.get("type");
                String chave = (String) video.get("key");

                if ("YouTube".equals(site)
                        && "Trailer".equals(tipo)
                        && chave != null) {

                    trailer = "https://www.youtube.com/watch?v=" + chave;
                    break;
                }
            }
        }

        return new TmdbFilmeDTO(
                tituloFilme,
                descricao,
                genero,
                diretor,
                anoLancamento,
                duracao,
                nota,
                imagem,
                banner,
                logo,
                trailer
        );
    }
}