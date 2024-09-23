package com.example.demo.websocket;

import com.example.demo.domain.message.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/chat/public")
    public ChatMessage sendMessage(
            @Payload ChatMessage message
    ) {
        return message;
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/chat/public")
    public ChatMessage addUser(
            @Payload ChatMessage message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());

        // Altera conteúdo da mensagem de entrada de usuário no servidor
        message.setContent("Entrou no chat!");

        return message;
    }

}
