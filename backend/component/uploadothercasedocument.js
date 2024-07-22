
const uploadOtherCases = async (db, req, res) => {
    try {
        const filePath = req.body.fileName; // Get the path of the uploaded file
        console.log("Uploaded file path:", filePath); // Log the file path

        // Retrieve the case ID and description from the request body
        const { caseId, description } = req.body;

        // Log the received data
        console.log("Received data from frontend:");
        console.log("Case ID:", caseId);
        console.log("File Path:", filePath);
        console.log("Description:", description);

        // Insert the received data into the otherdocumentcases table
        const insertQuery = `INSERT INTO otherdocumentcases (case_id, file_path, description) VALUES (?, ?, ?)`;
        await db.query(insertQuery, [caseId, filePath, description]);

        // Send a success response back to the client
        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file:", error);
        // Send an error response back to the client
        res.status(500).json({ error: "Failed to upload file" });
    }
};
export default uploadOtherCases;
