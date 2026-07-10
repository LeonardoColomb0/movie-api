package com.leonardo.movie_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leonardo.movie_api.dto.TmdbFilmeDTO;
import com.leonardo.movie_api.service.TmdbService;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/tmdb")
public class TmdbController {

    private final TmdbService tmdbService;

    public TmdbController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping
    public ResponseEntity<TmdbFilmeDTO> buscarFilme(@RequestParam String titulo) {
        TmdbFilmeDTO filme = tmdbService.buscarFilmePorTitulo(titulo);

        if (filme == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(filme);
    }
}