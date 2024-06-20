package com.balgoorm.balgoorm_backend.chat.model.entity;

import com.balgoorm.balgoorm_backend.user.model.entity.User;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    @OneToMany(mappedBy = "chatroom")
    private List<Chat> chats;
}
