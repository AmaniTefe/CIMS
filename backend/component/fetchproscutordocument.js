const FetchCasesByProsecutor = async (req, db, res) => {
  console.log("This is triggered");
  const prosecutorId = req.body.prosecutorId; // Adjust this based on the key in your request body
  console.log(prosecutorId);
  try {
    const query = `
        SELECT * FROM prosecutor_documents
        WHERE prosecutor_id = ?;
      `;

    const [results] = await global.pool.query(query, [prosecutorId]);
    console.log("Received data from the database:", results);
    res.send(results); // Send the results to the client
  } catch (error) {
    console.error("Error fetching cases by prosecutor:", error);
    res.status(500).send({ error: "Internal Server Error" }); // Send error response
  }
};

export default FetchCasesByProsecutor;
