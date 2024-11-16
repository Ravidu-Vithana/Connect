/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.User;
import entity.UserStatus;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "LoadChatList", urlPatterns = {"/LoadChatList"})
public class LoadChatList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Process Failed!");
        Session session = HibernateUtil.getSessionFactory().openSession();

        int userId = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");

        User user = (User) session.get(User.class, userId);

        UserStatus online = (UserStatus) session.get(UserStatus.class, 1);
        user.setUserStatus(online);

        session.update(user);
        session.beginTransaction().commit();

        Criteria otherUsers = session.createCriteria(User.class);
        otherUsers.add(Restrictions.ne("id", userId));

        if (!name.isEmpty()) {

            String[] names = name.split(" ");
            otherUsers.add(Restrictions.like("firstName", names[0], MatchMode.START));

            if (names.length > 1) {
                otherUsers.add(Restrictions.like("lastName", names[1], MatchMode.START));
            }
        }

        List<User> otherUsersList = otherUsers.list();

        List<JsonObject> responseChatList = new LinkedList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yy hh:mm a");

        for (User otherUser : otherUsersList) {

            Criteria criteria1 = session.createCriteria(Chat.class);
            criteria1.add(Restrictions.or(
                    Restrictions.and(
                            Restrictions.eq("userFrom", user), Restrictions.eq("userTo", otherUser)
                    ), Restrictions.and(
                    Restrictions.eq("userFrom", otherUser), Restrictions.eq("userTo", user)
            )
            )
            );
            criteria1.addOrder(Order.desc("dateTime"));

            List<Chat> chatList = criteria1.list();

            if (!chatList.isEmpty()) {

                JsonObject chatItem = new JsonObject();
                chatItem.addProperty("otherUserId", otherUser.getId());
                chatItem.addProperty("otherUserMobile", otherUser.getMobile());
                chatItem.addProperty("otherUserAbout", otherUser.getAbout());
                chatItem.addProperty("otherUserName", otherUser.getFirstName() + " " + otherUser.getLastName());
                chatItem.addProperty("otherUserStatus", otherUser.getUserStatus().getName());
                chatItem.addProperty("sortDateTime", dateFormat.format(chatList.get(0).getDateTime()));

                String serverPath = request.getServletContext().getRealPath("");
                String otherUserAvatarImagePath = serverPath + File.separator + "Avatar_Images" + File.separator + otherUser.getMobile() + ".png";
                File otherUserAvatarImageFile = new File(otherUserAvatarImagePath);

                if (otherUserAvatarImageFile.exists()) {
                    chatItem.addProperty("avatarImageFound", true);
                } else {
                    chatItem.addProperty("avatarImageFound", false);
                }

                SimpleDateFormat onlyDate = new SimpleDateFormat("yy/MM/dd");
                SimpleDateFormat onlyTime = new SimpleDateFormat("hh:mm a");
                chatItem.addProperty("lastMessage", chatList.get(0).getMessage());

                if (Validations.isTodayDate(chatList.get(0).getDateTime())) {
                    chatItem.addProperty("lastDateTime", onlyTime.format(chatList.get(0).getDateTime()));
                } else {
                    chatItem.addProperty("lastDateTime", onlyDate.format(chatList.get(0).getDateTime()));
                }

                int newMessageCount = 0;

                for (Chat chat : chatList) {
                    if (!chat.getChatStatusId().getName().equals("Seen") && chat.getUserTo().getId() == userId) {
                        newMessageCount++;
                    }
                }

                chatItem.addProperty("newMessageCount", newMessageCount);
                responseChatList.add(chatItem);

            }

        }

        Collections.sort(responseChatList, new Comparator<JsonObject>() {
            @Override
            public int compare(JsonObject chat1, JsonObject chat2) {
                String lastDateTime1 = chat1.get("sortDateTime").getAsString();
                String lastDateTime2 = chat2.get("sortDateTime").getAsString();

                try {
                    Date date1 = dateFormat.parse(lastDateTime1);
                    Date date2 = dateFormat.parse(lastDateTime2);

                    return date2.compareTo(date1);

                } catch (ParseException e) {
                    e.printStackTrace();
                }

                return 0;
            }

        });

        if (!responseChatList.isEmpty()) {
            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Chats Loaded");
            responseJson.add("chatList", gson.toJsonTree(responseChatList));
        } else {
            responseJson.addProperty("message", "nochats");
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
