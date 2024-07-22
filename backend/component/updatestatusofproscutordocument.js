const updateDocumentStatus = async (db, req, res) => {
  const { docId, prosecutorId, status } = req.body;
  console.log(docId, prosecutorId, status);
  try {
    // Update the status of the document in the database
    await db.query("UPDATE prosecutor_documents SET status = ? WHERE id = ?", [
      status,
      docId,
    ]);
    const sqlInsert =
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
    db.query(
      sqlInsert,
      [prosecutorId, `Your Case with Document Id ${docId} has been ${status}`],
      function (err, result) {
        if (err) {
          console.error("Error inserting notification:", err);
          return res
            .status(500)
            .json({ error: "Error inserting notification" });
        }
        res.json({ message: "Assigned judge to case successfully" });
      }
    );
    res.json({ message: "Document status updated successfully" });
  } catch (error) {
    console.error("Error updating document status: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateDocumentStatus;
