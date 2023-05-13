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
            String fcivInfo = "I am a player in the game of FCIV.NET, a fork of the game Freeciv. FCIV.NET is a 3D version of Freeciv which can be played in a browser for free. You can pretent do be a assistant in the game. "
                    + "In FCIV.NET new cities are built using the keyboard shortcut B or right clicking on a Settlers unit and selecting Build city from the menu. "
                    + "Units are moved using the keyboard shortcut G (Goto) and then selecting the destination. Units can also be moved using the arrow keys on the keyboard";

            String keyboardShortcuts = " Keyboard Shortcuts for Unit Orders: "+
                    "a: (a)uto-settler (settler/worker units). "+
                    "b: (b)uild city (settler units). "+
                    "c: (c)enter map on active unit. "+
                    "f: (f)ortify unit (military units). "+
                    "f: build (f)ortress (settler/worker units). "+
                    "g: (g)o to tile (then left-click mouse to select target tile). "+
                    "h: set unit's (h)omecity (to city on current tile). "+
                    "i: build (i)rrigation or convert terrain (settler/worker units). "+
                    "m: build (m)ine or convert terrain (settler/worker units). "+
                    "N: explode (N)uclear. "+
                    "o: transf(o)rm terrain (engineer unit). "+
                    "p: clean (p)ollution (settler/worker units). "+
                    "P: (P)illage (destroy terrain alteration). "+
                    "r: build (r)oad/railroad (settler/worker units). "+
                    "s: (s)entry unit. "+
                    "S: un(S)entry all units on tile. "+
                    "L: unit go (t)o/airlift to city. "+
                    "u: (u)nload unit from transporter. "+
                    "x: unit auto e(x)plore.  Shift-Return: Turn done. ";
            systemchat.setContent(fcivInfo + keyboardShortcuts);

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
