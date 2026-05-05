package com.itech.utils.helpers;

public class HttpParser {
    public static String getRoute (String[] httpText) {
        String stringRoute = httpText[0].split(" ")[1];
        if (stringRoute.contains("?")) {
            return stringRoute.split("\\?")[0];
        }
        return stringRoute;
    }

    public static String getMethod (String[] httpText) {
        return httpText[0].split(" ")[0];
    }

    public static int getContentLength (String[] httpText) {
        for (String line : httpText) {
            if (line.startsWith("Content-Length:")) {
                String stringContentLength = line.split(" ")[1];
                if (!stringContentLength.matches("\\d+")) {
                    throw new IllegalArgumentException("Failed conversion of content length of http message");
                }
                return Integer.parseInt(stringContentLength);
            }
        }
        throw new IllegalArgumentException("Failed to find content length in http message");
    }

    public static String buildHttpResponse(int code, String body) {
        String httpMessage = "HTTP/1.1 "+code+" "+httpCodeToMessage(code)+"\r\n";

        httpMessage = httpMessage.concat("Content-Type: application/json\r\n");

        httpMessage = httpMessage.concat("Content-Length: "+body.length()+"\r\n");

        httpMessage = httpMessage.concat("\r\n");

        httpMessage = httpMessage.concat(body);

        return httpMessage;
    }

    public static String httpCodeToMessage (int code) {
        return switch (code) {
            case 200 -> "OK";
            case 201 -> "Created";
            case 400 -> "Bad Request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not Found";
            case 405 -> "Method Not Allowed";
            case 418 -> "I'm a teapot";
            default -> throw new IllegalArgumentException("Code given unknown");
        };
    }
}
