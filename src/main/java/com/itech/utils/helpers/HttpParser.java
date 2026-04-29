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
}
