package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.utils.classes.Anomaly;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AnomalyDAO {
    public static List<Anomaly> getAnomalies() {
        List<Anomaly> anomalies = new ArrayList<>();
        String sqlQuery =
                "SELECT sd.sensor_id, s.name AS sensor_name, ut.name AS sensor_type, " +
                "       m.id AS machine_id, m.name AS machine_name, " +
                "       f.id AS factory_id, f.name AS factory_name, " +
                "       sd.sensor_value, du.name AS data_unit, sd.date_and_time " +
                "FROM sensor_data sd " +
                "JOIN sensor s ON sd.sensor_id = s.id " +
                "JOIN data_units du ON sd.data_unit_id = du.id " +
                "JOIN unit_types ut ON du.unit_type_id = ut.id " +
                "JOIN machine m ON s.machine_id = m.id " +
                "JOIN factory f ON m.factory_id = f.id " +
                "WHERE sd.is_anomaly = TRUE " +
                "ORDER BY sd.date_and_time DESC " +
                "LIMIT 1000";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery);
                ResultSet resultSet = statement.executeQuery()
        ) {
            while (resultSet.next()) {
                anomalies.add(new Anomaly(
                        resultSet.getInt("sensor_id"),
                        resultSet.getString("sensor_name"),
                        resultSet.getString("sensor_type"),
                        resultSet.getInt("machine_id"),
                        resultSet.getString("machine_name"),
                        resultSet.getInt("factory_id"),
                        resultSet.getString("factory_name"),
                        resultSet.getDouble("sensor_value"),
                        resultSet.getString("data_unit"),
                        resultSet.getTimestamp("date_and_time").toString()
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get anomalies: " + e.getMessage());
        }
        return anomalies;
    }
}
