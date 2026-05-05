package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.utils.classes.Sensor;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SensorDAO {
    public static List<Sensor> getAllSensors() {
        List<Sensor> sensorList = new ArrayList<>();
        String sqlQuery = "SELECT s.id id, u.name AS sensor_type, s.machine_id, s.name name machine_id FROM sensor s JOIN unit_types u ON s.sensor_type_id = u.id";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery);
                ResultSet resultSet = statement.executeQuery()
        ) {
            while (resultSet.next()) {
                sensorList.add(new Sensor(resultSet.getInt("id"), resultSet.getString("sensor_type"), resultSet.getInt("machine_id"), resultSet.getString("name")));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get sensors: "+e.getMessage());
        }

        return sensorList;
    }
}
