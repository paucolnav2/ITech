package com.itech.database.DAOs;

import com.itech.database.DatabaseManager;
import com.itech.utils.classes.Machine;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MachineDAO {
    public static Machine getMachineBySensorId(Integer sensorId) {
        String sqlQuery = "SELECT id, name, has_green_state, factory_id FROM machine WHERE id = (SELECT machine_id FROM sensor WHERE id = ?)";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery);
        ) {
            statement.setInt(1, sensorId);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new Machine(resultSet.getInt("id"), resultSet.getString("name"), resultSet.getBoolean("has_green_state"), resultSet.getInt("factory_id"));
            } else {
                throw new SQLException("No machines found by sensor id given");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't get machine from sensor id: "+e.getMessage());
        }
    }
}
