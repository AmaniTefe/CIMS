const GetCases = async (req, res) => {
    try {
      const [results] = await global.pool.query(
        "SELECT `case_id`, `case_type` FROM `cases`"
      );
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
  
  export default GetCases;
  