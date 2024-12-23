import React, { useState } from 'react';

const DashboardEdit = () => {
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [educationLevel, setEducationLevel] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [schoolStream, setSchoolStream] = useState('');
  const [ugDegree, setUgDegree] = useState('');
  const [ugYear, setUgYear] = useState('');
  const [pgDegree, setPgDegree] = useState('');
  const [pgSpecialization, setPgSpecialization] = useState('');
  
  const saveProfile = async () => {
    console.log("Saving profile data:", profile);
    try {
      const response = await fetch("http://localhost:3000/updated-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        console.log("Profile updated successfully on the server.");
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile on the server. Response status:", response.status);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <div className="bg-gray-100 h-[30vh] py-8 w-[50vw]">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-blue-600">Profile Dashboard</h1>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Education Details</h2>
          {!isEditingEducation ? (
            <div className="mt-4">
              <p className="font-semibold">Education Level: {educationLevel}</p>
              {educationLevel === 'school' && (
                <>
                  <p className="text-sm text-gray-600">School Year: {schoolYear}</p>
                  <p className="text-sm text-gray-600">Stream: {schoolStream}</p>
                </>
              )}
              {educationLevel === 'UG' && (
                <>
                  <p className="text-sm text-gray-600">UG Degree: {ugDegree}, Year: {ugYear}</p>
                </>
              )}
              {educationLevel === 'PG' && (
                <>
                  <p className="text-sm text-gray-600">PG Degree: {pgDegree}, Specialization: {pgSpecialization}</p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <label htmlFor="level" className="font-medium">Education Level</label>
                <select
                  id="level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full p-2 border rounded mt-2"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="school">School</option>
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                </select>
              </div>

              {educationLevel === 'school' && (
                <>
                  <div className="form-group mt-4">
                    <label htmlFor="schoolYear" className="font-medium">School Year</label>
                    <select
                      id="schoolYear"
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="ELEVENTH">Eleventh</option>
                      <option value="TWELFTH">Twelfth</option>
                    </select>
                  </div>
                  <div className="form-group mt-4">
                    <label htmlFor="schoolStream" className="font-medium">Stream</label>
                    <select
                      id="schoolStream"
                      value={schoolStream}
                      onChange={(e) => setSchoolStream(e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      required
                    >
                      <option value="">Select Stream</option>
                      <option value="SCIENCE">Science</option>
                      <option value="COMMERCE">Commerce</option>
                      <option value="ARTS">Arts</option>
                    </select>
                  </div>
                </>
              )}

              {educationLevel === 'UG' && (
                <>
                  <div className="form-group mt-4">
                    <label htmlFor="ugDegree" className="font-medium">UG Degree</label>
                    <select
                      id="ugDegree"
                      value={ugDegree}
                      onChange={(e) => setUgDegree(e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      required
                    >
                      <option value="">Select Degree</option>
                      <option value="btech">B.Tech</option>
                      <option value="bsc">B.Sc</option>
                    </select>
                  </div>
                  <div className="form-group mt-4">
                    <label htmlFor="ugYear" className="font-medium">Study Year</label>
                    <select
                      id="ugYear"
                      value={ugYear}
                      onChange={(e) => setUgYear(e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="first">First</option>
                      <option value="second">Second</option>
                      <option value="third">Third</option>
                      <option value="fourth">Fourth</option>
                    </select>
                  </div>
                </>
              )}

              {educationLevel === 'PG' && (
                <>
                  <div className="form-group mt-4">
                    <label htmlFor="pgDegree" className="font-medium">PG Degree</label>
                    <select
                      id="pgDegree"
                      value={pgDegree}
                      onChange={(e) => setPgDegree(e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      required
                    >
                      <option value="">Select Degree</option>
                      <option value="mtech">M.Tech</option>
                      <option value="msc">M.Sc</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  <div className="form-group mt-4">
                    <label htmlFor="pgSpecialization" className="font-medium">Specialization</label>
                    <select
                      id="pgSpecialization"
                      value={pgSpecialization}
                      onChange={(e) => setPgSpecialization(e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      required
                    >
                      <option value="">Select Specialization</option>
                      <option value="COMPUTER_SCIENCE">Computer Science</option>
                      <option value="MECHANICAL_ENGINEERING">Mechanical Engineering</option>
                      <option value="ELECTRICAL_ENGINEERING">Electrical Engineering</option>
                      <option value="CIVIL_ENGINEERING">Civil Engineering</option>
                      <option value="CHEMISTRY">Chemistry</option>
                      <option value="PHYSICS">Physics</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
                Save Education Details
              </button>
            </form>
          )}

          <button
            onClick={() => setIsEditingEducation(!isEditingEducation)}
            className="w-full mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditingEducation ? "Cancel" : "Edit Education"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEdit;
