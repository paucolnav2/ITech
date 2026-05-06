package com.itech.config;

import com.itech.utils.enums.units.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.*;

import static com.itech.utils.helpers.Validator.*;

public class ConfigLoader {
    private static final Properties prop = getConfigurationFile();

    public static void validateConfigurationFile() {
        boolean errorPresent = false;
        Method[] methods = ConfigLoader.class.getDeclaredMethods();

        for (Method method : methods) {
            String methodName = method.getName();

            if (methodName.startsWith("get") && !methodName.startsWith("getConfigurationFile")) {
                try {
                    method.invoke(null);
                } catch (Exception e) {
                    Throwable cause = e.getCause();

                    System.err.println(Objects.requireNonNullElse(cause, e).getMessage());
                    errorPresent = true;
                }
            }
        }

        if (errorPresent) {
            throw new RuntimeException("Configuration errors present, shutting down...");
        }
    }

    public static Properties getConfigurationFile() {
        Properties prop = new Properties();
        try {
            prop.load(new FileInputStream("config/config.properties"));
            return prop;
        } catch (IOException e) {
            throw new RuntimeException("Problem loading properties file: "+e);
        }
    }

    public static int getServerPort () {
        String stringServerPort = prop.getProperty("server.port", "8080");
        if (validateStringToNumberConversion(stringServerPort) && validateStringIsPositiveNumberOrZero(stringServerPort)) {
            return Integer.parseInt(stringServerPort);
        }
        else {
            throw new IllegalArgumentException("Invalid server port, positive numbers only: "+stringServerPort);
        }
    }

    public static int getThreadQueueSize () {
        String stringThreadQueueSize = prop.getProperty("thread.queue.size", "10");
        if (validateStringToNumberConversion(stringThreadQueueSize) && validateStringIsPositiveNumberOtherThanZero(stringThreadQueueSize)) {
            return Integer.parseInt(stringThreadQueueSize);
        }
        else {
            throw new IllegalArgumentException("Invalid thread queue size, numbers greater than zero only: "+ stringThreadQueueSize);
        }
    }

