import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const start = new Date(2026, 1, 21); // Feb 21, 2026
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 15);

    const now = new Date();
    if (now >= end) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    let years = end.getFullYear() - now.getFullYear();
    let months = end.getMonth() - now.getMonth();
    let days = end.getDate() - now.getDate();
    let hours = end.getHours() - now.getHours();
    let minutes = end.getMinutes() - now.getMinutes();
    let seconds = end.getSeconds() - now.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    return { years, months, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer-container">
      <h1 className="title">The Compound</h1>
      <div className="timer-center">
      <div className="timer-line">
        <span className="timer-number">{timeLeft.years}</span>years{" "}
        <span className="timer-number">{timeLeft.months}</span>months{" "}
        <span className="timer-number">{timeLeft.days}</span>days
      </div>
      <div className="timer-line">
        <span className="timer-number">{timeLeft.hours}</span>hours{" "}
        <span className="timer-number">{timeLeft.minutes}</span>minutes{" "}
        <span className="timer-number">{timeLeft.seconds}</span>seconds
      </div>
      </div>
    </div>
  );
}

export default App;
