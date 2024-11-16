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
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {

            Gson gson = new Gson();
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", false);

            String fname = request.getParameter("fname");
            String lname = request.getParameter("lname");
            String mobile = request.getParameter("mobile");
            String password = request.getParameter("password");
            Part image = request.getPart("image");

            if (fname.isEmpty()) {
                responseJson.addProperty("message", "Please enter the First Name.");
            } else if (lname.isEmpty()) {
                responseJson.addProperty("message", "Please enter the Last Name.");
            } else if (mobile.isEmpty()) {
                responseJson.addProperty("message", "Please enter the mobile number.");
            } else if (!Validations.isMobileNumberValid(mobile)) {
                responseJson.addProperty("message", "Please enter a valid mobile number.");
            } else if (password.isEmpty()) {
                responseJson.addProperty("message", "Please enter the Password.");
            } else if (!Validations.isPasswordValid(password)) {
                responseJson.addProperty("message", "Please enter a valid password.");
            } else {

                Session session = HibernateUtil.getSessionFactory().openSession();

                Criteria criteria = session.createCriteria(User.class);
                criteria.add(Restrictions.eq("mobile", mobile));

                if (criteria.list().isEmpty()) {
                    User user = new User();
                    user.setFirstName(fname);
                    user.setLastName(lname);
                    user.setMobile(mobile);
                    user.setPassword(password);
                    user.setJoinedDateTime(new Date());

                    UserStatus userStatus = (UserStatus) session.get(UserStatus.class, 2);
                    user.setUserStatus(userStatus);

                    session.save(user);
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
                    responseJson.addProperty("message", "Registration Completed!");

                    session.close();

                } else {
                    responseJson.addProperty("message", "User with this number already exists!");
                }

            }

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
