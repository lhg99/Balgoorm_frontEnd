package com.balgoorm.balgoorm_backend.board.model.entity;

import com.balgoorm.balgoorm_backend.quiz.model.entity.Quiz;
import com.balgoorm.balgoorm_backend.user.model.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardId;
    private String boardTitle;
    private String boardContent;
    private LocalDateTime boardCreateDate;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "QUIZ_ID")
    private Quiz quiz;

}
