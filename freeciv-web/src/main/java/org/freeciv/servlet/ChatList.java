package org.freeciv.servlet;

import org.apache.commons.text.StringEscapeUtils;
import org.freeciv.util.Constants;
import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


/**
 * List chat of FCIV.NET
 *
 * URL: /chatlist
 */
public class ChatList extends HttpServlet {

    private static final String INTERNAL_SERVER_ERROR = new JSONObject() //
            .put("statusCode", HttpServletResponse.SC_INTERNAL_SERVER_ERROR) //
            .put("error", "Internal server error.") //
            .toString();

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");

        Connection conn = null;

        try {

            Context env = (Context) (new InitialContext().lookup(Constants.JNDI_CONNECTION));
            DataSource ds = (DataSource) env.lookup(Constants.JNDI_DDBBCON_MYSQL);
            conn = ds.getConnection();

            String query = "SELECT * FROM chatlog ORDER BY id DESC";

            PreparedStatement preparedStatement = conn.prepareStatement(query);
            ResultSet rs = preparedStatement.executeQuery();
            response.getOutputStream().print("<html><head><link href=\"/static/css/bootstrap.min.css\" rel=\"stylesheet\"></head><body>");
            response.getOutputStream().print("<h2>OpenAI Chat Log:</h2>");
            response.getOutputStream().print("<table border='2'>");
            response.getOutputStream().print("<tr><td>ID:</td><td>Question:</td><td>Answer:</td><td>Timestamp:</td></tr>");
            int count = 0;
            while (rs.next()) {
                try {
                    response.getOutputStream().print("<tr>");

                    int id = rs.getInt("id");

                    String question = ensureISO88591(rs.getString("question"));
                    String answer = ensureISO88591(rs.getString("answer"));
                    String timestamp = rs.getString("timestamp");

                    response.getOutputStream().print("<td style='padding:3px;'>" + id + "</td><td style='padding:3px;'>"
                            + StringEscapeUtils.escapeHtml4(question) + "</td><td style='padding:3px;'>"
                            + StringEscapeUtils.escapeHtml4(answer) + "</td><td style='padding:3px;'>" + StringEscapeUtils.escapeHtml4(timestamp) + "</td>");
                    response.getOutputStream().print("</tr>");

                    if ((count + 1)  % 2 == 0) {
                        response.getOutputStream().print("<tr style=\"border-bottom:1px solid black\"> <td colspan=\"100%\"></td></tr>");
                    }
                    count++;
                } catch (Exception err) {
                    err.printStackTrace();

                }

            }
            response.getOutputStream().print("</table>");
            response.getOutputStream().print("</body></html>");

        } catch (Exception err) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getOutputStream().print(INTERNAL_SERVER_ERROR);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getOutputStream().print(INTERNAL_SERVER_ERROR);
                }
            }
        }
    }


    public static String ensureISO88591(String input) {
        // StringBuilder to build the result with only ISO 8859-1 characters
        StringBuilder sb = new StringBuilder(input.length());
        for (char c : input.toCharArray()) {
            // Check if the character is within the ISO 8859-1 range
            if (c <= 0xFF) {
                sb.append(c);
            } else {
                // Optionally replace non-ISO 8859-1 characters with a placeholder
                // or you could simply omit this line to remove the character
                sb.append('?'); // Placeholder for characters outside ISO 8859-1
            }
        }
        return sb.toString();
    }

}
