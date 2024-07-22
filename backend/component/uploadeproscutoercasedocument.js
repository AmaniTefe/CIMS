const uploadProscutorCaseDocument = async (db, req, res) => {
  try {
    const filePath = req.file.filename; // Get the path of the uploaded file
    console.log("Uploaded file path:", filePath); // Log the file path

    // Retrieve the description and prosecutor_id from the request body
    const { description, prosecutor_id } = req.body;

    // Log the received data
    console.log("Received data from frontend:");
    console.log("Description:", description);
    console.log("File Path:", filePath);
    console.log("Prosecutor ID:", prosecutor_id);

    // Insert data into the prosecutor_documents table
    const insertDocumentQuery = `INSERT INTO prosecutor_documents (description, file_path, prosecutor_id) VALUES (?, ?, ?)`;
    await db.query(insertDocumentQuery, [description, filePath, prosecutor_id]);
    const getRegistrar = `SELECT id FROM users WHERE role = "Registrar"`;
    const registrars = await db.query(getRegistrar);

    const notificationMessage = `A new document has been uploaded by the prosecutor by The ID of ${prosecutor_id}`;
    for (const registrar of registrars[0]) {
      const sqlInsert =
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
      db.query(
        sqlInsert,
        [registrar.id, notificationMessage],
        function (err, result) {
          if (err) {
            console.error("Error inserting notification:", err);
          }
        }
      );
    }
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    // Send an error response back to the client
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export default uploadProscutorCaseDocument;
