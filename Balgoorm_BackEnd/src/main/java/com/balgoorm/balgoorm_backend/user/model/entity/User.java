package com.balgoorm.balgoorm_backend.user.model.entity;

import com.balgoorm.balgoorm_backend.chat.model.entity.ChatRoom;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "USERS")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userPassword;
    private String nickname;
    private LocalDateTime createDate;
    @Column(nullable = false)
    private UserRole role;

    @ManyToOne
    @JoinColumn(name = "CHAT_ROOM_ID", nullable = false)
    private ChatRoom chatRoom;

}
