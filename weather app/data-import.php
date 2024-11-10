<?php

    $url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $_GET['city'] . '&appid=b2355334a90e07b0f4b2ace73e49aa03&units=metric';

    // Get data from openweathermap and store in JSON object
    $data = file_get_contents($url);
    $json = json_decode($data, true);

    // Fetch required fields
    $weather_description = $json['weather'][0]['description']; //current cloud status
    $weather_temperature = $json['main']['temp']; //current temperature
    $weather_wind_speed = $json['wind']['speed']; //wind speed
    $weather_humidity = $json['main']['humidity']; //humidity
    $weather_when = date("Y-m-d H:i:s"); // now
    $city = $json['name']; // name of city 
    $icon = $json['weather'][0]['icon'] ;//weather icon

    // Build INSERT SQL statement
    $sql_insert = "INSERT INTO `weather` (weather_description, weather_temperature, weather_wind_speed, weather_humidity, weather_when, city, icon)
    VALUES('{$weather_description}', {$weather_temperature},  {$weather_wind_speed}, {$weather_humidity}, '{$weather_when}', '{$city}', '{$icon}')";

    // Run SQL statement and report errors
    if (!$mysqli -> query($sql_insert)) {
        echo("<h4>SQL error description: " . $mysqli -> error . "</h4>");
    }
?>

