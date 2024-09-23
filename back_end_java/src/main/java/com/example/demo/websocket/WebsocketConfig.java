package com.example.demo.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/chat");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("ws")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }

    // Método necessário para lidar com aplicações que tenham segurança
    // Lida com a autenticação
    // Também é necessário autorizar requests para "/ws/**" na classe de segurança
    //   @Override
    //   public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
    //        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
    //   }

    // Converter mensagens para tipo: application json
    //    @Override
    //    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
    //        DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
    //        resolver.setDefaultMimeType(MediaType.APPLICATION_JSON);
    //
    //        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
    //        converter.setObjectMapper(new ObjectMapper());
    //        converter.setContentTypeResolver(resolver);
    //
    //        messageConverters.add(converter);
    //
    //        //add other converter here...
    //        return false;
    //    }
}
