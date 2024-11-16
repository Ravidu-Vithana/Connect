/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Session;

/**
 *
 * @author User
 */
@WebServlet(name = "UpdatePassword", urlPatterns = {"/UpdatePassword"})
public class UpdatePassword extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            
            System.out.println("called");

            Gson gson = new Gson();
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", false);

            int id = Integer.parseInt(request.getParameter("id"));
            String newPassword = request.getParameter("newPassword");

            if (newPassword.isEmpty()) {
                responseJson.addProperty("message", "Please enter the new password.");
            } else if (!Validations.isPasswordValid(newPassword)) {
                responseJson.addProperty("message", "Please enter a valid password.");
            } else {

                Session session = HibernateUtil.getSessionFactory().openSession();

                User user = (User) session.get(User.class, id);
                
                user.setPassword(newPassword);

                session.update(user);
                session.beginTransaction().commit();

                responseJson.addProperty("success", true);
                responseJson.add("user", gson.toJsonTree(user));
                responseJson.addProperty("message", "Password Updated Successfully!");

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
