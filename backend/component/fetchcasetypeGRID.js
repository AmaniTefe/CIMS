const FetchCaseTypeGrid = async (req, res) => {
  try {
    const [results] = await global.pool.query(
      `SELECT * FROM case_sub_type WHERE case_id IS NULL`
    );
    const caseTypes = results.map(
      ({ id, sub_type_name, case_type, case_id }) => ({
        id,
        caseType: case_type,
        caseSubType: sub_type_name,
        caseId: case_id,
      })
    );

    res.json(caseTypes);
  } catch (error) {
    console.error("Error fetching case types: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default FetchCaseTypeGrid;
