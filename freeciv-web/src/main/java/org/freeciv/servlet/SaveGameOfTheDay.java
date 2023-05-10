package org.freeciv.servlet;

import org.apache.commons.io.FileUtils;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Base64;

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
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;

        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            }

            image = stringBuilder.toString();
            System.out.println(image);
            image = image.replace("data:image/png;base64,", "");
            byte[] image_of_the_day = Base64.getDecoder().decode(image.getBytes("UTF-8"));
            if (image_of_the_day.length > 5000000) {
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
            // Ignore.
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }



    }
}
