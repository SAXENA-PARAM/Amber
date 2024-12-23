'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from 'react-bootstrap/lib/Navbar'

export default function AcademicQualificationsForm() {
  const router = useRouter()
  const [level, setLevel] = useState('')
  const [schoolYear, setSchoolYear] = useState('')
  const [schoolStream, setSchoolStream] = useState('')
  const [ugDegree, setUgDegree] = useState('')
  const [ugYear, setUgYear] = useState('')
  const [pgDegree, setPgDegree] = useState('')
  const [pgSpecialization, setPgSpecialization] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = {
      level,
      ...(level === 'school' && { schoolYear, schoolStream }),
      ...(level === 'UG' && { ugDegree, ugYear }),
      ...(level === 'PG' && { pgDegree, pgSpecialization }),
    }

    try {
      const response = await fetch('http://localhost:3000/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/landing')
      } else {
        console.error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="form-container text-black relative top-[20vh] bg-slate-700">
      <h1 className='text-white'>Academic Qualifications</h1>
      <p>Please provide your academic details</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="level">Education Level</label>
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} required>
            <option value="">Select Level</option>
            <option value="school">School</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
          </select>
        </div>

        {level === 'school' && (
          <>
            <div className="form-group">
              <label htmlFor="schoolYear">School Year</label>
              <select id="schoolYear" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} required>
                <option value="">Select Year</option>
                <option value="ELEVENTH">Eleventh</option>
                <option value="TWELFTH">Twelfth</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="schoolStream">Stream</label>
              <select id="schoolStream" value={schoolStream} onChange={(e) => setSchoolStream(e.target.value)} required>
                <option value="">Select Stream</option>
                <option value="SCIENCE">Science</option>
                <option value="COMMERCE">Commerce</option>
                <option value="ARTS">Arts</option>
              </select>
            </div>
          </>
        )}

        {level === 'UG' && (
          <>
            <div className="form-group">
              <label htmlFor="ugDegree">UG Degree</label>
              <select id="ugDegree" value={ugDegree} onChange={(e) => setUgDegree(e.target.value)} required>
                <option value="">Select Degree</option>
                <option value="btech">B.Tech</option>
                <option value="bsc">B.Sc</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ugYear">Study Year</label>
              <select id="ugYear" value={ugYear} onChange={(e) => setUgYear(e.target.value)} required>
                <option value="">Select Year</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
                <option value="fourth">Fourth</option>
              </select>
            </div>
          </>
        )}

        {level === 'PG' && (
          <>
            <div className="form-group">
              <label htmlFor="pgDegree">PG Degree</label>
              <select id="pgDegree" value={pgDegree} onChange={(e) => setPgDegree(e.target.value)} required>
                <option value="">Select Degree</option>
                <option value="mtech">M.Tech</option>
                <option value="msc">M.Sc</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pgSpecialization">Specialization</label>
              <select id="pgSpecialization" value={pgSpecialization} onChange={(e) => setPgSpecialization(e.target.value)} required>
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

        <button type="submit"className='bg-[#007bff] hover:bg-[#0056b3]'>Submit</button>
      </form>

      <style jsx>{`
        .form-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        p {
          margin-bottom: 20px;
          color: #666;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          width: 100%;
          padding: 10px;
        //   background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
        //   background-color: #0056b3;
        }
      `}</style>
      <a href="/landing"><button className='bg-red-700 mt-5 hover:bg-red-800'>Skip for now</button></a>
    </div>
  )
}