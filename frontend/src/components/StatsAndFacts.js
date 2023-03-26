import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Placeholder component for stats and facts
 * @component shows facts and stats while graphs are not available
 */
const StatsAndFacts = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const getQuote = async () => {
      try {
        const { data } = await axios.get(
          "https://api.api-ninjas.com/v1/quotes?category=life",
          { headers: { "X-Api-Key": process.env.REACT_APP_QUOTE_API } }
        );

        setQuote(`"${data[0].quote}"`);
        setAuthor(`-${data[0].author}`);
      } catch (err) {
        console.error(err);
      }
    };
    getQuote();
  }, []);

  return (
    <section>
      <blockquote>
        {quote ||
          `"Never underestimate the power of good food. Eating delicious food can be a life-changing experience"`}
        <p>{author || `-Shon Mehta`}</p>
      </blockquote>
    </section>
  );
};

export default StatsAndFacts;
