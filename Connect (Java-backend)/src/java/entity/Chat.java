/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author User
 */

@Entity
@Table(name = "chat")
public class Chat implements Serializable{
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @ManyToOne
    @JoinColumn(name = "user_from")
    private User userFrom;
    
    @ManyToOne
    @JoinColumn(name = "user_to")
    private User userTo;
    
    @Column(name = "message", nullable = false)
    private String message;
    
    @Column(name = "date_time", nullable = false)
    private Date dateTime;
    
    @ManyToOne
    @JoinColumn(name = "chat_status_id")
    private ChatStatus chatStatusId;

    public Chat() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUserFrom() {
        return userFrom;
    }

    public void setUserFrom(User userFrom) {
        this.userFrom = userFrom;
    }

    public User getUserTo() {
        return userTo;
    }

    public void setUserTo(User userTo) {
        this.userTo = userTo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    public ChatStatus getChatStatusId() {
        return chatStatusId;
    }

    public void setChatStatusId(ChatStatus chatStatusId) {
        this.chatStatusId = chatStatusId;
    }
    
}
