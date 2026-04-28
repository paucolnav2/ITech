package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;

import java.sql.*;

public class SensorDataDAO {
    public static void saveSensorData(String[] sensorData) {
        String sqlQuery = "INSERT INTO sensor_data (sensor_id, date_and_time, value_type_id ,sensor_value) VALUES (?, ?, ?, ?)";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setString(1,sensorData[0]);
            statement.setTimestamp(2, new Timestamp(System.currentTimeMillis()));
            statement.setDouble(3, Double.parseDouble(sensorData[2]));

            statement.executeQuery();
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't save sensor data: "+e.getMessage());
        }
    }
}
