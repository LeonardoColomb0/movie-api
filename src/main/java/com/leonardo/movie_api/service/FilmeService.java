package com.leonardo.movie_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.leonardo.movie_api.entity.Filme;
import com.leonardo.movie_api.repository.FilmeRepository;

@Service
public class FilmeService {

    private final FilmeRepository filmeRepository;

    public FilmeService(FilmeRepository filmeRepository) {
        this.filmeRepository = filmeRepository;
    }

    public List<Filme> listarTodos() {
        return filmeRepository.findAll();
    }

    public Filme buscarPorId(Long id) {
        return filmeRepository.findById(id).orElse(null);
    }

    public Filme salvar(Filme filme) {
        return filmeRepository.save(filme);
    }

    public Filme atualizar(Long id, Filme novoFilme) {
        Filme filme = filmeRepository.findById(id).orElse(null);

        if (filme == null) {
            return null;
        }

        filme.setTitulo(novoFilme.getTitulo());
        filme.setDescricao(novoFilme.getDescricao());
        filme.setGenero(novoFilme.getGenero());
        filme.setDiretor(novoFilme.getDiretor());
        filme.setAnoLancamento(novoFilme.getAnoLancamento());
        filme.setDuracao(novoFilme.getDuracao());
        filme.setNota(novoFilme.getNota());
        filme.setImagem(novoFilme.getImagem());
        filme.setBanner(novoFilme.getBanner());

        return filmeRepository.save(filme);
    }

    public void deletar(Long id) {
        Filme filme = filmeRepository.findById(id).orElse(null);

        if (filme != null) {
            filmeRepository.delete(filme);
        }
    }
}