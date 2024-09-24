from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import google.generativeai as genai
import os

genai.configure(api_key='AIzaSyA6ZYFB82lozVOM726pbnh6LTlAMVR-yvc')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://timetable-creator.vercel.app", "http://localhost:5173", "http://127.0.0.1:5173"]}})

# Route to handle course submission and schedule generation
@app.route('/generate-timetable', methods=['POST'])
@cross_origin(origins=["https://timetable-creator.vercel.app", "http://localhost:5173", "http://127.0.0.1:5173"])

def generate_timetable():
    try:
        # Get the courses data from the frontend
        courses = request.json['courses']
        print(type(courses))
        # Construct a prompt for the LLM (Gemini) to generate the timetable
        prompt = create_llm_prompt(courses)
        print('prompts = ',prompt)
        # Call the Gemini API to generate the timetable based on the prompt

        model = genai.GenerativeModel("gemini-1.5-flash")
        print("model declared")
        response = model.generate_content(prompt)
        print(response.text)

        # Return the generated timetable to the frontend
        return jsonify({
            "success": True,
            "timetable": response.text
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        })

# Helper function to create LLM prompt based on course data
def create_llm_prompt(courses):
    # Ensure that 'courses' is provided in the correct format
    if not isinstance(courses, list):
        raise ValueError("Courses data should be a list of dictionaries representing course details.")
    
    # Initialize the prompt
    prompt = (
        "You are tasked with generating a detailed 5-day university timetable, spanning from 7am to 6pm, "
        "based on the following courses. The timetable should avoid any venue or lecturer clashes and should be "
        "well-distributed over Monday to Friday.\n\n"
        "Instructions:\n"
        "1. No two courses should overlap in time for the same venue or lecturer.\n"
        "2. The frequency of each course should be respected (daily, weekly, etc.).\n"
        "3. Evenly distribute courses across the 5 days, ensuring that venues and time slots are used efficiently.\n"
        "4. The timetable should clearly show time slots, courses, and venues.\n"
        "5. Group the timetable by day, then by venue. Each venue will have a list of time slots, and each time slot "
        "will have its assigned course. Format the timetable as a dictionary for each day, like so:\n"
        "   { 'day': 'Monday', 'venues': [ { 'venue': 'Venue Name', 'slots': [ { 'time': 'Time Slot', 'course': 'Course Code' } ] } ] }\n"
        "6. If a course needs to occur on multiple days, distribute it across different venues and times accordingly.\n"
        "7. Return the timetable as a JSON object.\n"
        "\nHere are the course details:\n"
    )
    
    # Loop through the courses to append their details to the prompt
    for course in courses:
        required_fields = ['title', 'department', 'lecturer', 'duration', 'frequency', 'borrowedBy', 'level', 'venue', 'courseCode']
        # Validate that all required fields are present
        for field in required_fields:
            if field not in course:
                raise ValueError(f"Missing required field: {field} in course: {course}")

        # Append course details to the prompt
        prompt += (
            f"- {course['title']} (Course Code: {course['courseCode']}, Dept: {course['department']}, "
            f"Lecturer: {course['lecturer']}, Duration: {course['duration']} hours, Frequency: {course['frequency']}, "
            f"Level: {course['level']}, Venue: {course['venue']}, Borrowed by: {', '.join(course['borrowedBy'])})\n"
        )
    
    # End the prompt with the requested format example
    prompt += (
        "\nPlease generate the timetable following the structure described. Here's an example of the expected output:\n"
                ''' [
        {
            day: "Monday",
            venues: [
            {
                venue: "ETF 750",
                slots: [
                { time: "7am - 8am", course: "GST 111" },
                { time: "8am - 9am", course: "PHY 101" },
                ],
            },
            {
                venue: "CR 07",
                slots: [
                { time: "7am - 8am", course: "BCH 305" },
                { time: "8am - 9am", course: "PHY 211" },
                ],
            },
            ],
        },
        {
            day: "Tuesday",
            venues: [
            {
                venue: "ETF 750",
                slots: [
                { time: "7am - 8am", course: "PHY 203" },
                { time: "8am - 9am", course: "CSC 101" },
                ],
            },
            {
                venue: "CR 07",
                slots: [
                { time: "7am - 8am", course: "BIO 101" },
                { time: "8am - 9am", course: "MTH 203" },
                ],
            },
            ],
        },
        // Add more days and venues here
        ]; '''
    )
    
    return prompt





if __name__ == '__main__':
    app.run(debug=True)
