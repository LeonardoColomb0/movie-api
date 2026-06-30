package com.leonardo.movie_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leonardo.movie_api.entity.Filme;

@Repository
public interface FilmeRepository extends JpaRepository<Filme, Long> {

}