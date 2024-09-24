import React from "react";

// Define types for the timetable structure
type TimeSlot = {
  time: string;
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

// Example data for all days
const timetableData: DayData[] = [
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
];

// Time slots used as headers
const timeSlots = [
  "7am - 8am",
  "8am - 9am",
  "9am - 10am",
  "10am - 11am",
  "11am - 12pm",
  "1pm - 2pm",
  "2pm - 3pm",
  "3pm - 4pm",
  "4pm - 6:30pm",
];

const Timetable = ({ timetableData }: { timetableData: DayData[] }) => {
  return (
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
              {dayData.venues.map((venue, venueIndex) => (
                <tr key={venueIndex}>
                  <td className="venue">{venue.venue}</td>
                  {timeSlots.map((time, timeIndex) => {
                    const course = venue.slots.find(
                      (slot) => slot.time === time
                    );
                    return (
                      <td key={timeIndex} className="course">
                        {course ? (
                          <div>
                            <strong>{course.course}</strong>
                          </div>
                        ) : (
                          <div className="empty-slot"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Timetable;
