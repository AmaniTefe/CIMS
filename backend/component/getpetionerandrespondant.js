export const GetPetitioners = async (db, req, res) => {
  const caseId = req.params.caseId;
  try {
    const [petitioners] = await db.query(
      "SELECT clients.first_name AS petitioner_first_name, clients.email AS petitioner_email, clients.mobile_number AS petitioner_mobile_number, (SELECT advocators.first_name FROM advocators WHERE advocators.advocator_id = petitioner_case_map.advocator_id) AS advocate_first_name, (SELECT advocators.email FROM advocators WHERE advocators.advocator_id = petitioner_case_map.advocator_id) AS advocate_email, (SELECT advocators.mobile_number FROM advocators WHERE advocators.advocator_id = petitioner_case_map.advocator_id) AS advocate_mobile_number FROM clients LEFT JOIN petitioner_case_map ON clients.id = petitioner_case_map.client_id WHERE petitioner_case_map.case_id = ?",
      [caseId]
    );
    console.log("Petitioners:", petitioners); // Log the petitioners
    res.json(petitioners);
  } catch (error) {
    console.error("Error fetching petitioners:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetRespondents = async (db, req, res) => {
  const caseId = req.params.caseId;
  try {
    const [respondents] = await db.query(
      "SELECT clients.first_name AS respondent_first_name, clients.email AS respondent_email, clients.mobile_number AS respondent_mobile_number, (SELECT advocators.first_name FROM advocators WHERE advocators.advocator_id = respondent_case_map.advocator_id) AS advocate_first_name, (SELECT advocators.email FROM advocators WHERE advocators.advocator_id = respondent_case_map.advocator_id) AS advocate_email, (SELECT advocators.mobile_number FROM advocators WHERE advocators.advocator_id = respondent_case_map.advocator_id) AS advocate_mobile_number FROM clients LEFT JOIN respondent_case_map ON clients.id = respondent_case_map.client_id WHERE respondent_case_map.case_id = ?",
      [caseId]
    );
    console.log("Respondents:", respondents); // Log the respondents
    res.json(respondents);
  } catch (error) {
    console.error("Error fetching respondents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
