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

    // LISTAR TODOS
    public List<Filme> listarTodos() {
        return filmeRepository.findAll();
    }

    // BUSCAR POR ID
    public Filme buscarPorId(Long id) {
        return filmeRepository.findById(id)
                .orElse(null);
    }

    // SALVAR
    public Filme salvar(Filme filme) {
        return filmeRepository.save(filme);
    }

    // ATUALIZAR
public Filme atualizar(Long id, Filme novoFilme) {
    
    Filme filme = filmeRepository.findById(id)
            .orElse(null);

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

    return filmeRepository.save(filme);
}
    // DELETAR
    public void deletar(Long id) {
        Filme filme = filmeRepository.findById(id)
                .orElse(null);

        if (filme != null) {
            filmeRepository.delete(filme);
        }
    }
    
}