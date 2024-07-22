const fetchAllProsecutorDocuments = async (req, res) => {
  try {
    const query = `
        SELECT 
          prosecutor_documents.*, 
          users.first_name, 
          users.last_name 
        FROM 
          prosecutor_documents 
        INNER JOIN 
          users 
        ON 
          prosecutor_documents.prosecutor_id = users.id;
      `;

    const [results] = await global.pool.query(query);
    console.log("Received data from the database:", results);
    res.send(results); // Send the results to the client
  } catch (error) {
    console.error("Error fetching all prosecutor documents:", error);
    res.status(500).send({ error: "Internal Server Error" }); // Send error response
  }
};

export default fetchAllProsecutorDocuments;
