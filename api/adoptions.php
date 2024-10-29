<?php
function requestAdoption($json)
{
    include 'db.php';
    $json = json_decode($json, true);
    
    // Check if the user already has a pending adoption request
    $checkSql = "SELECT COUNT(*) FROM tbl_adoptions WHERE UserID = :UserID AND Status = 'Pending'";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindParam(":UserID", $json["UserID"]);
    $checkStmt->execute();
    $pendingCount = $checkStmt->fetchColumn();

    if ($pendingCount > 0) {
        return json_encode(["error" => "You already have a pending adoption request. Please wait for it to be processed."]);
    }

    // If no pending request, proceed with the new request
    $sql = "INSERT INTO tbl_adoptions (petId, UserID, Status, Reason, ReleaseStatus_id) 
            VALUES (:petId, :UserID, :Status, :Reason, :ReleaseStatus_id)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":petId", $json["petId"]);
    $stmt->bindParam(":UserID", $json["UserID"]);
    $stmt->bindParam(":Status", $json["Status"]);
    $stmt->bindParam(":Reason", $json["Reason"]);
    $stmt->bindParam(":ReleaseStatus_id", $json["ReleaseStatus_id"]);
    $stmt->execute();
    return $stmt->rowCount() > 0 ? json_encode(["success" => "Adoption request submitted successfully"]) : json_encode(["error" => "Failed to submit adoption request"]);
}

function approveAdoption($json) {
    include 'db.php';
    $data = json_decode($json, true);
    $conn->beginTransaction();
    try {
        // Update adoption status
        $sql = "UPDATE tbl_adoptions SET Status = 'Approved' WHERE AdoptionID = :AdoptionID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":AdoptionID", $data["AdoptionID"]);
        $stmt->execute();

        // Get the UserID from the adoption request
        $sql = "SELECT UserID, petId FROM tbl_adoptions WHERE AdoptionID = :AdoptionID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":AdoptionID", $data["AdoptionID"]);
        $stmt->execute();
        $adoptionData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$adoptionData) {
            throw new Exception("Adoption request not found");
        }

        // Update pet ownership
        $sql = "UPDATE tbl_pets SET owner_id = :UserID WHERE pet_id = :petId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":UserID", $adoptionData['UserID']);
        $stmt->bindParam(":petId", $adoptionData['petId']);
        $stmt->execute();

        $conn->commit();
        return 1;
    } catch (Exception $e) {
        $conn->rollBack();
        return 0;
    }
}

// Add this to your switch statement
switch ($operation) {
    // ... other cases ...
    case "approveAdoption":
        echo approveAdoption($json);
        break;
    // ... other cases ...
}
