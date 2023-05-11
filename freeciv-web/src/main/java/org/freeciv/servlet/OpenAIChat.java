package org.freeciv.servlet;

import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;


/**
 * OpenAI chat for FCIV.NET
 *
 * URL: /openai_chat
 */
public class OpenAIChat  extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        try {
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            String message = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            message = new String(Base64.getDecoder().decode(message));

            System.out.println("OpenAI message: " + message);

            Properties prop = new Properties();
            prop.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
            String key = prop.getProperty("openai_key");
            if (key == null || key.equals("")) {
                return;
            }

            OpenAiService service = new OpenAiService(key, Duration.ofSeconds(60));

            List<ChatMessage> messages = new ArrayList<>();
            ChatMessage systemchat = new ChatMessage();
            systemchat.setRole("system");
            systemchat.setContent("I am a player in the game of Freeciv. You can pretent do be a assistant in the game.");
            messages.add(systemchat);

            ChatMessage userchat = new ChatMessage();
            userchat.setRole("user");
            userchat.setContent(message);
            messages.add(userchat);

            ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                    .messages(messages)
                    .model("gpt-3.5-turbo")
                    .build();
            List<ChatCompletionChoice> choices = service.createChatCompletion(completionRequest).getChoices();
            for (ChatCompletionChoice choice : choices) {
                response.getWriter().print(choice.getMessage().getContent());
                System.out.println("OpenAI response: " + choice.getMessage().getContent());
            }


        } catch (Exception erro) {
            erro.printStackTrace();
            System.out.println(erro.getMessage());
        }
    }

}
