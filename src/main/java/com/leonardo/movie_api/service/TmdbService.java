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

        // 1 - Pesquisa o filme
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

        String tituloFilme = (String) primeiroFilme.get("title");
        String descricao = (String) primeiroFilme.get("overview");

        String dataLancamento = (String) primeiroFilme.get("release_date");

        Integer anoLancamento = null;

        if (dataLancamento != null && dataLancamento.length() >= 4) {
            anoLancamento = Integer.parseInt(dataLancamento.substring(0, 4));
        }

        Double nota = primeiroFilme.get("vote_average") != null
                ? Double.parseDouble(primeiroFilme.get("vote_average").toString())
                : null;

        String posterPath = (String) primeiroFilme.get("poster_path");
        String bannerPath = (String) primeiroFilme.get("backdrop_path");

        String imagem = posterPath != null
                ? imageUrl + "/w500" + posterPath
                : null;

        String banner = bannerPath != null
                ? imageUrl + "/original" + bannerPath
                : null;

        // 2 - Busca as imagens do filme
        Map imagens = restClient.get()
                .uri(apiUrl + "/movie/" + idFilme + "/images")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(Map.class);

        String logo = null;

        List logos = (List) imagens.get("logos");

        if (logos != null && !logos.isEmpty()) {

            Map primeiroLogo = (Map) logos.get(0);

            String filePath = (String) primeiroLogo.get("file_path");

            logo = imageUrl + "/original" + filePath;
        }

        return new TmdbFilmeDTO(
                tituloFilme,
                descricao,
                "",
                anoLancamento,
                nota,
                imagem,
                banner,
                logo
        );
    }
}