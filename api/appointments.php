<?php
// ... (previous code)

class AppointmentOperations {
    // ... (other functions)

    function approveAppointment($appointmentId) {
        include 'db.php';
        $conn->beginTransaction();

        try {
            // Update appointment status
            $sql = "UPDATE tbl_appointment SET Status = 'Approved' WHERE AppointmentID = :AppointmentID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":AppointmentID", $appointmentId);
            $stmt->execute();

            // Get appointment details
            $sql = "SELECT UserID, pet_id, ServiceID, AppointmentDate, AppointmentTime FROM tbl_appointment WHERE AppointmentID = :AppointmentID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":AppointmentID", $appointmentId);
            $stmt->execute();
            $appointmentDetails = $stmt->fetch(PDO::FETCH_ASSOC);

            // Create a notification for the owner
            $notificationMessage = "Your appointment for " . $appointmentDetails['AppointmentDate'] . " at " . $appointmentDetails['AppointmentTime'] . " has been approved.";
            $sql = "INSERT INTO notifications (UserID, Message, CreatedAt) VALUES (:UserID, :Message, NOW())";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":UserID", $appointmentDetails['UserID']);
            $stmt->bindParam(":Message", $notificationMessage);
            $stmt->execute();

            $conn->commit();
            return ["success" => true, "message" => "Appointment approved successfully"];
        } catch (Exception $e) {
            $conn->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    function listAllAppointments()
    {
        include 'db.php';
        $sql = "SELECT a.AppointmentID, a.AppointmentDate, a.AppointmentTime, a.ReasonForVisit, 
                a.CreatedAt, a.UpdatedAt, b.pet_name, CONCAT(c.user_firstname, ' ', c.user_lastname) AS fullName, e.ServiceName, a.Status 
                FROM tbl_appointment a
                INNER JOIN tbl_pets b ON b.pet_id = a.pet_id
                INNER JOIN users c ON c.UserID = a.UserID
                INNER JOIN tbl_services e ON e.ServiceID = a.ServiceID
                ORDER BY a.AppointmentID ASC"; // Added ORDER BY clause
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        return $stmt->rowCount() > 0 ? json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)) : json_encode([]);
    }
}

// ... (in the switch statement)
switch ($operation) {
    // ... (other cases)
    case "approveAppointment":
        $appointmentId = $_POST['AppointmentID'];
        echo json_encode($appointmentOps->approveAppointment($appointmentId));
        break;
    // ... (other cases)
}
