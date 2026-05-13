package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.utils.classes.Sensor;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SensorDAO {
    private static final String SELECT_SENSORS_SQL =
            "SELECT s.id, s.machine_id, s.name, GROUP_CONCAT(u.name ORDER BY u.name SEPARATOR ',') AS sensor_types " +
            "FROM sensor s " +
            "JOIN sensor_unit_types sut ON s.id = sut.sensor_id " +
            "JOIN unit_types u ON sut.unit_type_id = u.id ";

    public static List<Sensor> getAllSensors() {
        List<Sensor> sensorList = new ArrayList<>();
        String sqlQuery = SELECT_SENSORS_SQL + "GROUP BY s.id, s.machine_id, s.name";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery);
                ResultSet resultSet = statement.executeQuery()
        ) {
            while (resultSet.next()) {
                List<String> types = Arrays.asList(resultSet.getString("sensor_types").split(","));
                sensorList.add(new Sensor(resultSet.getInt("id"), types, resultSet.getInt("machine_id"), resultSet.getString("name")));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get sensors: " + e.getMessage());
        }
        return sensorList;
    }

    public static List<Sensor> getSensorsByMachineId(Integer machineId) {
        List<Sensor> sensorList = new ArrayList<>();
        String sqlQuery = SELECT_SENSORS_SQL + "WHERE s.machine_id = ? GROUP BY s.id, s.machine_id, s.name";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, machineId);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                List<String> types = Arrays.asList(resultSet.getString("sensor_types").split(","));
                sensorList.add(new Sensor(resultSet.getInt("id"), types, resultSet.getInt("machine_id"), resultSet.getString("name")));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get sensors by machine id: " + e.getMessage());
        }
        return sensorList;
    }
}
