import React from "react";

/**
 * Component for the footer
 * @component shows the footer
 */
const Footer = () => {
  return (
    <footer>
      <h3>Our Mission</h3>
      <p>
        Finding correlations between symptoms and foods, allowing you to narrow
        down food-based triggers. <br />
        <strong>
          Please remember that correlation DOES NOT equal causation and SEED
          does not provide medical advice!
        </strong>
      </p>
      <h3>Medical Advice Disclaimer</h3>
      <p>
        This web site is provided for informational purposes only and does not
        constitute providing medical advice or professional services. The
        information provided should not be used for diagnosing or treating a
        health problem or disease, and those seeking personal medical advice
        should consult with a licensed physician. <br />
        <strong>
          If you think you may have a medical emergency, call 911 or go to the
          nearest emergency room immediately.
        </strong>
      </p>
    </footer>
  );
};

export default Footer;
