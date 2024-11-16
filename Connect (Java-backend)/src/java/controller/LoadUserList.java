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
import java.io.File;
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
@WebServlet(name = "LoadUserList", urlPatterns = {"/LoadUserList"})
public class LoadUserList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        System.out.println("called");

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Process Failed!");
        Session session = HibernateUtil.getSessionFactory().openSession();

        int userId = Integer.parseInt(request.getParameter("userId"));
        String name = request.getParameter("name");

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

        JsonArray responseUserList = new JsonArray();

        for (User otherUser : otherUsersList) {

            JsonObject chatItem = new JsonObject();
            chatItem.addProperty("otherUserId", otherUser.getId());
            chatItem.addProperty("otherUserMobile", otherUser.getMobile());
            chatItem.addProperty("otherUserAbout", otherUser.getAbout());
            chatItem.addProperty("otherUserName", otherUser.getFirstName() + " " + otherUser.getLastName());
            chatItem.addProperty("otherUserStatus", otherUser.getUserStatus().getName());

            String serverPath = request.getServletContext().getRealPath("");
            String otherUserAvatarImagePath = serverPath + File.separator + "Avatar_Images" + File.separator + otherUser.getMobile() + ".png";
            File otherUserAvatarImageFile = new File(otherUserAvatarImagePath);

            if (otherUserAvatarImageFile.exists()) {
                chatItem.addProperty("avatarImageFound", true);
            } else {
                chatItem.addProperty("avatarImageFound", false);
            }

            responseUserList.add(chatItem);

        }

        if (!responseUserList.isEmpty()) {
            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Users Loaded");
            responseJson.add("userList", gson.toJsonTree(responseUserList));
        } else {
            responseJson.addProperty("message", "nousers");
        }

        System.out.println(gson.toJson(responseJson));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
