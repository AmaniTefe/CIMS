const AddService = async (db, req, res) => {
  const sevicedata = req.body;

  try {
    const [results] = await db.query("INSERT INTO services SET?", {
      name: sevicedata.name,
      amount: sevicedata.amount,
    });
    res.json({
      message: "service inserted successfully",
      userId: results.insertId,
    });
  } catch (error) {
    console.error("Error creating service: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default AddService;
