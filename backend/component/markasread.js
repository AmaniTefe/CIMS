const markAsRead = async (db, req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.body.userId; // Corrected variable name
    console.log(userId);
    // Update the status of notifications for the user to false
    db.query(
      "UPDATE notifications SET status = false WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.error("Error updating notifications:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "All notifications marked as read" });
      }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default markAsRead;
