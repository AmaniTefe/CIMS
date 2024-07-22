const HighestInvoice = async (db, req, res) => {
  try {
    // Query to fetch the highest invoice number
    const query = `SELECT MAX(CAST(SUBSTRING(invoice_number, 5) AS UNSIGNED)) AS highest_number FROM invoices WHERE invoice_number LIKE 'INV-%';`;

    // Log the SQL query being executed
    console.log("SQL Query:", query);

    // Execute the query
    const result = await db.query(query);

    // Log the result
    console.log("Query Result:", result);

    // Extract the highest invoice number from the result
    const highestNumber = result[0][0].highest_number || 0;

    // Log the extracted highest number
    console.log("Extracted Highest Number:", highestNumber);

    // Send the highest invoice number in the response
    res.status(200).json({ highestNumber });
  } catch (error) {
    // Log and send any errors in the response
    console.error("Error fetching highest invoice number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default HighestInvoice;
