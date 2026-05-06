package com.itech.odoo;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.itech.config.ConfigLoader;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class OdooClient {
    private static final String ODOO_URL = "http://" + ConfigLoader.getOdooIPDirection()+ ":"+ConfigLoader.getOdooPort()+"/jsonrpc";
    private static final String ODOO_DB = ConfigLoader.getOdooDatabase();
    private static final String ODOO_USER = ConfigLoader.getOdooUser();
    private static final String ODOO_PASSWORD = ConfigLoader.getOdooPassword();

    private static final Gson gson = new Gson();
    private static Integer UID = null;

    public static synchronized Integer getOdooUID() {
        if (UID == null) {
            UID = login();
        }
        return UID;
    }

    private static Integer login() {
        try {
            JsonObject body = new JsonObject();

            body.addProperty("jsonrpc", "2.0");
            body.addProperty("method", "call");

            JsonObject params = new JsonObject();
            params.addProperty("service", "common");
            params.addProperty("method", "login");

            JsonObject args = new JsonObject();
            args.addProperty("db", ODOO_DB);
            args.addProperty("login", ODOO_USER);
            args.addProperty("password", ODOO_PASSWORD);

            params.add("args", gson.toJsonTree(new Object[] {ODOO_DB, ODOO_USER, ODOO_PASSWORD}));

            body.add("params", params);

            String response = sendRequest(body.toString());

            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);

            return jsonResponse.get("result").getAsInt();
        } catch (Exception e) {
            throw new RuntimeException("Odoo login failed: "+e.getMessage());
        }
    }

    public static void createTicket(Integer UID, String name, String description) {
        try {
            JsonObject body = new JsonObject();

            body.addProperty("jsonrpc", "2.0");
            body.addProperty("method", "call");

            JsonObject params = new JsonObject();
            params.addProperty("service", "object");
            params.addProperty("method", "execute_kw");

            Object[] args = new Object[]{
                    ODOO_DB, UID, ODOO_PASSWORD, "helpdesk.ticket", "create",
                    new Object[]{
                            new Object[]{
                                    new Object[]{
                                            "name", name
                                    },
                                    new Object[]{
                                            "description", description
                                    }
                            }
                    }
            };

            params.add("args", gson.toJsonTree(args));

            body.add("params", params);

            sendRequest(body.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error creating Odoo ticket: " + e.getMessage());
        }
    }

    private static String sendRequest(String body) {
        try {
            URL url = new URL(ODOO_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(body.getBytes());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));

            String response = "";
            boolean isFirstLine = true;

            String line;
            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    response = response.concat(line);
                    isFirstLine = false;
                } else {
                    response = response.concat("\r\n" + line);
                }
            }

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error sending request to Odoo API: "+e.getMessage());
        }
    }
}
