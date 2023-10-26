package org.freeciv.servlet;

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
import java.sql.SQLException;

import org.freeciv.util.Constants;


/**
 * Logs errors of FCIV.NET
 *
 * URL: /errorlog
 */
public class ErrorLog extends HttpServlet {


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        String stacktrace = java.net.URLDecoder.decode(request.getParameter("stacktrace"), StandardCharsets.UTF_8);

        Connection conn = null;
        try {

            Context env = (Context) (new InitialContext().lookup(Constants.JNDI_CONNECTION));
            DataSource ds = (DataSource) env.lookup(Constants.JNDI_DDBBCON_MYSQL);
            conn = ds.getConnection();

            String query = "INSERT INTO errorlog (stacktrace) VALUES (?)";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, stacktrace);
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

    }

}
