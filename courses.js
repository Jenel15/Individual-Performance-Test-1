const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://jenelricafrente:0048728c@cluster0.6kvjvok.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courseSchema = new mongoose.Schema({
  code: String,
  description: String,
  units: Number,
  tags: [String],
});

const Course = mongoose.model('Course', courseSchema);

// Add a route for the root path
app.get('/', (req, res) => {
  res.send('Hello, this is the root path!');
});

app.get('/backend-courses', async (req, res) => {
  try {
    // Retrieve all courses and sort them alphabetically by their names.
    const allCourses = await Course.find().sort('description');

    // Select and extract the name and specialization of each course.
    const selectedCourses = allCourses.map(({ description, tags }) => ({
      name: description,
      specialization: tags.find(tag => tag !== 'Backend'),
    }));

    res.json(selectedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/bsis-bsit-courses', async (req, res) => {
  try {
    // Retrieve all published BSIS and BSIT courses from the curriculum.
    const bsisCourses = await Course.find({ tags: 'BSIS' });
    const bsitCourses = await Course.find({ tags: 'BSIT' });

    res.json({ bsisCourses, bsitCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
