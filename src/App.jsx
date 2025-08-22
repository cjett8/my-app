import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [formData, setFormData] = useState({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: [],
    q6: [],
    q7: [],
    q8: [],
    q9: "",
    q10: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 10;

  // Load saved data and step on mount
  useEffect(() => {
    const savedData = localStorage.getItem("surveyData");
    const savedStep = localStorage.getItem("surveyStep");
    if (savedData) setFormData(JSON.parse(savedData));
    if (savedStep) setCurrentStep(Number(savedStep));
  }, []);

  const handleClear = () => {
    localStorage.removeItem("surveyData");
    localStorage.removeItem("surveyStep");
    setFormData({
      q1: [],
      q2: [],
      q3: [],
      q4: [],
      q5: [],
      q6: [],
      q7: [],
      q8: [],
      q9: "",
      q10: "",
    });
    setCurrentStep(0);
  };

  const handleMultiChange = (question, values) => {
    const newData = { ...formData, [question]: values };
    setFormData(newData);
    localStorage.setItem("surveyData", JSON.stringify(newData));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    localStorage.setItem("surveyData", JSON.stringify(newData));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem("surveyStep", nextStep);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      localStorage.setItem("surveyStep", prevStep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      console.log("Survey Results saved:", data);
      alert("Survey submitted successfully!");

      localStorage.removeItem("surveyData");
      localStorage.removeItem("surveyStep");
    } catch (err) {
      console.error("Error submitting survey:", err);
      alert("Failed to submit survey. Check console for details.");
    }
  };

  const checkboxOptions = ["Option A", "Option B", "Option C"];
  const selectOptions = ["Choice 1", "Choice 2", "Choice 3"];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4 text-center">Survey Form</h1>

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <small>
            Question {currentStep + 1} of {totalSteps}
          </small>
          <small>{Math.round(progress)}%</small>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          {currentStep < 5 && (
            <div className="text-start">
              <p>
                Question {currentStep + 1}: Select options
              </p>
              {checkboxOptions.map((opt) => (
                <div className="form-check" key={opt}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={opt}
                    checked={formData[`q${currentStep + 1}`].includes(opt)}
                    onChange={() => {
                      const values = formData[`q${currentStep + 1}`].includes(opt)
                        ? formData[`q${currentStep + 1}`].filter((o) => o !== opt)
                        : [...formData[`q${currentStep + 1}`], opt];
                      handleMultiChange(`q${currentStep + 1}`, values);
                    }}
                  />
                  <label className="form-check-label">{opt}</label>
                </div>
              ))}
            </div>
          )}

          {currentStep >= 5 && currentStep <= 7 && (
            <div>
              <p className="text-start">
                Question {currentStep + 1}: Choose multiple from dropdown
              </p>
              <select
                multiple
                className="form-select"
                value={formData[`q${currentStep + 1}`]}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (o) => o.value
                  );
                  handleMultiChange(`q${currentStep + 1}`, values);
                }}
                style={{ height: "100px" }}
              >
                {selectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentStep === 8 && (
            <div>
              <p className="text-start">Question 9: Your favorite hobby?</p>
              <input
                type="text"
                name="q9"
                value={formData.q9}
                onChange={handleTextChange}
                className="form-control"
              />
            </div>
          )}

          {currentStep === 9 && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="text-start">Question 10: Additional comments</p>
                <textarea
                  name="q10"
                  value={formData.q10}
                  onChange={handleTextChange}
                  className="form-control"
                  rows="4"
                />
              </div>

              <div className="d-flex justify-content-between w-100 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handlePrev}
                >
                  Previous
                </button>

                <button type="submit" className="btn btn-success">
                  Submit Survey
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep < 9 && (
        <div className="d-flex justify-content-between w-100 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={currentStep === 0}
            onClick={handlePrev}
          >
            Previous
          </button>

          <button type="button" className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      <button
        type="button"
        className="btn btn-link text-danger mt-3"
        onClick={handleClear}
      >
        Clear My Answers
      </button>
    </div>
  );
}
