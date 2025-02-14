import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="text-white">
     <b> {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </b>
    </div>
  );
};

export default Clock;
