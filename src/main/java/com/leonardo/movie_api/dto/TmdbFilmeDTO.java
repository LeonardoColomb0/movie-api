package com.leonardo.movie_api.dto;

public class TmdbFilmeDTO {

    private String titulo;
    private String descricao;
    private String genero;
    private Integer anoLancamento;
    private Double nota;

    private String imagem;
    private String banner;
    private String logo;

    public TmdbFilmeDTO() {
    }

    public TmdbFilmeDTO(
            String titulo,
            String descricao,
            String genero,
            Integer anoLancamento,
            Double nota,
            String imagem,
            String banner,
            String logo
    ) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.anoLancamento = anoLancamento;
        this.nota = nota;
        this.imagem = imagem;
        this.banner = banner;
        this.logo = logo;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getGenero() {
        return genero;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public Double getNota() {
        return nota;
    }

    public String getImagem() {
        return imagem;
    }

    public String getBanner() {
        return banner;
    }

    public String getLogo() {
        return logo;
    }
}