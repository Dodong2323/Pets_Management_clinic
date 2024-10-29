<?php
function getOwnerPetsIncludingAdopted($json) {
    include 'db.php';
    $data = json_decode($json, true);
    $sql = "SELECT p.*, s.species_name, b.breed_name, a.Status as adoption_status
            FROM tbl_pets p
            LEFT JOIN tbl_species s ON s.species_id = p.species_id
            LEFT JOIN tbl_breeds b ON b.breed_id = p.breed_id
            LEFT JOIN tbl_adoptions a ON a.petId = p.pet_id
            WHERE p.owner_id = :owner_id OR (a.UserID = :owner_id AND a.Status = 'Approved')";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":owner_id", $data["UserID"]);
    $stmt->execute();
    return $stmt->rowCount() > 0 ? json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)) : json_encode([]);
}

// In the switch statement:
case "getOwnerPetsIncludingAdopted":
    echo getOwnerPetsIncludingAdopted($_POST["json"]);
    break;
