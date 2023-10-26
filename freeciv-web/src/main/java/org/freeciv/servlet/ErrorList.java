package org.freeciv.servlet;

import org.freeciv.util.Constants;
import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;


/**
 * List errors of FCIV.NET
 *
 * URL: /errorlist
 */
public class ErrorList extends HttpServlet {

    private static final String INTERNAL_SERVER_ERROR = new JSONObject() //
            .put("statusCode", HttpServletResponse.SC_INTERNAL_SERVER_ERROR) //
            .put("error", "Internal server error.") //
            .toString();

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        Connection conn = null;

        try {

            Context env = (Context) (new InitialContext().lookup(Constants.JNDI_CONNECTION));
            DataSource ds = (DataSource) env.lookup(Constants.JNDI_DDBBCON_MYSQL);
            conn = ds.getConnection();

            String query = "SELECT * FROM errorlog ORDER BY id DESC";

            PreparedStatement preparedStatement = conn.prepareStatement(query);
            ResultSet rs = preparedStatement.executeQuery();
            response.getOutputStream().print("<html><head><link href=\"/static/css/bootstrap.min.css\" rel=\"stylesheet\"></head><body>");
            response.getOutputStream().print("<div class='container'><h2> Error list:</h2>");
            response.getOutputStream().print("<table>");
            int count = 0;
            while (rs.next()) {
                try {
                    response.getOutputStream().print("<tr>");

                    int id = rs.getInt("id");
                    String stacktrace = new String(Base64.getDecoder().decode(rs.getString("stacktrace").getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
                    String timestamp = rs.getString("timestamp");

                    response.getOutputStream().print("<td style='padding:3px;'>" + id + "</td><td style='padding:3px;'>" + stacktrace + "</td><td style='padding:3px;'>" + timestamp + "</td>");
                    response.getOutputStream().print("</tr>");

                    if ((count + 1)  % 2 == 0) {
                        response.getOutputStream().print("<tr style=\"border-bottom:1px solid black\"> <td colspan=\"100%\"></td></tr>");
                    }
                    count++;
                } catch (Exception err) {
                    err.printStackTrace();

                }

            }
            response.getOutputStream().print("</table></div>");
            response.getOutputStream().print("</body></html>");

        } catch (Exception err) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getOutputStream().print(INTERNAL_SERVER_ERROR);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }
    }


}
