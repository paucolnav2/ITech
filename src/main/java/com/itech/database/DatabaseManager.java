package com.itech.database;

import com.itech.config.ConfigLoader;
import com.itech.utils.customExceptions.FailedConnectionToDatabase;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Objects;

public class DatabaseManager {
    private static final String URL = "jdbc:mysql://"+ ConfigLoader.getDatabaseIPDirection()+":"
            +ConfigLoader.getDatabasePort()+"/"+ConfigLoader.getDatabaseName();
    private static final String USER = ConfigLoader.getDatabaseUsername();
    private static final String PASSWORD = ConfigLoader.getDatabasePassword();

    public static void validateDatabaseConnection() {
        try {
            DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            Throwable cause = e.getCause();
            throw new FailedConnectionToDatabase(Objects.requireNonNullElse(cause, e).getMessage());
        }
    }

    public static Connection getConnection() {
        try {
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            Throwable cause = e.getCause();
            throw new FailedConnectionToDatabase(Objects.requireNonNullElse(cause, e).getMessage());
        }
    }
}
