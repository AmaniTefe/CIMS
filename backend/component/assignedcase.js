const assignJudgeToCase = async (db, req, res) => {
  console.log("POST request received at /api/assignJudgeToCase");

  // Extracting data from request body
  const assignedJudge = req.body.selectedJudgeId;
  const caseId = req.body.selectedCaseId;
  try {
    // Update the cases table with the assigned judge
    const updateResult = await db.query(
      "UPDATE cases SET assigned_judge = ? WHERE case_id = ?",
      [assignedJudge, caseId]
    );
    const sqlInsert =
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
    db.query(
      sqlInsert,
      [
        assignedJudge,
        `You've been assigned to a new case with case number ${caseId}`,
      ],
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

    res.json({ message: "Assigned judge to case successfully" });
  } catch (error) {
    console.error("Error assigning judge to case: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default assignJudgeToCase;
