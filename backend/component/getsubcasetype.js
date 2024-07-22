const FetchCaseSubType = async (req, res) => {
    try {
      // Extract the case type from the request query
      const { caseType } = req.query;
  
      // Ensure that the case type is provided
      if (!caseType) {
        return res.status(400).json({ error: "Case type is required" });
      }
  
      // Log the received case type
      console.log("Received case type:", caseType);
  
      // Fetch case sub types based on the provided case type
      const [results, fields] = await global.pool.query(
        "SELECT DISTINCT sub_type_name FROM case_sub_type WHERE case_type = ?",
        [caseType]
      );
  
    
  
      // Send the fetched case sub types in the response
      res.json(results);
    } catch (error) {
      console.error("Error fetching case sub types: ", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export default FetchCaseSubType;
  