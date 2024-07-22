const AddCase = async (db, req, res) => {
  try {
    const caseData = req.body;
    console.log(caseData);
    const {
      caseType,
      description,
      policeStation,
      FIRNumber,
      FIRDate,
      registrationDate,
    } = caseData.caseDetails;
    const { documentFileName } = caseData.clientDetail;
    console.log(documentFileName);
    // Insert into cases table with documentFileName
    const insertCaseQuery = `
            INSERT INTO cases (case_type, description, policeStation, FIRNumber, FIRDate, registrationDate, file_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const caseResult = await db.query(insertCaseQuery, [
      caseType,
      description,
      policeStation,
      FIRNumber,
      FIRDate,
      registrationDate,
      documentFileName,
    ]);

    // Get the inserted case_id
    const caseId = caseResult[0].insertId;

    // Log the caseId
    console.log("Inserted case_id:", caseId);

    let advocatorIdValue = null;
    let prosecutorIdValue = null;
    if (caseType === "criminal") {
      prosecutorIdValue = caseData.clientDetail.petiionerProscutor || null;
    } else if (caseType === "civil") {
      advocatorIdValue = caseData.clientDetail.petitionerAdvocate || null;
    }

    // Insert into petitioner_case_map table
    const { selectedPetitioners } = caseData.clientDetail;
    const insertPetitionerQuery = `
            INSERT INTO petitioner_case_map (case_id, client_id, advocator_id, prosecutor_id)
            VALUES (?, ?, ?, ?)
        `;
    for (const petitionerId of selectedPetitioners) {
      await db.query(insertPetitionerQuery, [
        caseId,
        petitionerId,
        advocatorIdValue,
        prosecutorIdValue,
      ]);
    }

    // Insert into respondent_case_map table
    const { respondents, respondentAdvocate } = caseData.clientDetail;
    for (const respondentId of respondents) {
      const insertRespondentQuery = `
                INSERT INTO respondent_case_map (case_id, client_id, advocator_id)
                VALUES (?, ?, ?)
            `;
      await db.query(insertRespondentQuery, [
        caseId,
        respondentId,
        respondentAdvocate,
      ]);
    }

    // Insert into case_sub_type table
    const { caseSubType } = caseData.caseDetails;
    const insertCaseSubTypeQuery = `
            INSERT INTO case_sub_type (sub_type_name, case_type, case_id)
            VALUES (?, ?, ?)
        `;
    await db.query(insertCaseSubTypeQuery, [caseSubType, caseType, caseId]);

    const getInvoiceClerksQuery = `SELECT id FROM users WHERE role = "Invoice_Clerk"`;
    const invoiceClerks = await db.query(getInvoiceClerksQuery);

    const notificationMessage = `A New Case Have Been Added with Case Number ${caseId}`;
    for (const clerk of invoiceClerks[0]) {
      const sqlInsert =
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
      db.query(
        sqlInsert,
        [clerk.id, notificationMessage],
        function (err, result) {
          if (err) {
            console.error("Error inserting notification:", err);
          }
        }
      );
    }
    const insertforprosecutor =
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
    db.query(
      insertforprosecutor,
      [
        prosecutorIdValue,
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
    res.status(200).json({ message: "Case added successfully.", caseId });
  } catch (error) {
    console.error("Error adding case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default AddCase;
