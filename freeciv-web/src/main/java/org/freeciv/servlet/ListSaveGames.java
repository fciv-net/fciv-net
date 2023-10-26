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

import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Properties;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.freeciv.services.Validation;
import org.freeciv.util.Constants;


/**
 * Returns a list of savegames for the given user
 *
 * URL: /listsavegames
 */
public class ListSaveGames extends HttpServlet {
	
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
		if (!validation.isValidUsername(username)) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Invalid username");
			return;
		}
		String userid = request.getParameter("userid");

        try {
			String usernameFromDB = getUsernameFromDB(username, userid);
			if (usernameFromDB == null ) {
				throw new Exception("Invalid");
			}
			File folder = new File(savegameDirectory + "/" + usernameFromDB);

			if (!folder.exists()) {
				folder = new File(savegameDirectory + "/" + StringUtils.capitalize(usernameFromDB));
			}

			if (!folder.exists()) {
				response.getOutputStream().print(";");
			} else {
				File[] files = folder.listFiles();
				StringBuilder buffer = new StringBuilder();
				if (files != null) {
					Arrays.sort(files, new Comparator<File>() {
						public int compare(File f1, File f2) {
							return Long.compare(f2.lastModified(), f1.lastModified());
						}
					});

					for (File file : files) {
						if (file.isFile()) {
							String name = file.getName();
							if (name.endsWith(".sav.xz")) {
								name = name.replaceAll(".sav.xz", "");
							} else if (name.endsWith(".sav.zst")) {
								name = name.replaceAll(".sav.zst", "");
							}
							buffer.append(name);
							buffer.append(';');
						}
					}
				}
				response.getOutputStream().print(buffer.toString());
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


	private String getUsernameFromDB(String username, String userid) {
		Connection conn = null;
		try {
			String usernameFromDB;
			Context env = (Context) (new InitialContext().lookup(Constants.JNDI_CONNECTION));
			DataSource ds = (DataSource) env.lookup(Constants.JNDI_DDBBCON_MYSQL);
			conn = ds.getConnection();

			String usercheck =
					"SELECT username "
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
				if (!usernameFromDB.equalsIgnoreCase(username)) {
					throw new Exception("Invalid username.");
				}
				return usernameFromDB;
			}
		} catch (Exception err) {
			return null;
		}
	}

}
