const GetAppointmnetCases = async (req, res) => {
    try {
      const judgeId = req.body.judgeId; 
      console.log("judge id is ",judgeId)
      const query = "SELECT `case_id`, `case_type` FROM `cases` WHERE `assigned_judge` = ?";
      const [results] = await global.pool.query(query, [judgeId]);
      console.log(results); // Log SQL results
      res.json(results);
    } catch (error) {
      console.error("Error fetching cases: ", error);
      console.log(res); // Log the res object
      // Check if res is an instance of Express Response object
      if (res.status) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
      } else {
        console.error("res object does not have status method");
      }
    }
  };
  
  export default GetAppointmnetCases;