/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.UserStatus;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import org.hibernate.Session;

/**
 *
 * @author User
 */
@MultipartConfig
@WebServlet(name = "UpdateProfile", urlPatterns = {"/UpdateProfile"})
public class UpdateProfile extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            
            System.out.println("called");

            Gson gson = new Gson();
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", false);

            int id = Integer.parseInt(request.getParameter("id"));
            String fname = request.getParameter("fname");
            String lname = request.getParameter("lname");
            String about = request.getParameter("about");
            Part image = request.getPart("image");

            if (fname.isEmpty()) {
                responseJson.addProperty("message", "Please enter the First Name.");
            } else if (lname.isEmpty()) {
                responseJson.addProperty("message", "Please enter the Last Name.");
            } else {

                Session session = HibernateUtil.getSessionFactory().openSession();

                User user = (User) session.get(User.class, id);
                
                String mobile = user.getMobile();
                
                user.setFirstName(fname);
                user.setLastName(lname);
                user.setAbout(about);

                session.update(user);
                session.beginTransaction().commit();

                if (image != null) {
                    String serverPath = request.getServletContext().getRealPath("");

                    File directory = new File(serverPath + File.separator + "Avatar_Images");

                    if (!directory.exists()) {
                        directory.mkdir();
                    }

                    String avatarImagePath = directory + File.separator + mobile + ".png";

                    File file = new File(avatarImagePath);
                    Files.copy(image.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }

                responseJson.addProperty("success", true);
                responseJson.add("user", gson.toJsonTree(user));
                responseJson.addProperty("message", "Profile Updated Successfully!");

                session.close();

            }

            System.out.println(gson.toJson(responseJson));
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
