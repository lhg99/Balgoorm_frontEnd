package com.balgoorm.balgoorm_backend.quiz.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class SolvedQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long solvedQuizId;
    private String quizId;
    private String userId;
    @Column(nullable = false)
    private LocalDateTime solvedAt = LocalDateTime.now();
}
