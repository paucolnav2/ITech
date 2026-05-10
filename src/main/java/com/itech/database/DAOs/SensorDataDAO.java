package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.database.anomalyHandling.AnomalyHandler;
import com.itech.utils.customExceptions.InvalidSensorTypeException;
import com.itech.utils.helpers.GeneralParser;

import java.sql.*;

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
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't save sensor data: "+e.getMessage());
        }
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
            throw new RuntimeException("Couldn't validate sensor type: "+e.getMessage());
        }
    }
}
