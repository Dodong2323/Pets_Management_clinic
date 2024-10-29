<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

class NotificationOperations {
    function createNotification($json) {
        include 'db.php';
        $data = json_decode($json, true);
        $sql = "INSERT INTO notifications (UserID, Message, CreatedAt) VALUES (:UserID, :Message, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":UserID", $data["UserID"]);
        $stmt->bindParam(":Message", $data["Message"]);
        $stmt->execute();
        return $stmt->rowCount() > 0 ? 1 : 0;
    }

    function getNotifications($json) {
        include 'db.php';
        $data = json_decode($json, true);
        $sql = "SELECT * FROM notifications WHERE UserID = :UserID ORDER BY CreatedAt DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":UserID", $data["UserID"]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    function markNotificationAsRead($json) {
        include 'db.php';
        $data = json_decode($json, true);
        $sql = "UPDATE notifications SET IsRead = TRUE WHERE NotificationID = :NotificationID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":NotificationID", $data["NotificationID"]);
        $stmt->execute();
        return $stmt->rowCount() > 0 ? 1 : 0;
    }

    function deleteNotification($json) {
        include 'db.php';
        $data = json_decode($json, true);
        $sql = "DELETE FROM notifications WHERE NotificationID = :NotificationID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":NotificationID", $data["NotificationID"]);
        $stmt->execute();
        return $stmt->rowCount() > 0 ? 1 : 0;
    }
}

$json = isset($_POST["json"]) ? $_POST["json"] : "0";
$operation = isset($_POST["operation"]) ? $_POST["operation"] : "0";

$notificationOps = new NotificationOperations();
switch ($operation) {
    case "createNotification":
        echo $notificationOps->createNotification($json);
        break;
    case "getNotifications":
        echo json_encode($notificationOps->getNotifications($json));
        break;
    case "markNotificationAsRead":
        echo $notificationOps->markNotificationAsRead($json);
        break;
    case "deleteNotification":
        echo $notificationOps->deleteNotification($json);
        break;
    default:
        echo json_encode(["error" => "Invalid operation"]);
        break;
}
