import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/form.css";
const StudentForm = ({ initialData = {}, onSubmit }) => {
  const [student, setStudent] = useState(initialData);
  const navigate = useNavigate();
  const { id } = useParams();

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    profilePicture: null,
    birthdate: "",
    batchName: "",
    motherName: "",
    gender: "",
    christianName: "",
    previousSundaySchool: "",
    previousSundaySchoolStart: "",
    previousSundaySchoolEnd: "",
    higherEducation: "",
    institutionName: "",
    higherEducationStart: "",
    higherEducationEnd: "",
    graduatedIn: "",
    registrationDay: new Date().toISOString().split("T")[0], // Set to current date by default
    city: "",
    subCity: "",
    kebele: "",
    woreda: "",
    phone: "",
    postalNumber: "",
    email: "",
    employmentType: "",
    companyName: "",
    companyAddress: "",
    educationLevel: "",
    maritalStatus: "",
    liveWith: "",
    talentsInterests: "",
    preferredWorkArea: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [batchOptions, setBatchOptions] = useState([]);

  useEffect(() => {
    setBatchOptions([
      { batchName: "Batch 1" },
      { batchName: "Batch 2" },
      { batchName: "Batch 3" },
    ]);
  }, []);

  const handleInputChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
    console.log(`Input changed - ${name}:`, value);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${dateString}`);
      return null;
    }
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted. Current formData:", formData);

    const data = new FormData();

    // Required fields based on the schema
    const requiredFields = [
      "firstName",
      "middleName",
      "lastName",
      "motherName",
      "batchName",
      "birthdate",
      "registrationDay",
      "christianName",
      "higherEducation",
      "maritalStatus",
      "talentsInterests",
      "preferredWorkArea",
      "emergencyContactName",
      "emergencyContactPhone",
    ];

    // Check for required fields
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      alert(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      /*  Swal.fire({
        icon: "success",
        title: "Please fill in the following required fields:",
        text: "The course has been deleted successfully!",
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 3000,
        width: "300px",
      }); */
      return;
    }

    const dateFields = [
      "birthdate",
      "registrationDay",
      "previousSundaySchoolStart",
      "previousSundaySchoolEnd",
      "higherEducationStart",
      "higherEducationEnd",
      "graduatedIn",
    ];

    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== null &&
        formData[key] !== undefined &&
        formData[key] !== ""
      ) {
        if (key === "profilePicture") {
          data.append(key, formData[key]);
        } else if (dateFields.includes(key)) {
          const formattedDate = formatDate(formData[key]);
          if (formattedDate) {
            data.append(key, formattedDate);
          } else {
            console.warn(`Skipping invalid date for field: ${key}`);
          }
        } else {
          data.append(key, String(formData[key]));
        }
      }
    });

    try {
      const response = await axios.post("/api/students", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Student Registerd",
        text: "The student has been registerd successfully!",
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 3000,
        width: "300px",
      });
      if (onSubmit) {
        onSubmit(response.data);
      }

      navigate("/students");
    } catch (error) {
      console.error(
        "Error saving student data:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error saving student data. Please check all date fields and try again."
      );
    }
  };
  return (
    <div className="wrapper p-6">
      <form onSubmit={handleSubmit} encType="multipart/form-data" method="post">
        {/* Personal Information Section */}
        <section className="mb-6">
          <h3>የግል መረጃ</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-col">
              <label htmlFor="firstName">ስም:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="middleName">የአባት ስም:</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="lastName">የአያት ስም:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="profilePicture">ፕሮፋይል ምስል:</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="birthdate">የልደት ቀን:</label>
              <input
                type="text"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="form-control"
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="batchName">የትምህርት ክፍል:</label>
              <select
                id="batchName"
                name="batchName"
                value={formData.batchName}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                {batchOptions.map((batch, index) => (
                  <option key={index} value={batch.batchName}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-col">
              <label htmlFor="motherName">የእናት ስም:</label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="gender">ጾታ:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="male">ወንድ</option>
                <option value="female">ሴት</option>
              </select>
            </div>
          </div>
        </section>

        {/* Educational Information Section */}
        <section className="mb-6">
          <h3>የትምህርት ደረጃ</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-col">
              <label htmlFor="christianName">የክርስትና ስም:</label>
              <input
                type="text"
                id="christianName"
                name="christianName"
                value={formData.christianName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="previousSundaySchool">የቀዳሚ ሰንበት ቤት:</label>
              <input
                type="text"
                id="previousSundaySchool"
                name="previousSundaySchool"
                value={formData.previousSundaySchool}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="previousSundaySchoolStart">
                የቀዳሚ ሰንበት ትምህርት ቤት የጀመሩበት ቀን:
              </label>
              <input
                type="text"
                id="previousSundaySchoolStart"
                name="previousSundaySchoolStart"
                value={formData.previousSundaySchoolStart}
                onChange={handleInputChange}
                className="form-control"
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="previousSundaySchoolEnd">
                የቀዳሚ ሰንበት ትምህርት ቤት የጨረሱበት ቀን:
              </label>
              <input
                type="text"
                id="previousSundaySchoolEnd"
                name="previousSundaySchoolEnd"
                value={formData.previousSundaySchoolEnd}
                onChange={handleInputChange}
                className="form-control"
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="higherEducation">ከፍተኛ ትምህርት:</label>
              <input
                type="text"
                id="higherEducation"
                name="higherEducation"
                value={formData.higherEducation}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="institutionName">የትምህርት ቤት:</label>
              <input
                type="text"
                id="institutionName"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="higherEducationStart">
                ከፍተኛ ትምህርት የጀመሩበት ቀን:
              </label>
              <input
                type="text"
                id="higherEducationStart"
                name="higherEducationStart"
                value={formData.higherEducationStart}
                onChange={handleInputChange}
                className="form-control"
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="higherEducationEnd">ከፍተኛ ትምህርት የጨረሱበት ቀን:</label>
              <input
                type="text"
                id="higherEducationEnd"
                name="higherEducationEnd"
                value={formData.higherEducationEnd}
                onChange={handleInputChange}
                className="form-control"
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="graduatedIn">ከፍትኛ ትምህርት የጨረሱበት ቀን:</label>
              <input
                type="text"
                id="graduatedIn"
                name="graduatedIn"
                value={formData.graduatedIn}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
        </section>

        {/* Address Information Section */}
        <section className="mb-6">
          <h3>የአድራሻ መረጃ</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-col">
              <label htmlFor="city">ከተማ:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="subCity">ክፍለ ከተማ:</label>
              <input
                type="text"
                id="subCity"
                name="subCity"
                value={formData.subCity}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="kebele">ቀበሌ:</label>
              <input
                type="text"
                id="kebele"
                name="kebele"
                value={formData.kebele}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="woreda">ወረዳ:</label>
              <input
                type="text"
                id="woreda"
                name="woreda"
                value={formData.woreda}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="phone">ስልክ ቁጥር:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="postalNumber">ፖስታ ቁጥር:</label>
              <input
                type="text"
                id="postalNumber"
                name="postalNumber"
                value={formData.postalNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="email">ኢሜል:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
        </section>

        {/* Employment Information Section */}
        <section className="mb-6">
          <h3>የስራ መረጃ</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-col">
              <label htmlFor="employmentType">የስራ አይነት:</label>
              <input
                type="text"
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="companyName">የመስርያ ቤት ስም:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="companyAddress">የመስርያ ቤት አድራሻ:</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="educationLevel">የትምህርት ደረጃ:</label>
              <input
                type="text"
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
        </section>

        {/* Personal Details Section */}
        <section className="mb-6">
          <h3>ሌሎች</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-col">
              <label htmlFor="maritalStatus">የጋብቻ ሁኔታ:</label>
              <input
                type="text"
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="liveWith">የሚኖሩት:</label>
              <input
                type="text"
                id="liveWith"
                name="liveWith"
                value={formData.liveWith}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="talentsInterests">የተለየ ተሰጥኦ ፍላጎት:</label>
              <textarea
                id="talentsInterests"
                name="talentsInterests"
                value={formData.talentsInterests}
                onChange={handleInputChange}
                className="form-control"
                rows="4"
              ></textarea>
            </div>
            <div className="form-col">
              <label htmlFor="preferredWorkArea">ሊያገለግሉበት የሚፈልጉት ክፍል:</label>
              <textarea
                id="preferredWorkArea"
                name="preferredWorkArea"
                value={formData.preferredWorkArea}
                onChange={handleInputChange}
                className="form-control"
                rows="4"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section className="mb-6">
          <h3>አደጋ ጊዜ ተጠሪ</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-col">
              <label htmlFor="emergencyContactName">የአደጋ ግዜ ተጠሪ (1):</label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-col">
              <label htmlFor="emergencyContactPhone">ስልክ ቁጥር (1):</label>
              <input
                type="text"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
