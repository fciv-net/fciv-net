/*******************************************************************************
 * Freeciv-web - the web version of Freeciv. http://www.fciv.net/
 * Copyright (C) 2009-2017 The Freeciv-web project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/
package org.freeciv.servlet;

import org.apache.commons.codec.digest.Crypt;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;
import java.util.Properties;
import javax.naming.Context;
import javax.naming.InitialContext;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import javax.sql.DataSource;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.freeciv.services.Validation;
import org.freeciv.util.Constants;

/**
 * Deletes a savegame.
 *
 * URL: /deletesavegame
 */
public class DeleteSaveGame extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	private final Validation validation = new Validation();
	
	private String savegameDirectory;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);

		try {
			Properties prop = new Properties();
			prop.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
			savegameDirectory = prop.getProperty("savegame_dir");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		String username = request.getParameter("username");
		String savegame = request.getParameter("savegame");
		String secure_password = java.net.URLDecoder.decode(request.getParameter("sha_password"), StandardCharsets.UTF_8);
		String userid = request.getParameter("userid");

		if (!validation.isValidUsername(username)) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Invalid username");
			return;
		}
		String usernameFromDB = getUsernameFromDB(username, userid, secure_password);

		if (savegame == null || savegame.length() > 100 || savegame.contains("/") || savegame.contains("\\") || savegame.contains(".")) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Invalid savegame");
			return;
		}

		try {
			if (usernameFromDB == null ) {
				throw new Exception("Invalid");
			}

			File folder = new File(savegameDirectory + "/" + usernameFromDB);

			if (!folder.exists()) {
				folder = new File(savegameDirectory + "/" + StringUtils.capitalize(usernameFromDB));
			}

			if (!folder.exists()) {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
						"Save folder under the given username cannot be found.");
				return;
			} 
			boolean fileFound = false;
			for (File savegameFile: Objects.requireNonNull(folder.listFiles())) {
				if (savegameFile.exists() && savegameFile.isFile()) {
					if (savegame.equals("ALL") || savegameFile.getName().startsWith(savegame)){
						// NOTE: the server does not distinguish saved games of different extensions when loading. So we can delete all of them.
						Files.delete(savegameFile.toPath());
						fileFound = true;
					}
				}
			}
			if (!fileFound) {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
						"Saved game not found.");
            }
		} catch (Exception err) {
			response.setHeader("result", "error");
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ERROR");
		}

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "This endpoint only supports the POST method.");

	}

	private String getUsernameFromDB(String username, String userid, String secure_password) {
		Connection conn = null;
		try {
			String usernameFromDB;
			Context env = (Context) (new InitialContext().lookup(Constants.JNDI_CONNECTION));
			DataSource ds = (DataSource) env.lookup(Constants.JNDI_DDBBCON_MYSQL);
			conn = ds.getConnection();

			String usercheck =
					"SELECT username, secure_hashed_password "
							+ "FROM auth "
							+ "WHERE LOWER(username) = LOWER(?) "
							+ "	AND activated = '1'"
							+ "	AND id = ? LIMIT 1";
			PreparedStatement ps1 = conn.prepareStatement(usercheck);
			ps1.setString(1, username);
			ps1.setString(2, userid);
			ResultSet rs1 = ps1.executeQuery();
			if (!rs1.next()) {
				return null;
			} else {
				usernameFromDB = rs1.getString(1);
				if (!validation.isValidUsername(usernameFromDB)) {
					return null;
				}
				if (!usernameFromDB.equals(username)) {
					throw new Exception("Invalid username.");
				}
				String hashedPwd = rs1.getString(2);
                if (hashedPwd == null || !hashedPwd.equals(DigestUtils.sha256Hex(secure_password))) {
                    throw new Exception("Invalid auth.");
                }
                return usernameFromDB;
			}
		} catch (Exception err) {
			return null;
		}
	}

}