/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.ChatStatus;
import entity.User;
import java.io.IOException;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Session;

/**
 *
 * @author User
 */
@WebServlet(name = "SendMessage", urlPatterns = {"/SendMessage"})
public class SendMessage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Message Sending Failed!");

        try {
            String message = request.getParameter("message");
            int userId = Integer.parseInt(request.getParameter("userId"));
            int otherUserId = Integer.parseInt(request.getParameter("otherUserId"));

            if (!message.isEmpty() && !message.trim().isEmpty()) {
                Session session = HibernateUtil.getSessionFactory().openSession();

                User user = (User) session.get(User.class, userId);
                User otherUser = (User) session.get(User.class, otherUserId);

                ChatStatus delivered = (ChatStatus) session.get(ChatStatus.class, 2);

                Chat chat = new Chat();
                chat.setChatStatusId(delivered);
                chat.setDateTime(new Date());
                chat.setMessage(message.trim());
                chat.setUserFrom(user);
                chat.setUserTo(otherUser);

                session.save(chat);
                session.beginTransaction().commit();
                session.close();

            }

            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Message Sending Successfull!");

        } catch (Exception e) {
            e.printStackTrace();
        }

        Gson gson = new Gson();

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
