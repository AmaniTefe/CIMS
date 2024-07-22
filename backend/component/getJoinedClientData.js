const getJoinedClientData = (db, req, res) => {
  // Use the MySQL connection pool to execute queries
  db.execute(
    `
    SELECT 
      clients.id, clients.first_name, clients.middle_name, clients.last_name,
      clients.gender, clients.email, clients.mobile_number, clients.address,
      GROUP_CONCAT(CONCAT_WS(' ', clientreferences.id, clientreferences.reference_name, clientreferences.reference_mobile) SEPARATOR ';') AS \`references\`
    FROM clients
    LEFT JOIN clientreferences ON clients.id = clientreferences.client_id
    GROUP BY clients.id
  `
  )
    .then(([rows, fields]) => {
      // Process the result to create an array of references for each client
      const formattedData = rows.map((client) => {
        const references = client.references
          ? client.references.split(";").map((ref) => {
              const [reference_id, reference_name, reference_mobile] =
                ref.split(" ");
              return {
                id: reference_id !== "null" ? reference_id : null,
                reference_name,
                reference_mobile,
              };
            })
          : [];

        return {
          ...client,
          references,
        };
      });

      // Send the formatted result as JSON
      res.json(formattedData);
    })
    .catch((error) => {
      console.error("Error fetching joined client data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export default getJoinedClientData;
