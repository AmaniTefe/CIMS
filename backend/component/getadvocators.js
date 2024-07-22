const getAdvocatorData = (db, req, res) => {
    // Use the MySQL connection pool to execute queries
    db.execute(
      `
      SELECT 
        advocator_id, first_name, middle_name, last_name,
        gender, email, mobile_number, address
      FROM advocators;
    `
    )
      .then(([rows, fields]) => {
        // Send the result as JSON
        res.json(rows);
      })
      .catch((error) => {
        console.error("Error fetching advocator data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  };
  
  export default getAdvocatorData;
  