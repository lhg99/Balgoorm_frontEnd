package com.balgoorm.balgoorm_backend.quiz.model.entity;

import com.balgoorm.balgoorm_backend.user.model.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class SubmitRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;
    private LocalDateTime submitDate;
    private String submitCode;
    private Boolean isSuccess;
    private String errorLog;
    private Float executionTime;
    private int memoryUsage;

    @ManyToOne
    @JoinColumn(name = "QUIZ_ID")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

}
