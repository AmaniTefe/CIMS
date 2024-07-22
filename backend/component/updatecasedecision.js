const CaseDecision = async (db, req, res) => {
  const { caseId, decisionText } = req.body;

  try {
    console.log(`Received request to update case decision for case ${caseId}`);

    // Assuming you have columns named `judge_decision` and `case_status` in your `cases` table
    const result = await db.query(
      "UPDATE cases SET judge_decision = ?, case_status = 'closed' WHERE case_id = ?",
      [decisionText, caseId]
    );

    console.log(
      `Decision and case status updated for case ${caseId} successfully!`
    );

    const getRegistrar = `SELECT id FROM users WHERE role = "Registrar"`;
    const registrars = await db.query(getRegistrar);

    const notificationMessage = `A Desicion has been made for case with caseID ${caseId}`;
    for (const registrar of registrars[0]) {
      const sqlInsert =
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
      db.query(
        sqlInsert,
        [registrar.id, notificationMessage],
        function (err, result) {
          if (err) {
            console.error("Error inserting notification:", err);
          }
        }
      );
    }

    res.json({ message: "Decision and case status updated successfully" });
  } catch (error) {
    console.error("Error updating decision and case status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default CaseDecision;
