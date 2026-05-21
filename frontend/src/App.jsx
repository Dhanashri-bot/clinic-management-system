import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Home, 
  Users, 
  UserCheck, 
  Calendar, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Activity
} from "lucide-react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
  // Navigation & Data State
  const [currentTab, setCurrentTab] = useState("home");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");

  // Modal & Edit State
  const [activeModal, setActiveModal] = useState(null); // 'patient', 'doctor', 'appointment'
  const [editingRecord, setEditingRecord] = useState(null);

  // Form Field States
  // 1. Patient Form
  const [patientForm, setPatientForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    age: "",
    gender: "Male",
    address: ""
  });

  // 2. Doctor Form
  const [doctorForm, setDoctorForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    specialization: "",
    fee: "",
    is_available: true
  });

  // 3. Appointment Form
  const [appointmentForm, setAppointmentForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "Booked"
  });

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Fetch all data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/patients/`),
        axios.get(`${API_BASE_URL}/doctors/`),
        axios.get(`${API_BASE_URL}/appointments/`)
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("error", "API Error", "Could not load data from clinic server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to trigger Toast Notification
  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Open Add/Edit modals
  const openModal = (type, record = null) => {
    setEditingRecord(record);
    setActiveModal(type);

    if (type === "patient") {
      if (record) {
        setPatientForm({
          username: record.username,
          first_name: record.first_name || "",
          last_name: record.last_name || "",
          email: record.email,
          phone_number: record.phone_number || "",
          age: record.age || "",
          gender: record.gender || "Male",
          address: record.address || ""
        });
      } else {
        setPatientForm({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          age: "",
          gender: "Male",
          address: ""
        });
      }
    } else if (type === "doctor") {
      if (record) {
        setDoctorForm({
          username: record.username,
          first_name: record.first_name || "",
          last_name: record.last_name || "",
          email: record.email,
          phone_number: record.phone_number || "",
          specialization: record.specialization,
          fee: record.fee,
          is_available: record.is_available
        });
      } else {
        setDoctorForm({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          specialization: "",
          fee: "",
          is_available: true
        });
      }
    } else if (type === "appointment") {
      if (record) {
        setAppointmentForm({
          patient_id: record.patient ? record.patient.id : "",
          doctor_id: record.doctor ? record.doctor.id : "",
          appointment_date: record.appointment_date,
          appointment_time: record.appointment_time,
          status: record.status
        });
      } else {
        setAppointmentForm({
          patient_id: "",
          doctor_id: "",
          appointment_date: "",
          appointment_time: "",
          status: "Booked"
        });
      }
    }
  };

  // Handle Form Submissions
  // 1. Patient Form Submit
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs
    if (!patientForm.username || !patientForm.email) {
      showToast("error", "Validation Error", "Username and Email are required.");
      return;
    }
    try {
      if (editingRecord) {
        // Update patient
        const response = await axios.put(`${API_BASE_URL}/patients/${editingRecord.id}/`, patientForm);
        showToast("success", "Success", `Patient ${patientForm.username} updated.`);
      } else {
        // Add new patient
        const response = await axios.post(`${API_BASE_URL}/patients/`, patientForm);
        showToast("success", "Success", `Patient ${patientForm.username} registered.`);
      }
      setActiveModal(null);
      fetchData();
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data ? Object.values(error.response.data).flat().join(" ") : "";
      showToast("error", "Error Saving Patient", serverMsg || "Network or unique validation error.");
    }
  };

  // 2. Doctor Form Submit
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!doctorForm.username || !doctorForm.email || !doctorForm.specialization || !doctorForm.fee) {
      showToast("error", "Validation Error", "Please fill in all required doctor fields.");
      return;
    }
    try {
      if (editingRecord) {
        await axios.put(`${API_BASE_URL}/doctors/${editingRecord.id}/`, doctorForm);
        showToast("success", "Success", `Doctor ${doctorForm.username} updated.`);
      } else {
        await axios.post(`${API_BASE_URL}/doctors/`, doctorForm);
        showToast("success", "Success", `Doctor ${doctorForm.username} registered.`);
      }
      setActiveModal(null);
      fetchData();
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data ? Object.values(error.response.data).flat().join(" ") : "";
      showToast("error", "Error Saving Doctor", serverMsg || "Network or unique validation error.");
    }
  };

  // 3. Appointment Form Submit
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentForm.patient_id || !appointmentForm.doctor_id || !appointmentForm.appointment_date || !appointmentForm.appointment_time) {
      showToast("error", "Validation Error", "All appointment fields are required.");
      return;
    }
    try {
      if (editingRecord) {
        await axios.put(`${API_BASE_URL}/appointments/${editingRecord.id}/`, appointmentForm);
        showToast("success", "Success", "Appointment rescheduled successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/appointments/`, appointmentForm);
        showToast("success", "Success", "Appointment booked successfully!");
      }
      setActiveModal(null);
      fetchData();
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data ? Object.values(error.response.data).flat().join(" ") : "";
      showToast("error", "Error Saving Appointment", serverMsg || "Validation error (check doctor availability).");
    }
  };

  // Delete records
  const handleDelete = async (type, id, label) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} (${label})?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/${type}s/${id}/`);
      showToast("success", "Deleted", `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      fetchData();
    } catch (error) {
      console.error(error);
      showToast("error", "Deletion Failed", `Could not delete this ${type}.`);
    }
  };

  // Filtering list items based on searches
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const query = patientSearch.toLowerCase();
    return (
      p.username.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      (p.phone_number && p.phone_number.includes(query))
    );
  });

  const filteredDoctors = doctors.filter((d) => {
    const fullName = `${d.first_name} ${d.last_name}`.toLowerCase();
    const query = doctorSearch.toLowerCase();
    return (
      d.username.toLowerCase().includes(query) ||
      d.email.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      d.specialization.toLowerCase().includes(query)
    );
  });

  const filteredAppointments = appointments.filter((a) => {
    const patientName = a.patient ? `${a.patient.first_name} ${a.patient.last_name}`.toLowerCase() : "";
    const doctorName = a.doctor ? `${a.doctor.first_name} ${a.doctor.last_name}`.toLowerCase() : "";
    const query = appointmentSearch.toLowerCase();
    return (
      patientName.includes(query) ||
      doctorName.includes(query) ||
      a.status.toLowerCase().includes(query) ||
      a.appointment_date.includes(query)
    );
  });

  return (
    <div className="dashboard-layout">
      {/* Toast Banner Containers */}
      <div className="notification-container">
        {toasts.map((t) => (
          <div className={`toast ${t.type}`} key={t.id}>
            <div className="toast-icon">
              {t.type === "success" && <CheckCircle size={20} className="toast-success-icon" />}
              {t.type === "error" && <AlertCircle size={20} className="toast-error-icon" />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-message">{t.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Elegant Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo">H</div>
          <span className="brand-name">HealingTouch</span>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${currentTab === "home" ? "active" : ""}`}
            onClick={() => setCurrentTab("home")}
          >
            <Home size={20} />
            <span className="nav-text">Dashboard</span>
          </button>

          <button 
            className={`nav-item ${currentTab === "patients" ? "active" : ""}`}
            onClick={() => setCurrentTab("patients")}
          >
            <Users size={20} />
            <span className="nav-text">Patients</span>
          </button>

          <button 
            className={`nav-item ${currentTab === "doctors" ? "active" : ""}`}
            onClick={() => setCurrentTab("doctors")}
          >
            <UserCheck size={20} />
            <span className="nav-text">Doctors</span>
          </button>

          <button 
            className={`nav-item ${currentTab === "appointments" ? "active" : ""}`}
            onClick={() => setCurrentTab("appointments")}
          >
            <Calendar size={20} />
            <span className="nav-text">Appointments</span>
          </button>

          <button 
            className={`nav-item ${currentTab === "admin" ? "active" : ""}`}
            onClick={() => setCurrentTab("admin")}
          >
            <Shield size={20} />
            <span className="nav-text">Admin Panel</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile-shortcut">
            <div className="avatar-initials">AD</div>
            <div className="admin-meta">
              <span className="admin-name">Clinic Admin</span>
              <span className="admin-role">Superuser</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="main-content">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Syncing Clinic Database...</p>
          </div>
        )}

        {/* Content displays only when NOT loading */}
        {!loading && (
          <>
            {/* TAB 1: HOME (DASHBOARD OVERVIEW) */}
            {currentTab === "home" && (
              <div>
                <div className="page-header">
                  <div className="header-title-section">
                    <h1>Clinic Dashboard</h1>
                    <p className="header-subtitle">Welcome back, Admin. Here is today's overview.</p>
                  </div>
                  <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => openModal("appointment")}>
                      <Plus size={16} /> Quick Book
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="stats-grid">
                  <div className="stat-card patients" onClick={() => setCurrentTab("patients")}>
                    <div className="stat-icon-container">
                      <Users size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">{patients.length}</span>
                      <span className="stat-label">Total Patients</span>
                    </div>
                  </div>

                  <div className="stat-card doctors" onClick={() => setCurrentTab("doctors")}>
                    <div className="stat-icon-container">
                      <UserCheck size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">{doctors.length}</span>
                      <span className="stat-label">Active Doctors</span>
                    </div>
                  </div>

                  <div className="stat-card appointments" onClick={() => setCurrentTab("appointments")}>
                    <div className="stat-icon-container">
                      <Calendar size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">
                        {appointments.filter(a => a.status === "Booked").length}
                      </span>
                      <span className="stat-label">Pending Appointments</span>
                    </div>
                  </div>
                </div>

                {/* Split grid for activity overview */}
                <div className="content-grid">
                  <div className="dashboard-card">
                    <div className="card-title-bar">
                      <h2>Upcoming Appointments</h2>
                      <button className="btn btn-secondary" onClick={() => setCurrentTab("appointments")}>View All</button>
                    </div>

                    {appointments.length === 0 ? (
                      <div className="empty-state">
                        <Calendar size={40} className="empty-icon" />
                        <h3>No Scheduled Appointments</h3>
                        <p>Book dynamic appointments for your patients now.</p>
                      </div>
                    ) : (
                      <div className="table-wrapper">
                        <table className="premium-table">
                          <thead>
                            <tr>
                              <th>Patient</th>
                              <th>Doctor</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.slice(0, 5).map((a) => (
                              <tr key={a.id}>
                                <td style={{ fontWeight: 600 }}>
                                  {a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : "Unknown"}
                                </td>
                                <td>
                                  {a.doctor ? `Dr. ${a.doctor.first_name} ${a.doctor.last_name}` : "Unknown"}
                                </td>
                                <td>{a.appointment_date}</td>
                                <td>{a.appointment_time}</td>
                                <td>
                                  <span className={`badge ${
                                    a.status === "Completed" ? "badge-success" : 
                                    a.status === "Cancelled" ? "badge-danger" : "badge-warning"
                                  }`}>
                                    {a.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="dashboard-card">
                    <div className="card-title-bar">
                      <h2>On-Duty Doctors</h2>
                      <button className="btn btn-secondary" onClick={() => setCurrentTab("doctors")}>Doctors</button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {doctors.slice(0, 3).map((d) => (
                        <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "var(--bg-primary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Dr. {d.first_name} {d.last_name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{d.specialization}</div>
                          </div>
                          <span className={`badge ${d.is_available ? "badge-success" : "badge-danger"}`}>
                            {d.is_available ? "On Call" : "Off Duty"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PATIENTS PAGE */}
            {currentTab === "patients" && (
              <div>
                <div className="page-header">
                  <div className="header-title-section">
                    <h1>Patients Directory</h1>
                    <p className="header-subtitle">Manage, register, and update clinic patients.</p>
                  </div>
                  <div className="header-actions">
                    <div className="search-input-wrapper">
                      <Search size={18} className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search patient records..." 
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <button className="btn btn-primary" onClick={() => openModal("patient")}>
                      <Plus size={16} /> Add Patient
                    </button>
                  </div>
                </div>

                {filteredPatients.length === 0 ? (
                  <div className="empty-state">
                    <Users size={40} className="empty-icon" />
                    <h3>No Patients Registered</h3>
                    <p>Register new patient profiles and enter their information.</p>
                    <button className="btn btn-primary" onClick={() => openModal("patient")}>
                      <Plus size={16} /> Add First Patient
                    </button>
                  </div>
                ) : (
                  <div className="cards-grid">
                    {filteredPatients.map((p) => (
                      <div className="custom-card" key={p.id}>
                        <div className="card-header-meta">
                          <div className="card-avatar patient-avatar">
                            {p.first_name ? p.first_name.charAt(0) : "P"}
                          </div>
                          <div className="card-title-details">
                            <h3>{p.first_name} {p.last_name}</h3>
                            <span className="card-subtitle-text">Username: @{p.username}</span>
                          </div>
                        </div>

                        <div className="card-info-list">
                          <div className="card-info-item">
                            <Mail size={14} />
                            <span>{p.email}</span>
                          </div>
                          {p.phone_number && (
                            <div className="card-info-item">
                              <Phone size={14} />
                              <span>{p.phone_number}</span>
                            </div>
                          )}
                          <div className="card-info-item">
                            <User size={14} />
                            <span>{p.age ? `${p.age} years old` : "Age not set"} • {p.gender}</span>
                          </div>
                          {p.address && (
                            <div className="card-info-item">
                              <MapPin size={14} />
                              <span>{p.address}</span>
                            </div>
                          )}
                        </div>

                        <div className="card-footer-actions">
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            onClick={() => openModal("patient", p)}
                            title="Edit details"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only"
                            onClick={() => handleDelete("patient", p.id, `${p.first_name} ${p.last_name}`)}
                            title="Delete Patient"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DOCTORS PAGE */}
            {currentTab === "doctors" && (
              <div>
                <div className="page-header">
                  <div className="header-title-section">
                    <h1>Medical Staff</h1>
                    <p className="header-subtitle">Manage doctor schedules, fees, and specialization fields.</p>
                  </div>
                  <div className="header-actions">
                    <div className="search-input-wrapper">
                      <Search size={18} className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search doctor specialization or name..." 
                        value={doctorSearch}
                        onChange={(e) => setDoctorSearch(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <button className="btn btn-primary" onClick={() => openModal("doctor")}>
                      <Plus size={16} /> Add Doctor
                    </button>
                  </div>
                </div>

                {filteredDoctors.length === 0 ? (
                  <div className="empty-state">
                    <UserCheck size={40} className="empty-icon" />
                    <h3>No Doctors Registered</h3>
                    <p>Add certified doctors to your clinic system and set their specialization.</p>
                    <button className="btn btn-primary" onClick={() => openModal("doctor")}>
                      <Plus size={16} /> Register First Doctor
                    </button>
                  </div>
                ) : (
                  <div className="cards-grid">
                    {filteredDoctors.map((d) => (
                      <div className="custom-card" key={d.id}>
                        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                          <span className={`badge ${d.is_available ? "badge-success" : "badge-danger"}`}>
                            {d.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <div className="card-header-meta">
                          <div className="card-avatar doctor-avatar">
                            {d.first_name ? d.first_name.charAt(0) : "D"}
                          </div>
                          <div className="card-title-details">
                            <h3>Dr. {d.first_name} {d.last_name}</h3>
                            <span className="card-subtitle-text" style={{ textTransform: "uppercase", fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>
                              {d.specialization}
                            </span>
                          </div>
                        </div>

                        <div className="card-info-list">
                          <div className="card-info-item">
                            <Mail size={14} />
                            <span>{d.email}</span>
                          </div>
                          {d.phone_number && (
                            <div className="card-info-item">
                              <Phone size={14} />
                              <span>{d.phone_number}</span>
                            </div>
                          )}
                          <div className="card-info-item" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            <span style={{ marginRight: "0.25rem" }}>Consultation Fee:</span>
                            <span>₹{d.fee}</span>
                          </div>
                        </div>

                        <div className="card-footer-actions">
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            onClick={() => openModal("doctor", d)}
                            title="Edit details"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only"
                            onClick={() => handleDelete("doctor", d.id, `Dr. ${d.first_name} ${d.last_name}`)}
                            title="Delete Doctor"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: APPOINTMENTS PAGE */}
            {currentTab === "appointments" && (
              <div>
                <div className="page-header">
                  <div className="header-title-section">
                    <h1>Scheduled Appointments</h1>
                    <p className="header-subtitle">Book appointments and track clinical schedules.</p>
                  </div>
                  <div className="header-actions">
                    <div className="search-input-wrapper">
                      <Search size={18} className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search patient, doctor, or status..." 
                        value={appointmentSearch}
                        onChange={(e) => setAppointmentSearch(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <button className="btn btn-primary" onClick={() => openModal("appointment")}>
                      <Plus size={16} /> Book Appointment
                    </button>
                  </div>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="empty-state">
                    <Calendar size={40} className="empty-icon" />
                    <h3>No Appointments Found</h3>
                    <p>Try refining your search or book a new appointment for patients.</p>
                    <button className="btn btn-primary" onClick={() => openModal("appointment")}>
                      <Plus size={16} /> Book Appointment
                    </button>
                  </div>
                ) : (
                  <div className="dashboard-card">
                    <div className="table-wrapper">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>Patient Details</th>
                            <th>Assigned Doctor</th>
                            <th>Appointment Date</th>
                            <th>Time Slot</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((a) => (
                            <tr key={a.id}>
                              <td>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: 600 }}>
                                    {a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : "Deleted Patient"}
                                  </span>
                                  {a.patient && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.patient.email}</span>}
                                </div>
                              </td>
                              <td>
                                {a.doctor ? (
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600 }}>Dr. {a.doctor.first_name} {a.doctor.last_name}</span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{a.doctor.specialization}</span>
                                  </div>
                                ) : "Unknown Doctor"}
                              </td>
                              <td style={{ fontWeight: 500 }}>{a.appointment_date}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <Clock size={14} className="text-muted" />
                                  <span>{a.appointment_time}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${
                                  a.status === "Completed" ? "badge-success" : 
                                  a.status === "Cancelled" ? "badge-danger" : "badge-warning"
                                }`}>
                                  {a.status}
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                                  <button 
                                    className="btn btn-secondary btn-icon-only" 
                                    onClick={() => openModal("appointment", a)}
                                    title="Reschedule / Edit"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-icon-only"
                                    onClick={() => handleDelete("appointment", a.id, "Appointment record")}
                                    title="Delete Appointment"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: ADMIN INFO SECTION */}
            {currentTab === "admin" && (
              <div>
                <div className="page-header">
                  <div className="header-title-section">
                    <h1>Administrative Operations</h1>
                    <p className="header-subtitle">System details, technology configurations, and direct Django admin access.</p>
                  </div>
                </div>

                <div className="content-grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
                  <div className="dashboard-card">
                    <div className="card-title-bar">
                      <h2>System Overview</h2>
                    </div>

                    <div className="admin-info-card">
                      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                        The HealingTouch Clinic Management System is powered by a Django REST Framework (DRF) backend server and an optimized SQLite database file. 
                        Superusers can log in to the native Django Admin panel to audit all models directly.
                      </p>

                      <div className="meta-info-item">
                        <span className="meta-label">Django Server Status</span>
                        <span className="badge badge-success">Online & Connected</span>
                      </div>

                      <div className="meta-info-item">
                        <span className="meta-label">Local Database Location</span>
                        <code className="meta-value">backend/clinic/db.sqlite3</code>
                      </div>

                      <div className="meta-info-item">
                        <span className="meta-label">Django Administration Link</span>
                        <a 
                          href="http://127.0.0.1:8000/admin/" 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: "var(--primary)", fontWeight: 600 }}
                        >
                          Launch Django Admin Panel &rarr;
                        </a>
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Superuser Default Credentials:</div>
                        <div style={{ backgroundColor: "var(--bg-primary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-around" }}>
                          <div><strong>Username:</strong> <code style={{ background: "transparent" }}>admin</code></div>
                          <div><strong>Password:</strong> <code style={{ background: "transparent" }}>admin123</code></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-title-bar">
                      <h2>Technologies Stack</h2>
                    </div>

                    <div>
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Frontend Development:</div>
                        <div style={{ marginTop: "0.5rem" }}>
                          <span className="tech-tag">React.js v19</span>
                          <span className="tech-tag">Vite Core</span>
                          <span className="tech-tag">Axios client</span>
                          <span className="tech-tag">Lucide Icons</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Backend Core:</div>
                        <div style={{ marginTop: "0.5rem" }}>
                          <span className="tech-tag">Django v6.0</span>
                          <span className="tech-tag">Django REST Framework</span>
                          <span className="tech-tag">django-cors-headers</span>
                          <span className="tech-tag">SQLite Database</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL LAYER */}
      {activeModal && (
        <div className="modal-backdrop">
          
          {/* Modal Content - Patient */}
          {activeModal === "patient" && (
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingRecord ? "Modify Patient Details" : "Register New Patient"}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handlePatientSubmit}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Username *</label>
                      <input 
                        type="text" 
                        required 
                        value={patientForm.username} 
                        onChange={(e) => setPatientForm({...patientForm, username: e.target.value})}
                        placeholder="e.g. john_doe"
                        className="form-control"
                        disabled={!!editingRecord}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={patientForm.email} 
                        onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                        placeholder="e.g. john@email.com"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        value={patientForm.first_name} 
                        onChange={(e) => setPatientForm({...patientForm, first_name: e.target.value})}
                        placeholder="John"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        value={patientForm.last_name} 
                        onChange={(e) => setPatientForm({...patientForm, last_name: e.target.value})}
                        placeholder="Doe"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" 
                        value={patientForm.phone_number} 
                        onChange={(e) => setPatientForm({...patientForm, phone_number: e.target.value})}
                        placeholder="10 digit number"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input 
                        type="number" 
                        value={patientForm.age} 
                        onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                        placeholder="e.g. 35"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select 
                        value={patientForm.gender} 
                        onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                        className="form-control"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Address</label>
                      <textarea 
                        rows={2} 
                        value={patientForm.address} 
                        onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
                        placeholder="Enter full address details..."
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Patient</button>
                </div>
              </form>
            </div>
          )}

          {/* Modal Content - Doctor */}
          {activeModal === "doctor" && (
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingRecord ? "Edit Doctor Profile" : "Register On-Duty Doctor"}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleDoctorSubmit}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Username *</label>
                      <input 
                        type="text" 
                        required 
                        value={doctorForm.username} 
                        onChange={(e) => setDoctorForm({...doctorForm, username: e.target.value})}
                        placeholder="e.g. dr_smith"
                        className="form-control"
                        disabled={!!editingRecord}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={doctorForm.email} 
                        onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                        placeholder="e.g. smith@clinic.com"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        value={doctorForm.first_name} 
                        onChange={(e) => setDoctorForm({...doctorForm, first_name: e.target.value})}
                        placeholder="Sarah"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        value={doctorForm.last_name} 
                        onChange={(e) => setDoctorForm({...doctorForm, last_name: e.target.value})}
                        placeholder="Smith"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" 
                        value={doctorForm.phone_number} 
                        onChange={(e) => setDoctorForm({...doctorForm, phone_number: e.target.value})}
                        placeholder="e.g. 9876543210"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Specialization *</label>
                      <input 
                        type="text" 
                        required 
                        value={doctorForm.specialization} 
                        onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                        placeholder="e.g. Cardiologist"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consulting Fee (₹) *</label>
                      <input 
                        type="number" 
                        required 
                        value={doctorForm.fee} 
                        onChange={(e) => setDoctorForm({...doctorForm, fee: e.target.value})}
                        placeholder="e.g. 500"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group" style={{ justifyContent: "center" }}>
                      <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "1.5rem" }}>
                        <input 
                          type="checkbox" 
                          checked={doctorForm.is_available} 
                          onChange={(e) => setDoctorForm({...doctorForm, is_available: e.target.checked})}
                          style={{ width: "18px", height: "18px" }}
                        />
                        Available for Consultation
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Doctor</button>
                </div>
              </form>
            </div>
          )}

          {/* Modal Content - Appointment */}
          {activeModal === "appointment" && (
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingRecord ? "Reschedule Appointment" : "Schedule Clinical Appointment"}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAppointmentSubmit}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Select Patient *</label>
                      <select 
                        required 
                        value={appointmentForm.patient_id} 
                        onChange={(e) => setAppointmentForm({...appointmentForm, patient_id: e.target.value})}
                        className="form-control"
                      >
                        <option value="">-- Choose Patient --</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.first_name} {p.last_name} (@{p.username})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Select Doctor *</label>
                      <select 
                        required 
                        value={appointmentForm.doctor_id} 
                        onChange={(e) => setAppointmentForm({...appointmentForm, doctor_id: e.target.value})}
                        className="form-control"
                      >
                        <option value="">-- Choose Doctor --</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id} disabled={!d.is_available}>
                            Dr. {d.first_name} {d.last_name} ({d.specialization}) {!d.is_available && " - [Unavailable]"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Appointment Date *</label>
                      <input 
                        type="date" 
                        required 
                        value={appointmentForm.appointment_date} 
                        onChange={(e) => setAppointmentForm({...appointmentForm, appointment_date: e.target.value})}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time Slot *</label>
                      <input 
                        type="time" 
                        required 
                        value={appointmentForm.appointment_time} 
                        onChange={(e) => setAppointmentForm({...appointmentForm, appointment_time: e.target.value})}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Appointment Status</label>
                      <select 
                        value={appointmentForm.status} 
                        onChange={(e) => setAppointmentForm({...appointmentForm, status: e.target.value})}
                        className="form-control"
                      >
                        <option value="Booked">Booked</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Schedule Slot</button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;