package com.leonardo.movie_api.dto;

public class TmdbFilmeDTO {

    private String titulo;
    private String descricao;
    private String genero;
    private String diretor;

    private Integer anoLancamento;
    private Integer duracao;

    private Double nota;

    private String imagem;
    private String banner;
    private String logo;
    private String trailer;

    public TmdbFilmeDTO() {
    }

    public TmdbFilmeDTO(
            String titulo,
            String descricao,
            String genero,
            String diretor,
            Integer anoLancamento,
            Integer duracao,
            Double nota,
            String imagem,
            String banner,
            String logo,
            String trailer
    ) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.diretor = diretor;
        this.anoLancamento = anoLancamento;
        this.duracao = duracao;
        this.nota = nota;
        this.imagem = imagem;
        this.banner = banner;
        this.logo = logo;
        this.trailer = trailer;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getDiretor() {
        return diretor;
    }

    public void setDiretor(String diretor) {
        this.diretor = diretor;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }

    public Integer getDuracao() {
        return duracao;
    }

    public void setDuracao(Integer duracao) {
        this.duracao = duracao;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }
}