package com.balgoorm.balgoorm_backend.board.model.entity;

import com.balgoorm.balgoorm_backend.user.model.entity.User;
import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    private String commentContent;
    private LocalDateTime commentCreateDate;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_ID", nullable = false)
    private Board board;



}
