const deleteCase = async (db, req, res) => {
  console.log("DELETE request received at /api/deleteCase");
  const caseId = req.body.id;
  console.log(caseId);
  try {
    const makeCaseIdinInvoiceNull = `UPDATE invoices SET case_id = NULL WHERE case_id = ?;`;
    const makeCaseIdinInvoiceNullResult = await db.query(
      makeCaseIdinInvoiceNull,
      [caseId]
    );
    const deletePetitionerMapQuery =
      "DELETE FROM petitioner_case_map WHERE case_id = ?";
    const deletePetitionerMapResult = await db.query(deletePetitionerMapQuery, [
      caseId,
    ]);
    console.log(
      "Result from deleting petitioner_case_map:",
      deletePetitionerMapResult
    );

    // Delete from respondent_case_map table
    const deleteRespondentMapQuery =
      "DELETE FROM respondent_case_map WHERE case_id = ?";
    const deleteRespondentMapResult = await db.query(deleteRespondentMapQuery, [
      caseId,
    ]);
    console.log(
      "Result from deleting respondent_case_map:",
      deleteRespondentMapResult
    );

    // Delete from case type table
    const deleteCaseTypeQuery = "DELETE FROM case_sub_type WHERE case_id = ?";
    const deleteCaseTypeResult = await db.query(deleteCaseTypeQuery, [caseId]);
    console.log("Result from deleting case_type:", deleteCaseTypeResult);

    // Finally, delete from cases table
    const deleteCaseQuery = "DELETE FROM cases WHERE case_id = ?";
    const deleteCaseResult = await db.query(deleteCaseQuery, [caseId]);
    console.log("Result from deleting case:", deleteCaseResult);

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error("Error deleting case: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteCase;
