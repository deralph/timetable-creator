import React, { useState } from "react";
import "./App.css";
import Timetable from "./Timetable";

interface Course {
  title: string;
  department: string;
  borrowedBy: string;
  lecturer: string;
  duration: string;
  frequency: string;
  venue: string;
  level: string;
  courseCode: string;
}

const CourseForm: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([
    {
      title: "",
      department: "",
      borrowedBy: "",
      lecturer: "",
      duration: "",
      frequency: "",
      venue: "",
      level: "",
      courseCode: "",
    },
  ]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedCourses = [...courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [name]: value,
    };
    setCourses(updatedCourses);
  };
  // const handleBorrowedByChange = (
  //   index: number,
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const { options } = e.target;
  //   const selectedBorrowedBy = Array.from(options)
  //     .filter((option) => option.selected)
  //     .map((option) => option.value);

  //   const updatedCourses = [...courses];
  //   updatedCourses[index] = {
  //     ...updatedCourses[index],
  //     borrowedBy: selectedBorrowedBy, // Update the selected options
  //   };
  //   setCourses(updatedCourses);
  // };

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        title: "",
        department: "",
        borrowedBy: "",
        lecturer: "",
        duration: "",
        frequency: "",
        venue: "",
        level: "",
        courseCode: "",
      },
    ]);
  };

  const handleRemoveCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(courses);
    // Send the courses data to the backend here.
    const server = "https://timetable-creator.onrender.com";
    // const local = "http://127.0.0.1:5000/generate-timetable";
    try {
      const response = await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courses }),
      });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      const data = await response.json();
      console.log(data);
      const cleanedString = data.timetable
        .replace(/\n/g, "") // Remove newlines
        .replace(/\t/g, "") // Remove tabs
        .replace(/`/g, "") // Remove any backticks
        .replace("json", "")
        .trim();

      console.log(cleanedString);
      // Step 2: Parse the string into JSON
      try {
        const parsedData = JSON.parse(cleanedString);
        setTimetable(parsedData);
        console.log(parsedData); // Set the parsed data into state
      } catch (error) {
        console.error("Invalid JSON string:", error);
      }
    } catch (err) {
      console.error("Error generating timetable", err);
    }
  };

  return (
    <>
      <div className="course-form-container">
        <h1 className="form-heading">Create New Course</h1>

        <form onSubmit={handleSubmit} className="course-form">
          {courses.map((course, index) => (
            <div key={index} className="course-section">
              <h2>Course {index + 1}</h2>
              <div className="" style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="form-group">
                  <label htmlFor={`title-${index}`}>Title</label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    name="title"
                    placeholder="e.g. Introduction to Programming"
                    value={course.title}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`department-${index}`}>Department</label>
                  <input
                    type="text"
                    id={`department-${index}`}
                    name="department"
                    placeholder="e.g. Computer Science"
                    value={course.department}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`borrowedBy-${index}`}>Borrowed By</label>
                  <select
                    id={`borrowedBy-${index}`}
                    name="borrowedBy"
                    // multiple
                    value={course.borrowedBy}
                    onChange={(e) => handleChange(index, e)}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics and elsectronics">
                      Physics and elsectronics
                    </option>
                    <option value="Mathematics">Mathematics </option>
                    <option value="Micrbiology">Micrbiology </option>
                    <option value="Biochemistry">Biochemistry </option>
                    <option value="Animal and Environmental science">
                      Animal and Environmental science{" "}
                    </option>
                    <option value="PLant and BIotechnology">
                      PLant and BIotechnology{" "}
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`level-${index}`}>Level</label>
                  <select
                    id={`level-${index}`}
                    name="level"
                    value={course.level}
                    onChange={(e) => handleChange(index, e)}
                  >
                    <option value="100 level">100 level </option>
                    <option value="200 level">200 level </option>
                    <option value="300 level">300 level </option>
                    <option value="400 level">400 level </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`lecturer-${index}`}>Lecturer</label>
                  <input
                    type="text"
                    id={`lecturer-${index}`}
                    name="lecturer"
                    placeholder="e.g. Dr. John Doe"
                    value={course.lecturer}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`duration-${index}`}>Duration (hours)</label>
                  <input
                    type="number"
                    id={`duration-${index}`}
                    name="duration"
                    placeholder="e.g. 3"
                    value={course.duration}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`courseCode-${index}`}>Course Code</label>
                  <input
                    type="text"
                    id={`courseCode-${index}`}
                    name="courseCode"
                    placeholder="e.g. csc 101"
                    value={course.courseCode}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`frequency-${index}`}>
                    Frequency (times per week)
                  </label>
                  <input
                    type="number"
                    id={`frequency-${index}`}
                    name="frequency"
                    placeholder="e.g. 2"
                    value={course.frequency}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`venue-${index}`}>Venue</label>
                  <input
                    type="text"
                    id={`venue-${index}`}
                    name="venue"
                    placeholder="e.g. Lecture Hall 3"
                    value={course.venue}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>
              </div>
              {courses.length > 1 && (
                <button
                  type="button"
                  className="remove-course-button"
                  onClick={() => handleRemoveCourse(index)}
                >
                  Remove Course
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-course-button"
            onClick={handleAddCourse}
          >
            Add Another Course
          </button>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Save & Continue
            </button>
          </div>
        </form>
      </div>
      {timetable.length > 1 ? <Timetable timetableData={timetable} /> : null}
    </>
  );
};

export default CourseForm;
