/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        
        JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
        String mobile = requestJson.get("mobile").getAsString();
        String password = requestJson.get("password").getAsString();
        
        if(mobile.isEmpty()){
            responseJson.addProperty("message", "Please enter the mobile number");
        }else if(password.isEmpty()){
            responseJson.addProperty("message", "Please enter the password");
        }else{
            
            Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("mobile", mobile));
            criteria.add(Restrictions.eq("password", password));
            
            if(!criteria.list().isEmpty()){
                User user = (User) criteria.uniqueResult();
                
                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Sign In Successfull!");
                responseJson.add("user", gson.toJsonTree(user));
            }else {
                responseJson.addProperty("message", "Invalid Credentials");
            }
            session.close();
        }
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        
    }

}
