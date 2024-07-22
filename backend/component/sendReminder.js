import twilio from "twilio";

const twilioClient = twilio("", "");

const SendReminder = async (db, req, res) => {
  try {
    const { appointmentId, date, time } = req.body;
    console.log(req.body);
    const phoneNumbersQuery = await db.query(
      "SELECT phone_number FROM appointment_phonenumber_map WHERE appointment_id = ?",
      [appointmentId]
    );
    console.log(phoneNumbersQuery);
    const phoneNumbers = phoneNumbersQuery[0].map((row) => row.phone_number);
    console.log(phoneNumbers);
    await Promise.all(
      phoneNumbers.map(async (phoneNumber) => {
        try {
          await twilioClient.messages.create({
            body: `This a Reminder For Your Court Appointment which is on the Date ${date} at ${time}`,
            from: "", // Your Twilio phone number
            to: phoneNumber,
          });
          console.log(`SMS sent successfully to ${phoneNumber}`);
        } catch (error) {
          console.error(`Error sending SMS to ${phoneNumber}:`, error);
        }
      })
    );

    res
      .status(200)
      .json({ success: true, message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ success: false, error: "Failed to send reminder" });
  }
};

export default SendReminder;
