package org.freeciv.servlet;

import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.freeciv.util.Constants;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
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

    private final String model = "gpt-4";

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        try {
            response.setContentType("text/html; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            String question = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

            question = new String(Base64.getDecoder().decode(question));

            Properties prop = new Properties();
            prop.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
            String key = prop.getProperty("openai_key");
            if (key == null || key.equals("")) {
                System.out.println("OpenAI key missing.");
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
                    "x: unit auto e(x)plore.  Shift-Return: Turn done. " +
                    "Middle-click with the mouse to get information about map tiles. " +
                    "Left-click with the mouse to select units and cities. " +
                    "Right-click with the moues to move the map." +
                    "Left-click and drag with the mouse to change view angle. ";
            systemchat.setContent(fcivInfo + keyboardShortcuts);

            messages.add(systemchat);


            for (String submessage : question.split(";")) {
                ChatMessage userchat = new ChatMessage();
                userchat.setRole("user");
                userchat.setContent(submessage);
                messages.add(userchat);
            }

            ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                    .messages(messages)
                    .model(model)
                    .build();
            List<ChatCompletionChoice> choices = service.createChatCompletion(completionRequest).getChoices();
            String answer = "";
            for (ChatCompletionChoice choice : choices) {
                response.getWriter().print(choice.getMessage().getContent());
                answer += choice.getMessage().getContent();
            }

            String ipAddress = request.getHeader("X-Real-IP");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }


            Connection conn = null;
            try {

                Context env = (Context) (new InitialContext().lookup(Constants.JNDI_CONNECTION));
                DataSource ds = (DataSource) env.lookup(Constants.JNDI_DDBBCON_MYSQL);
                conn = ds.getConnection();

                String query = "INSERT INTO chatlog (question, answer, name, reusable) VALUES (?, ?, ?, ?)";
                PreparedStatement preparedStatement = conn.prepareStatement(query);
                preparedStatement.setString(1, question);
                preparedStatement.setString(2, answer);
                preparedStatement.setString(3, ipAddress);
                preparedStatement.setBoolean(4, false);
                preparedStatement.executeUpdate();

            } catch (Exception err) {
                response.setHeader("result", "error");
            } finally {
                if (conn != null)
                    try {
                        conn.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
            }


        } catch (Exception erro) {
            System.out.println(erro.getMessage());
        }
    }

}
