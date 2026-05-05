package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.utils.helpers.GeneralParser;

import java.sql.*;

public class SensorDataDAO {
    public static void saveSensorData(String[] sensorData) {
        String sqlQuery = "INSERT INTO sensor_data (sensor_id, date_and_time, data_unit_id ,sensor_value, is_anomaly) VALUES (?, ?, (SELECT id FROM data_units WHERE name = ?), ?, ?)";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, Integer.parseInt(sensorData[0]));
            statement.setTimestamp(2, new Timestamp(System.currentTimeMillis()));
            String dataUnit = GeneralParser.dataTypeToDefaultUnit(sensorData[1]);
            statement.setString(3, dataUnit);
            statement.setDouble(4, Double.parseDouble(sensorData[2]));
            //TODO
            statement.setBoolean(5, true);

            statement.executeQuery();
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't save sensor data: "+e.getMessage());
        }
    }
}
