const DeleteAppointment = async (db, req, res) => {
    const { appointmentId } = req.body;
  
    try {
      await db.query("DELETE FROM appointment WHERE appointment_id = ?", [appointmentId]);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export default DeleteAppointment;
  