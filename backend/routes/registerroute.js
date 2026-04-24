app.post("/api/employer/register", async (req, res) => {
  const { name, email, password, secretCode } = req.body;

  try {

    
    if (secretCode !== "NAUKRI2026") {
      return res.status(403).json({ message: "Invalid Employer Access Code" });
    }

    const existingEmployer = await User.findOne({ email });

    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const newEmployer = new User({
      name,
      email,
      password,
      role: "employer"
    });

    await newEmployer.save();

    res.status(201).json({
      message: "Employer registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


