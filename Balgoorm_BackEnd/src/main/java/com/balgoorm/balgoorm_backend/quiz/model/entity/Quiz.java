package com.balgoorm.balgoorm_backend.quiz.model.entity;

import com.balgoorm.balgoorm_backend.user.model.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quizId;
    private String quizTitle;
    private String quizContent;
    private int quizPoint;
    private LocalDateTime quizRegDate;
    private int correctCnt;
    private int submitCnt;
    private int quizLevel;
    private String quizAnswer;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

}
