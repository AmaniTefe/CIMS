const FetchJudges = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        ujt.judge_type
      FROM 
        users u
      INNER JOIN 
        users_judge_type ujt ON u.id = ujt.judge_id
      WHERE 
        u.role = 'judge'
    `;
    const [results] = await global.pool.query(query);
    res.json(results);
  } catch (error) {
    if (res.status) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    } else {
      console.error("res object does not have status method");
    }
  }
};

export default FetchJudges;
