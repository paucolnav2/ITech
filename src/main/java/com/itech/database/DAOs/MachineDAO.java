package com.itech.database.DAOs;

import com.itech.config.ConfigLoader;
import com.itech.database.DatabaseManager;
import com.itech.utils.classes.Machine;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MachineDAO {
    public static List<Machine> getAllMachines() {
        List<Machine> machines = new ArrayList<>();
        String sqlQuery = "SELECT id, name, has_green_state, factory_id FROM machine";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery);
                ResultSet resultSet = statement.executeQuery()
        ) {
            while (resultSet.next()) {
                machines.add(new Machine(
                        resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getBoolean("has_green_state"),
                        resultSet.getInt("factory_id")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get machines: " + e.getMessage());
        }
        return machines;
    }

    public static Machine getMachineById(Integer id) {
        String sqlQuery = "SELECT id, name, has_green_state, factory_id FROM machine WHERE id = ?";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new Machine(
                        resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getBoolean("has_green_state"),
                        resultSet.getInt("factory_id")
                );
            } else {
                throw new SQLException("No machine found with id " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get machine by id: " + e.getMessage());
        }
    }

    public static List<Machine> getMachinesByFactoryId(Integer factoryId) {
        List<Machine> machines = new ArrayList<>();
        String sqlQuery = "SELECT id, name, has_green_state, factory_id FROM machine WHERE factory_id = ?";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, factoryId);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                machines.add(new Machine(
                        resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getBoolean("has_green_state"),
                        resultSet.getInt("factory_id")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get machines by factory id: " + e.getMessage());
        }
        return machines;
    }

    public static Machine getMachineBySensorId(Integer sensorId) {
        String sqlQuery = "SELECT id, name, has_green_state, factory_id FROM machine WHERE id = (SELECT machine_id FROM sensor WHERE id = ?)";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, sensorId);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new Machine(resultSet.getInt("id"), resultSet.getString("name"), resultSet.getBoolean("has_green_state"), resultSet.getInt("factory_id"));
            } else {
                throw new SQLException("No machines found by sensor id given");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get machine from sensor id: " + e.getMessage());
        }
    }

    public static void updateMachineState(int machineId, boolean isGreen) {
        String sqlQuery = "UPDATE machine SET has_green_state = ? WHERE id = ?";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setBoolean(1, isGreen);
            statement.setInt(2, machineId);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't update machine state: " + e.getMessage());
        }
    }

    public static boolean machineHasRecentAnomalies(int machineId) {
        Integer intervalSeconds = ConfigLoader.getGreenStateSwitchingTimeInterval();
        String sqlQuery =
                "SELECT COUNT(*) > 0 AS has_anomalies " +
                "FROM sensor_data sd " +
                "JOIN sensor s ON sd.sensor_id = s.id " +
                "WHERE s.machine_id = ? AND sd.is_anomaly = TRUE " +
                "AND sd.date_and_time >= NOW() - INTERVAL ? SECOND";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, machineId);
            statement.setInt(2, intervalSeconds);
            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            return resultSet.getBoolean("has_anomalies");
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't check machine anomalies: " + e.getMessage());
        }
    }
}
