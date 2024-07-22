const GetCaseCount = async (req, res) => {
  try {
    const [results] = await global.pool.query(
      "SELECT MAX(case_id) AS maxCaseId FROM cases"
    );
    const { maxCaseId } = results[0];
    console.log("Maximum Case ID:", maxCaseId); // Log the maximum case ID
    res.json({ count: maxCaseId });
  } catch (error) {
    console.error("Error fetching case count: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default GetCaseCount;
