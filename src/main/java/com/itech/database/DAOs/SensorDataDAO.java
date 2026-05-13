package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.database.anomalyHandling.AnomalyHandler;
import com.itech.utils.classes.SensorData;
import com.itech.utils.customExceptions.InvalidSensorTypeException;
import com.itech.utils.helpers.GeneralParser;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SensorDataDAO {
    public static void saveSensorData(String[] sensorData) {
        int sensorId = Integer.parseInt(sensorData[0]);
        String sensorType = sensorData[1];

        validateSensorType(sensorId, sensorType);

        String sqlQuery = "INSERT INTO sensor_data (sensor_id, date_and_time, data_unit_id, sensor_value, is_anomaly) VALUES (?, ?, (SELECT id FROM data_units WHERE name = ?), ?, ?)";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, sensorId);
            statement.setTimestamp(2, new Timestamp(System.currentTimeMillis()));
            String dataUnit = GeneralParser.dataTypeToDefaultUnit(sensorType);
            statement.setString(3, dataUnit);
            statement.setDouble(4, Double.parseDouble(sensorData[2]));

            boolean isAnomaly = GeneralParser.valueIsAnomaly(sensorType, Double.parseDouble(sensorData[2]));
            statement.setBoolean(5, isAnomaly);

            statement.execute();

            if (isAnomaly) {
                AnomalyHandler.handleAnomaly(dataUnit, sensorId);
            } else {
                AnomalyHandler.checkRecovery(sensorId);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't save sensor data: " + e.getMessage());
        }
    }

    public static List<SensorData> getSensorDataBySensorId(Integer sensorId) {
        List<SensorData> dataList = new ArrayList<>();
        String sqlQuery =
                "SELECT sd.sensor_id, sd.sensor_value, sd.date_and_time, sd.is_anomaly, du.name AS data_unit " +
                "FROM sensor_data sd " +
                "JOIN data_units du ON sd.data_unit_id = du.id " +
                "WHERE sd.sensor_id = ? " +
                "ORDER BY sd.date_and_time DESC";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, sensorId);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                dataList.add(new SensorData(
                        resultSet.getInt("sensor_id"),
                        resultSet.getDouble("sensor_value"),
                        resultSet.getTimestamp("date_and_time").toString(),
                        resultSet.getBoolean("is_anomaly"),
                        resultSet.getString("data_unit")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get sensor data: " + e.getMessage());
        }
        return dataList;
    }

    private static void validateSensorType(int sensorId, String sensorType) {
        String sqlQuery = "SELECT COUNT(*) FROM sensor_unit_types sut JOIN unit_types ut ON sut.unit_type_id = ut.id WHERE sut.sensor_id = ? AND ut.name = ?";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, sensorId);
            statement.setString(2, sensorType);
            ResultSet resultSet = statement.executeQuery();

            resultSet.next();
            if (resultSet.getInt(1) == 0) {
                throw new InvalidSensorTypeException("Sensor " + sensorId + " does not support type " + sensorType);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't validate sensor type: " + e.getMessage());
        }
    }
}
