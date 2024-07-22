const UpdateCase = async (db, req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the entire request body

        const { caseId, clientDetail, caseDetails } = req.body;

        // Extract data from clientDetail and caseDetails
        const { selectedPetitioners, petitionerAdvocate, respondents, respondentAdvocate, documentFileName, petiionerProscutor } = clientDetail;
        const { caseType, caseSubType, description, policeStation, FIRNumber, FIRDate, registrationDate } = caseDetails;

        // Update cases table
        const updateCaseQuery = `
            UPDATE cases 
            SET case_type=?, description=?, policeStation=?, FIRNumber=?, FIRDate=?, registrationDate=?, file_path=?
            WHERE case_id=?
        `;
        await db.query(updateCaseQuery, [caseType, description, policeStation, FIRNumber, FIRDate, registrationDate, documentFileName, caseId]);

        // Delete existing petitioner and respondent information
        const deletePetitionerQuery = `DELETE FROM petitioner_case_map WHERE case_id=?`;
        await db.query(deletePetitionerQuery, [caseId]);

        const deleteRespondentQuery = `DELETE FROM respondent_case_map WHERE case_id=?`;
        await db.query(deleteRespondentQuery, [caseId]);

        // Insert new petitioner information
        let advocatorIdValue = null;
        let prosecutorIdValue = null;
        if (caseType === 'criminal') {
            prosecutorIdValue = petiionerProscutor || null;
        } else if (caseType === 'civil') {
            advocatorIdValue = petitionerAdvocate || null;
        }

        const insertPetitionerQuery = `
            INSERT INTO petitioner_case_map (case_id, client_id, advocator_id, prosecutor_id)
            VALUES (?, ?, ?, ?)
        `;
        for (const petitionerId of selectedPetitioners) {
            await db.query(insertPetitionerQuery, [caseId, petitionerId, advocatorIdValue, prosecutorIdValue]);
        }

        // Insert new respondent information
        const insertRespondentQuery = `
            INSERT INTO respondent_case_map (case_id, client_id, advocator_id)
            VALUES (?, ?, ?)
        `;
        for (const respondentId of respondents) {
            await db.query(insertRespondentQuery, [caseId, respondentId, respondentAdvocate]);
        }

        // Update case_sub_type table
        const updateCaseSubTypeQuery = `
            UPDATE case_sub_type 
            SET sub_type_name=?, case_type=?
            WHERE case_id=?
        `;
        await db.query(updateCaseSubTypeQuery, [caseSubType, caseType, caseId]);

        res.status(200).json({ message: 'Case updated successfully.', caseId });
    } catch (error) {
        console.error('Error updating case:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default UpdateCase;
