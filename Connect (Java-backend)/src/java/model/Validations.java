package model;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Validations {

    public static boolean isEmailValid(String email) {
        return email.matches("^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$");
    }

    public static boolean isPasswordValid(String password) {
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$");
    }

    public static boolean isDouble(String number) {
        return number.matches("[0-9]{1,13}(\\.[0-9]*)?");
    }

    public static boolean isInteger(String number) {
        return number.matches("^\\d+$");
    }

    public static boolean isMobileNumberValid(String mobile) {
        return mobile.matches("^07[012345678]{1}[0-9]{7}$");
    }

    public static boolean isTodayDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        String today = sdf.format(new Date());
        String dateToCheck = sdf.format(date);

        if (today.equals(dateToCheck)) {
            return true;
        } else {
            return false;
        }
    }

}
