/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.ChatStatus;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "LoadMessageHistory", urlPatterns = {"/LoadMessageHistory"})
public class LoadMessageHistory extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        int userId = Integer.parseInt(request.getParameter("userId"));
        int otherUserId = Integer.parseInt(request.getParameter("otherUserId"));

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Unable to process request");
        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        User user = (User) session.get(User.class, userId);
        User otherUser = (User) session.get(User.class, otherUserId);

        ChatStatus seen = (ChatStatus) session.get(ChatStatus.class, 1);

        Criteria messageCriteria = session.createCriteria(Chat.class);
        messageCriteria.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("userFrom", user), Restrictions.eq("userTo", otherUser)),
                Restrictions.and(Restrictions.eq("userFrom", otherUser), Restrictions.eq("userTo", user))
        ));
        messageCriteria.addOrder(Order.asc("dateTime"));

        if (!messageCriteria.list().isEmpty()) {

            JsonArray responseMessageList = new JsonArray();

            List<Chat> messageList = messageCriteria.list();
            SimpleDateFormat onlyTime = new SimpleDateFormat("hh:mm a");

            for (Chat message : messageList) {

                JsonObject messageItem = new JsonObject();

                messageItem.addProperty("message", message.getMessage());
                messageItem.addProperty("time", onlyTime.format(message.getDateTime()));

                if (message.getUserFrom().getId() == user.getId()) {
                    messageItem.addProperty("fromUser", true);
                    
                    if (message.getChatStatusId().getName().equals("Seen")) {
                        messageItem.addProperty("messageSeen", true);
                    }else{
                        messageItem.addProperty("messageSeen", false);
                    }
                } else {
                    messageItem.addProperty("fromUser", false);
                    
                    if (!message.getChatStatusId().getName().equals("Seen")) {
                        message.setChatStatusId(seen);
                    }
                }

                responseMessageList.add(messageItem);
            }

            session.beginTransaction().commit();

            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Messages Loaded");
            responseJson.add("responseMessageList", responseMessageList);

        } else {
            responseJson.addProperty("message", "nomessages");
        }
        System.out.println(gson.toJson(responseJson));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
