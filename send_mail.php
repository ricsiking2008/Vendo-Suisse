<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and clean the data
    $name    = strip_tags(trim($_POST["name"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject_line = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);

    // --- CONFIGURATION ---
    $recipient = "andras.sapi@vendoswiss.ch"; // Where the email goes
    $email_subject = "Web-Kontakt: $subject_line";
    
    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Nachricht:\n$message\n";

    // Build the email headers
    $email_headers = "From: $name <$email>";

    // Send the email
    if (mail($recipient, $email_subject, $email_content, $email_headers)) {
        // Success: Redirect back to a thank you page or show a message
        echo "<h1>Vielen Dank! Ihre Nachricht wurde gesendet.</h1>";
        echo "<a href='kontakt.html'>Zurück zur Website</a>";
    } else {
        // Error
        echo "Hoppla! Etwas ist schiefgelaufen.";
    }
} else {
    // If someone tries to access the script directly, send them away
    header("Location: kontakt.html");
    exit;
}
?>