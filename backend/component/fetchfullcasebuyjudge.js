const FetchCasesByJudge = async (req, db, res) => {
  // Assuming assigned judge ID is sent in req.data
  console.log(req.body);
  const assignedJudgeId = req.body.assignedJudgeId;
  try {
    const query = `
    SELECT
    c.case_id,
    c.case_type,
    c.file_path,
    c.description,
    c.policeStation,
    c.FIRNumber,
    c.FIRDate,
    c.registrationDate,
    u.*,  
    c.case_status,
    c.judge_decision,
    c.is_paid,
    GROUP_CONCAT(DISTINCT pc.client_id) AS petitioner_client_ids,
    GROUP_CONCAT(DISTINCT pc.advocator_id) AS petitioner_advocator_ids,
    GROUP_CONCAT(DISTINCT rc.client_id) AS respondent_client_ids,
    GROUP_CONCAT(DISTINCT rc.advocator_id) AS respondent_advocator_ids,
    cs.sub_type_name,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', pc_client.id,
            'first_name', pc_client.first_name,
            'middle_name', pc_client.middle_name,
            'last_name', pc_client.last_name,
            'email', pc_client.email,
            'address', pc_client.address,
            'mobile_number', pc_client.mobile_number,
            'references',
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('reference_name', cr.reference_name, 'reference_mobile', cr.reference_mobile))
            FROM clientreferences cr
            WHERE cr.client_id = pc_client.id)
        )
    ) AS petitioners_info,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', rc_client.id,
            'first_name', rc_client.first_name,
            'middle_name', rc_client.middle_name,
            'last_name', rc_client.last_name,
            'email', rc_client.email,
            'address', rc_client.address,
            'mobile_number', rc_client.mobile_number,
            'references',
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('reference_name', cr.reference_name, 'reference_mobile', cr.reference_mobile))
            FROM clientreferences cr
            WHERE cr.client_id = rc_client.id)
        )
    ) AS respondents_info,
    (SELECT JSON_OBJECT('id', pa.advocator_id, 'first_name', pa.first_name, 'last_name', pa.last_name) 
    FROM advocators pa 
    WHERE pa.advocator_id IN (SELECT advocator_id FROM petitioner_case_map WHERE case_id = c.case_id) LIMIT 1) 
    AS petitioner_advocate_info,
    (SELECT JSON_OBJECT('id', ra.advocator_id, 'first_name', ra.first_name, 'last_name', ra.last_name) 
    FROM advocators ra 
    WHERE ra.advocator_id IN (SELECT advocator_id FROM respondent_case_map WHERE case_id = c.case_id) LIMIT 1) 
    AS respondent_advocate_info,
    JSON_OBJECT('id', prosecutor.id, 'first_name', prosecutor.first_name, 'last_name', prosecutor.last_name, 'role', prosecutor.role) AS prosecutor_info,
    cs.case_type AS sub_type_case_type,
    JSON_ARRAYAGG(
      JSON_OBJECT(
          'id', odc.id,
          'file_path', odc.file_path,
          'description', odc.description
      )
  ) AS other_documents_info
FROM 
    cases c
LEFT JOIN 
    petitioner_case_map pc ON c.case_id = pc.case_id
LEFT JOIN 
    respondent_case_map rc ON c.case_id = rc.case_id
LEFT JOIN 
    case_sub_type cs ON c.case_id = cs.case_id
LEFT JOIN 
    clients pc_client ON pc.client_id = pc_client.id
LEFT JOIN 
    clients rc_client ON rc.client_id = rc_client.id
LEFT JOIN 
    users u ON c.assigned_judge = u.id 
LEFT JOIN 
    users prosecutor ON pc.prosecutor_id = prosecutor.id
LEFT JOIN 
    otherdocumentcases odc ON c.case_id = odc.case_id
WHERE 
    c.assigned_judge = ?
GROUP BY
    c.case_id,
    c.case_type,
    c.file_path,
    c.description,
    c.policeStation,
    c.FIRNumber,
    c.FIRDate,
    c.registrationDate,
    u.id, 
    c.case_status,
    c.judge_decision,
    c.is_paid,
    cs.sub_type_name,
    cs.case_type,
    prosecutor.id;

`;

    const [results] = await global.pool.query(query, [assignedJudgeId]);

    const uniqueResults = results.map((result) => {
      const uniqueRespondents = Array.from(
        new Set(result.respondents_info.map((respondent) => respondent.id))
      ).map((id) => {
        return result.respondents_info.find(
          (respondent) => respondent.id === id
        );
      });

      const uniquePetitioners = Array.from(
        new Set(result.petitioners_info.map((petitioner) => petitioner.id))
      ).map((id) => {
        return result.petitioners_info.find(
          (petitioner) => petitioner.id === id
        );
      });

      const uniqueOtherDocuments = Array.from(
        new Set(result.other_documents_info.map((document) => document.id))
      ).map((id) => {
        return result.other_documents_info.find(
          (document) => document.id === id
        );
      });

      return {
        ...result,
        respondents_info: uniqueRespondents,
        petitioners_info: uniquePetitioners,
        other_documents_info: uniqueOtherDocuments,
      };
    });

    res.json(uniqueResults);
  } catch (error) {
    console.error("Error fetching cases by assigned judge:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default FetchCasesByJudge;
