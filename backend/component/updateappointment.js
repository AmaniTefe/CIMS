import twilio from "twilio";

const twilioClient = twilio("", "");

const UpdateAppointment = async (db, req, res) => {
  try {
    console.log("UpdateAppointment API triggered");

    const result = req.body;
    console.log(result.appointmentId);
    if (!result.appointmentId || !result.date || !result.time || !result.note) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({
        error:
          "Missing required fields. Please provide all required information.",
      });
    }

    // Update appointment data in the appointments table
    const updateResult = await db.query(
      "UPDATE appointment SET date = ?, time = ?, note = ? WHERE appointment_id = ?",
      [result.date, result.time, result.note, result.appointmentId]
    );

    if (updateResult.affectedRows === 0) {
      console.error(`No appointment found with ID ${result.appointmentId}`);
      return res.status(404).json({
        error: `No appointment found with ID ${result.appointmentId}`,
      });
    }

    // Retrieve phone numbers associated with the appointment ID
    const phoneNumbersQuery = await db.query(
      "SELECT phone_number FROM appointment_phonenumber_map WHERE appointment_id = ?",
      [result.appointmentId]
    );
    console.log(phoneNumbersQuery);
    // Extract phone numbers from the query result
    const phoneNumbers = phoneNumbersQuery[0].map((row) => row.phone_number);
    console.log(phoneNumbers);
    await Promise.all(
      phoneNumbers.map(async (phoneNumber) => {
        try {
          await twilioClient.messages.create({
            body: `Your Court appointment has been updated. The New Date is ${result.date} and The New Time is ${result.time}, Note: ${result.note}`,
            from: "", // Your Twilio phone number
            to: phoneNumber,
          });
          console.log(`SMS sent successfully to ${phoneNumber}`);
        } catch (error) {
          console.error(`Error sending SMS to ${phoneNumber}:`, error);
        }
      })
    );

    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default UpdateAppointment;
