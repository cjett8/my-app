import React, { useState, useEffect } from "react";

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
  

  // Load saved data on first mount
  useEffect(() => {
    const savedData = localStorage.getItem("surveyData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Add this function inside your App component
const handleClear = () => {
  localStorage.removeItem("surveyData");
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
};

  
 // Handle checkboxes and multiselects
const handleMultiChange = (question, values) => {
  const newData = { ...formData, [question]: values };
  setFormData(newData);
  localStorage.setItem("surveyData", JSON.stringify(newData));
};

// Handle text inputs
const handleTextChange = (e) => {
  const { name, value } = e.target;
  const newData = { ...formData, [name]: value };
  setFormData(newData);
  localStorage.setItem("surveyData", JSON.stringify(newData));
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
  } catch (err) {
    console.error("Error submitting survey:", err);
    alert("Failed to submit survey. Check console for details.");
  }
};



  const checkboxOptions = ["Option A", "Option B", "Option C"];
  const selectOptions = ["Choice 1", "Choice 2", "Choice 3"];

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4 text-center">Survey Form</h1>
      <form onSubmit={handleSubmit} className="text-start">
        {/* Checkbox Questions 1-5 */}
        {[1, 2, 3, 4, 5].map((num) => (
          <div className="mb-4" key={`q${num}`}>
            <p>Question {num}: Select options</p>
            {checkboxOptions.map((opt) => (
              <div className="form-check" key={`q${num}-${opt}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={opt}
                  checked={formData[`q${num}`].includes(opt)}
                  onChange={() => {
                    const values = formData[`q${num}`].includes(opt)
                      ? formData[`q${num}`].filter((o) => o !== opt)
                      : [...formData[`q${num}`], opt];
                    handleMultiChange(`q${num}`, values);
                  }}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
          </div>
        ))}

        {/* Multiselect Questions 6-8 */}
        {[6, 7, 8].map((num) => (
          <div className="mb-4" key={`q${num}`}>
            <p>Question {num}: Choose multiple from dropdown</p>
            <select
              multiple
              className="form-select"
              value={formData[`q${num}`]}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (o) => o.value
                );
                handleMultiChange(`q${num}`, values);
              }}
              style={{ height: "100px" }}
            >
              {selectOptions.map((opt) => (
                <option key={`q${num}-opt`} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Text Input Questions 9-10 */}
        <div className="mb-4">
          <p>Question 9: Your favorite hobby?</p>
          <input
            type="text"
            name="q9"
            value={formData.q9}
            onChange={handleTextChange}
            className="form-control"
          />
        </div>

        <div className="mb-4">
          <p>Question 10: Additional comments</p>
          <textarea
            name="q10"
            value={formData.q10}
            onChange={handleTextChange}
            className="form-control"
            rows="4"
          />
        </div>

<button
  type="button"
  className="btn btn-secondary w-100 mb-3"
  onClick={handleClear}
>
  Clear My Answers
</button>



        <button type="submit" className="btn btn-primary w-100">
          Submit Survey
        </button>
      </form>
    </div>
  );
}