    public static TemperatureUnits getTemperatureUnit () {
        String stringTemperatureUnit = prop.getProperty("unit.temperature", "CENTIGRADE");
        try {
            return TemperatureUnits.valueOf(stringTemperatureUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid temperature unit, check for typos");
        }
    }

    public static HumidityUnits getHumidityUnit () {
        String stringHumidityUnit = prop.getProperty("unit.humidity", "HUMIDITYPERCENTAGE");
        try {
            return HumidityUnits.valueOf(stringHumidityUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid humidity unit, check for typos");
        }
    }

    public static VibrationUnits getVibrationUnit () {
        String stringVibrationUnit = prop.getProperty("unit.vibration", "VIBRATIONHERTZ");
        try {
            return VibrationUnits.valueOf(stringVibrationUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vibration unit, check for typos");
        }
    }

    public static PressureUnits getPressureUnit () {
        String stringPressureUnit = prop.getProperty("unit.pressure", "ATMOSPHERES");
        try {
            return PressureUnits.valueOf(stringPressureUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid pressure unit, check for typos");
        }
    }

    public static LightUnits getLightUnit () {
        String stringLightUnit = prop.getProperty("unit.light", "LUX");
        try {
            return LightUnits.valueOf(stringLightUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid light unit, check for typos");
        }
    }

    public static SoundUnits getSoundUnit () {
        String stringSoundUnit = prop.getProperty("unit.sound", "DECIBELS");
        try {
            return SoundUnits.valueOf(stringSoundUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sound unit, check for typos");
        }
    }

    public static MoistureUnits getMoistureUnit () {
        String stringMoistureUnit = prop.getProperty("unit.moisture", "MOISTUREPERCENTAGE");
        try {
            return MoistureUnits.valueOf(stringMoistureUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid moisture unit, check for typos");
        }
    }

    public static String getDatabaseIPDirection () {
        String stringDatabaseIPDirection = prop.getProperty("database.ip.direction", "localhost").toLowerCase();
        if (stringDatabaseIPDirection.matches("localhost") || stringDatabaseIPDirection.matches("\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}") || stringDatabaseIPDirection.equals("mysql")) {
            return stringDatabaseIPDirection;
        } else {
            throw new IllegalArgumentException("Invalid database IP direction");
        }
    }

    public static String getDatabasePort () {
        String stringDatabasePort = prop.getProperty("database.port", "3306");
        if (stringDatabasePort.matches("\\d{1,5}")) {
            return stringDatabasePort;
        } else {
            throw new IllegalArgumentException("Invalid database port");
        }
    }

    public static String getDatabaseName () {
        return prop.getProperty("database.name", "ITech");
    }

    public static String getDatabaseUsername () {
        return prop.getProperty("database.username", "root");
    }

    public static String getDatabasePassword () {
        return prop.getProperty("database.password", "root");
    }

    public static Double getTemperatureLimit () {
        String stringTemperatureLimit = prop.getProperty("limit.amount.temperature", "100");
        if (stringTemperatureLimit.matches("-?\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringTemperatureLimit);
        } else {
            throw new IllegalArgumentException("Invalid temperature limit, decimal numbers only");
        }
    }

    //(100|[1-9]?[0-9])(\\.\\d+)? descartado
    public static Double getHumidityLimit () {
        String stringHumidityLimit = prop.getProperty("limit.amount.humidity", "98");
        if (stringHumidityLimit.matches("\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringHumidityLimit);
        } else {
            throw new IllegalArgumentException("Invalid humidity limit, decimal numbers only up to a hundred");
        }
    }

    public static Double getVibrationLimit () {
        String stringVibrationLimit = prop.getProperty("limit.amount.vibration", "3000");
        if (stringVibrationLimit.matches("\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringVibrationLimit);
        } else {
            throw new IllegalArgumentException("Invalid vibration limit, decimal positive numbers only");
        }
    }

    public static Double getPressureLimit () {
        String stringPressureLimit = prop.getProperty("limit.amount.pressure", "5");
        if (stringPressureLimit.matches("\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringPressureLimit);
        } else {
            throw new IllegalArgumentException("Invalid pressure limit, decimal positive numbers only");
        }
    }

    public static Double getLightLimit () {
        String stringLightLimit = prop.getProperty("limit.amount.light", "2000");
        if (stringLightLimit.matches("\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringLightLimit);
        } else {
            throw new IllegalArgumentException("Invalid light limit, decimal positive numbers only");
        }
    }

    public static Double getSoundLimit () {
        String stringSoundLimit = prop.getProperty("limit.amount.sound", "180");
        if (stringSoundLimit.matches("-?\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringSoundLimit);
        } else {
            throw new IllegalArgumentException("Invalid sound limit, decimal numbers only");
        }
    }

    public static Double getMoistureLimit () {
        String stringMoistureLimit = prop.getProperty("limit.amount.moisture", "70");
        if (stringMoistureLimit.matches("\\d+(\\.\\d+)?")) {
            return Double.parseDouble(stringMoistureLimit);
        } else {
            throw new IllegalArgumentException("Invalid moisture limit, decimal numbers only");
        }
    }

//    public static boolean isMultipleAnomalyReportingActivated() {
//        String stringIsMultipleAnomalyReportingActivated = prop.getProperty("multiple.anomaly.reporting", "true");
//        if (stringIsMultipleAnomalyReportingActivated.matches("(true|false)")) {
//            return Boolean.getBoolean(stringIsMultipleAnomalyReportingActivated);
//        } else {
//            throw new IllegalArgumentException("Invalid boolean value in multiple anomaly reporting functionality");
//        }
//    }

    public static Integer getMultipleAnomalyReportingAmount() {
        String stringMultipleAnomalyReportingAmount = prop.getProperty("multiple.anomaly.reporting.amount", "3");
        if (stringMultipleAnomalyReportingAmount.matches("[1-9][0-9]*")) {
            return Integer.getInteger(stringMultipleAnomalyReportingAmount);
        } else {
            throw new IllegalArgumentException("Invalid value in multiple anomaly reporting amount, only positive integers bigger than zero");
        }
    }

    public static Integer getMultipleAnomalyReportingTimeInterval() {
        String stringMultipleAnomalyReportingTimeInterval = prop.getProperty("multiple.anomaly.reporting.time.interval", "300");
        if (stringMultipleAnomalyReportingTimeInterval.matches("[1-9][0-9]*")) {
            return Integer.getInteger(stringMultipleAnomalyReportingTimeInterval);
        } else {
            throw new IllegalArgumentException("Invalid value in multiple anomaly reporting time interval (seconds), only positive integers bigger than zero");
        }
    }

    public static String getOdooIPDirection () {
        String stringOdooIPDirection = prop.getProperty("odoo.ip.direction", "localhost").toLowerCase();
        if (stringOdooIPDirection.matches("localhost") || stringOdooIPDirection.matches("\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}") || stringOdooIPDirection.equals("odoo")) {
            return stringOdooIPDirection;
        } else {
            throw new IllegalArgumentException("Invalid odoo IP direction");
        }
    }

    public static String getOdooPort () {
        String stringOdooPort = prop.getProperty("odoo.port", "8069");
        if (stringOdooPort.matches("\\d{1,5}")) {
            return stringOdooPort;
        } else {
            throw new IllegalArgumentException("Invalid odoo port");
        }
    }

    public static String getOdooDatabase () {
        return prop.getProperty("odoo.database", "odoo");
    }

    public static String getOdooUser () {
        return prop.getProperty("odoo.user", "odoo");
    }

    public static String getOdooPassword () {
        return prop.getProperty("odoo.password", "odoo");
    }
}