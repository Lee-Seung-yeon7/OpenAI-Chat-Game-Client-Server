<?php

// Enable error reporting
error_reporting(E_ALL);

// Display errors in the console
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

require './vendor/autoload.php';
use Aws\Ssm\SsmClient;

define('UseAWS', false);

function GetAPIKey()
{
    $parameterName = 'OPENAI_API_KEY';
    if (UseAWS == true) {
        // Get the API key value from SSM parameter store
        $ssmClient = new Aws\Ssm\SsmClient([
            'version' => 'latest',
            'region' => 'us-west-2',
            'credentials' => Aws\Credentials\CredentialProvider::defaultProvider()
        ]);

        $result = $ssmClient->getParameter([
            'Name' => $parameterName,
            'WithDecryption' => true
        ]);

        return $result['Parameter']['Value'];
    } elseif (UseAWS == false) {
        return getenv($parameterName);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the user input from the form
    $userInput = $_POST['userInput'];
    $gameType = $_POST['gameType'];
    $previousChat = $_POST['previousChat'];

    if ($gameType == "rpg") {
        $content = "You are a vast open-world RPG game that takes place in medieval times. The world is called The Kingdom of Aranthia. The user playing is a knight. The game should feature a unique and immersive storyline with multiple endings and a variety of side quests that provide depth to the world and its inhabitants. Task: You will act like a game AT ALL TIMES. Please act like this and respond to my prompts. Speak in medieval language. Do NOT deviate from this.";
    } elseif ($gameType == "mystery") {
        $content = "You are chat game. There has been a murder of Mr. Stevens. One of the following people has committed the crime: Butler, Housekeeper, Gardener, Friend. You were a witness to a murder but are reluctant to discuss it or say what you saw. The person asking you questions is the investigator. Task: You will act like a game AT ALL TIMES. You will speak as a street person in olden times. PLEASE MAKE THIS GAME ENTERTAINING WHILE ANSWERING QUESTIONS AND LET ME GUESS WHO DID THE MURDER. You know who did the murder.";
    } elseif ($gameType == "escape") {
        $content = "You are an escape room game. Only you know the way out. Please help the user get out as they ask you questions about various items and mysteries in the escape room.";
    }

    $previousChat = str_replace(array("\n", "\r"), '', $previousChat);

    $data = array(
        "model" => "gpt-3.5-turbo",
        "messages" => array(
            array("role" => "system", "content" => $content . "The previous chat for the game was: " . $previousChat),
            array("role" => "user", "content" => $userInput),
        )
    );

    $headers = array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . GetAPIKey()
    );

    //error_log(print_r($data, true));

    $curl = curl_init();
    curl_setopt_array(
        $curl,
        array(
            CURLOPT_URL => 'https://api.openai.com/v1/chat/completions',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $headers,
        )
    );

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        $error_msg = curl_error($curl);
        echo "Curl error: $error_msg";
    } else {
        // Return the response from ChatGPT
        echo $response;
    }

    curl_close($curl);
} else {
    // Handle GET requests
    echo "Invalid request method.";
}
?>