import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/doctors/")
      .then((response) => {

        setDoctors(response.data);
        setLoading(false);

      })
      .catch((error) => {

        console.log(error);
        setLoading(false);

      });

  }, []);

  return (

    <div>

      <nav className="navbar">
        <h2>Clinic Management System</h2>
      </nav>

      <div className="container">

        <h1 className="title">
          Our Doctors
        </h1>

        {

          loading ?

            (

              <h2 className="loading">
                Loading doctors...
              </h2>

            )

            :

            (

              <div className="doctor-container">

                {

                  doctors.map((doctor) => (

                    <div className="card" key={doctor.id}>

                      <img
                        src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                        alt="doctor"
                      />

                      <h2>
                        {doctor.doctor_name}
                      </h2>

                      <p>
                        <strong>Specialization:</strong>
                        {" "}
                        {doctor.specialization}
                      </p>

                      <p>
                        <strong>Fee:</strong>
                        {" "}
                        ₹{doctor.fee}
                      </p>

                      <p className="available">
                        Available
                      </p>

                      <button
                        onClick={() =>
                          alert(
                            `Appointment booked with ${doctor.doctor_name}`
                          )
                        }
                      >
                        Book Appointment
                      </button>

                    </div>

                  ))
                }

              </div>

            )
        }

      </div>

      <footer className="footer">

        <p>
          © 2026 Clinic Management System
        </p>

      </footer>

    </div>
  );
}

export default App;