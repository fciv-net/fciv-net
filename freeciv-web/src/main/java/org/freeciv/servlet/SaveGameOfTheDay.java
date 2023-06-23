package org.freeciv.servlet;

import org.apache.commons.io.FileUtils;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Base64;
import java.util.Properties;
import java.util.stream.Collectors;

/**
 * Saves a game of the day image.
 *
 * URL: /save_game_of_the_day
 */
public class SaveGameOfTheDay extends HttpServlet {

    private static final String mapDstImgPaths = "/var/lib/tomcat9/webapps/data/";

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        String image = null;

        try {
            image = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            image = image.replace("data:image/png;base64,", "");
            byte[] image_of_the_day = Base64.getDecoder().decode(image.getBytes("UTF-8"));
            if (image_of_the_day.length > 15000000) {
                return;
            }
            ByteArrayInputStream bais = new ByteArrayInputStream(image_of_the_day);
            BufferedImage bufferedImage = ImageIO.read(bais);
            if (bufferedImage.getWidth() > 100 && bufferedImage.getWidth() < 10000) {
                File mapimg = new File(mapDstImgPaths + "game_of_the_day.png");
                FileUtils.writeByteArrayToFile(mapimg, image_of_the_day);
            }
            bais.close();

        } catch (Exception ex) {
        }



    }
}
