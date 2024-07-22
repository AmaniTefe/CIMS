const GetAppointment = async (req, res) => {
  try {
    const judgeId = req.body.judgeId;
    console.log("judge id is ", judgeId);
    const query = "SELECT * FROM `appointment` WHERE `judge_id` = ?";
    const [results] = await global.pool.query(query, [judgeId]);
    console.log(results); // Log SQL results
    res.json(results);
  } catch (error) {
    console.error("Error fetching appointments: ", error);
    // Check if res is an instance of Express Response object
    if (res.status) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    } else {
      console.error("res object does not have status method");
    }
  }
};

export default GetAppointment;
