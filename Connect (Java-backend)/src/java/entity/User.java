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
@Table(name = "user")
public class User implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "fname", length = 20, nullable = false)
    private String firstName;

    @Column(name = "lname", length = 30, nullable = false)
    private String lastName;

    @Column(name = "about", length = 100, nullable = false, insertable = false)
    private String about;

    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    @Column(name = "password", length = 20, nullable = false)
    private String password;

    @Column(name = "joined_date_time", nullable = false)
    private Date joinedDateTime;

    @ManyToOne
    @JoinColumn(name = "user_status_id")
    private UserStatus userStatus;

    public User() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getJoinedDateTime() {
        return joinedDateTime;
    }

    public void setJoinedDateTime(Date joinedDateTime) {
        this.joinedDateTime = joinedDateTime;
    }

    public UserStatus getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(UserStatus userStatus) {
        this.userStatus = userStatus;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

}
