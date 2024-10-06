import { db } from "./firebase.ts"; // Make sure to configure Firebase
import { addDoc, collection } from "firebase/firestore";

// Define types for the timetable structure
type TimeSlot = {
  time: string; // Original time range, e.g. "7am - 8am"
  course: string;
};

type Venue = {
  venue: string;
  slots: TimeSlot[];
};

type DayData = {
  day: string;
  venues: Venue[];
};

// Time slots for each hour (1-hour intervals)
const timeSlots = [
  "7am - 8am",
  "8am - 9am",
  "9am - 10am",
  "10am - 11am",
  "11am - 12pm",
  "12pm - 1pm",
  "1pm - 2pm",
  "2pm - 3pm",
  "3pm - 4pm",
  "4pm - 5pm",
  "5pm - 6pm",
];

// Helper function to convert time in "7am" format to minutes from midnight (24-hour time format)
const convertTo24Hour = (time: string) => {
  const [hour, period] = time.split(/(am|pm)/);
  let [hours, minutes] = hour.trim().split(":").map(Number);
  if (period === "pm" && hours < 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0; // handle midnight
  return hours * 60 + (minutes || 0); // return time in minutes
};

// Function to calculate how many time slots to span based on course start and end times
const calculateColSpan = (startTime: string, endTime: string) => {
  const startMinutes = convertTo24Hour(startTime);
  const endMinutes = convertTo24Hour(endTime);
  const colSpan = Math.ceil((endMinutes - startMinutes) / 60); // Calculate hours spanned
  return colSpan;
};

// Function to extract start and end time from a time range string (e.g., "7am - 8am")
const extractTimes = (timeRange: string) => {
  const [startTime, endTime] = timeRange.split(" - ");
  return { startTime, endTime };
};

const saveTimetableToFirebase = async (timetableData: any[]) => {
  try {
    const docRef = await addDoc(collection(db, "timetables"), {
      timetable: timetableData,
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const Timetable = ({ timetableData }: { timetableData: DayData[] }) => {
  // Function to print the timetable
  const printTimetable = () => {
    saveTimetableToFirebase(timetableData);
    window.print();
  };
  return (
    <>
      <div className="timetable-container">
        {timetableData.map((dayData, dayIndex) => (
          <div key={dayIndex}>
            <h2>{dayData.day}</h2>
            <table className="timetable">
              <thead>
                <tr>
                  <th>Venue</th>
                  {timeSlots.map((time, index) => (
                    <th key={index}>{time}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dayData.venues.map((venue, venueIndex) => {
                  let usedSlots = 0; // Keep track of how many time slots are already used

                  return (
                    <tr key={venueIndex}>
                      <td className="venue">{venue.venue}</td>
                      {timeSlots.map((time, timeIndex) => {
                        if (usedSlots > 0) {
                          usedSlots--;
                          return null; // Skip this slot if it was part of a previous `colSpan`
                        }

                        const slot = venue.slots.find(
                          (slot) =>
                            extractTimes(slot.time).startTime ===
                            time.split(" - ")[0]
                        );

                        if (slot) {
                          const { startTime, endTime } = extractTimes(
                            slot.time
                          );
                          const colSpan = calculateColSpan(startTime, endTime);
                          usedSlots = colSpan - 1; // Set how many slots to skip next

                          return (
                            <td
                              key={timeIndex}
                              className="course"
                              colSpan={colSpan} // Span across time slots based on duration
                            >
                              <div>
                                <strong>{slot.course}</strong>
                              </div>
                            </td>
                          );
                        } else {
                          // If no course starts at this time, return an empty slot
                          return (
                            <td key={timeIndex} className="empty-slot"></td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <button
        id="print-timetable"
        onClick={printTimetable}
        className="submit-button"
        style={{ margin: "20px" }}
      >
        Download/Print Timetable
      </button>
    </>
  );
};

export default Timetable;
