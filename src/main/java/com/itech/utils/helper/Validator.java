package com.itech.utils.helper;

public class Validator {
    public static boolean validateStringToNumberConversion (String string) {
        return string.matches("[0-9]+");
    }

    public static boolean validateStringIsPositiveNumberOrZero (String string) {
        return Integer.parseInt(string) >= 0;
    }

    public static boolean validateStringIsPositiveNumberOtherThanZero (String string) {
        return Integer.parseInt(string) > 0;
    }
}
