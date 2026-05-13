package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.utils.classes.Factory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class FactoryDAO {
    public static List<Factory> getAllFactories() {
        List<Factory> factories = new ArrayList<>();
        String sqlQuery = "SELECT id, name FROM factory";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery);
                ResultSet resultSet = statement.executeQuery()
        ) {
            while (resultSet.next()) {
                factories.add(new Factory(resultSet.getInt("id"), resultSet.getString("name")));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get factories: " + e.getMessage());
        }
        return factories;
    }

    public static Factory getFactoryById(Integer id) {
        String sqlQuery = "SELECT id, name FROM factory WHERE id = ?";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new Factory(resultSet.getInt("id"), resultSet.getString("name"));
            } else {
                throw new SQLException("No factory found with id " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get factory by id: " + e.getMessage());
        }
    }

    public static Factory getFactoryByMachineId(Integer machineId) {
        String sqlQuery = "SELECT id, name FROM factory WHERE id = (SELECT factory_id FROM machine WHERE id = ?)";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, machineId);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new Factory(resultSet.getInt("id"), resultSet.getString("name"));
            } else {
                throw new SQLException("No factories found by machine id given");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get factory from machine id: " + e.getMessage());
        }
    }
}
