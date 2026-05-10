const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Name, email, and password are required');
  }

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).send('Student already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashedPassword });
    await student.save();

    res.status(201).send('Student registered successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).send('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ email: student.email, name: student.name }, 'your-secret-key', { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;