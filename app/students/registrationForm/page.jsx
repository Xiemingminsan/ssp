"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import { useEffect } from "react";
import { Upload } from "lucide-react";
import {
  Box,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";


const FormWrapper = styled(Box)({
  padding: "2rem",
  maxWidth: "800px",
  margin: "0 auto",
  color: "black",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
});

const FormSection = styled(Box)({
  marginBottom: "2rem",
});

const FormTextArea = styled("textarea")({
  width: "100%",
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
  marginBottom: "1rem",
  placeholder: "test",
});

const FormInput = styled("input")({
  width: "100%",
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
  marginBottom: "1rem",
  color: "black",
});

const FormSelect = styled("select")({
  width: "100%",
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
  marginBottom: "1rem",
  color: "black",
});

const StudentForm = ({ initialData, onSubmit, onCancel }) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    console.log("Initial data in StudentForm:", initialData);
  }, [initialData]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/student/batches");

        if (response.ok) {
          const data = await response.json(); 

          
          console.log("Fetched data:", data);

          
          if (Array.isArray(data) && data.length > 0) {
            
            const batchNames = data.map((batch) => batch.name);
            console.log("Batch names:", batchNames);

            
            setBatches(data);
          } else {
            console.warn(
              "No batches found or data is not in the expected format"
            );
          }
        } else {
          console.error("Failed to fetch batches, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);
  const [formData, setFormData] = useState(
    initialData || {
      firstname: "",
      middlename: "",
      lastname: "",
      profilepicture: "",
      birthdate: "",
      batch: "66c5aba7fb73588f244b8b17",
      batchname: "",
      mothername: "",
      gender: "",
      christianname: "",
      previoussundayschool: "",
      previoussundayschoolstart: "",
      previoussundayschoolend: "",
      highereducation: "",
      institutionname: "",
      highereducationstart: "",
      highereducationend: "",
      graduatedin: "",
      registrationday: new Date().toISOString().split("T")[0], 
      city: "",
      subcity: "",
      kebele: "",
      woreda: "",
      phone: "",
      postalnumber: "",
      email: "",
      employmenttype: "",
      companyname: "",
      companyaddress: "",
      educationlevel: "",
      maritalstatus: "",
      livewith: "",
      talentsinterests: "",
      preferredworkarea: "",
      emergencycontactname: "",
      emergencycontactphone: "",
    }
  );

  const [batchOptions, setBatchOptions] = useState([]);

 
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState("");
  const [batches, setBatches] = useState([]);
  const steps = [
    "Personal Information",
    "Educational Information",
    "Address Information",
    "Employment Information",
    "Personal Details",
    "Emergency Contact",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "batchname") {
      setBatch(value);
      console.log("Batch updated to:", value);
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const apiFormData = {
      _id: formData._id,
      firstname: formData.firstname,
      middlename: formData.middlename,
      lastname: formData.lastname,
      profilepicture: formData.profilepicture,
      birthdate: formData.birthdate,
      batch: formData.batch,
      batchname: formData.batchname,
      mothername: formData.mothername,
      gender: formData.gender,
      christianname: formData.christianname,
      previoussundayschool: formData.previoussundayschool,
      previoussundayschoolstart: formData.previoussundayschoolstart,
      previoussundayschoolend: formData.previoussundayschoolend,
      highereducation: formData.highereducation,
      institutionname: formData.institutionname,
      highereducationstart: formData.highereducationstart,
      highereducationend: formData.highereducationend,
      graduatedin: formData.graduatedin,
      registrationday: formData.registrationday,
      city: formData.city,
      subcity: formData.subcity,
      kebele: formData.kebele,
      woreda: formData.woreda,
      phone: formData.phone,
      postalnumber: formData.postalnumber,
      email: formData.email,
      employmenttype: formData.employmenttype,
      companyname: formData.companyname,
      companyaddress: formData.companyaddress,
      educationlevel: formData.educationlevel,
      maritalstatus: formData.maritalstatus,
      livewith: formData.livewith,
      talentsinterests: formData.talentsinterests,
      preferredworkarea: formData.preferredworkarea,
      emergencycontactname: formData.emergencycontactname,
      emergencycontactphone: formData.emergencycontactphone,
      courses: [], 
      attendance: [], 
    };

    try {
      if (onSubmit) {
        
        await onSubmit(apiFormData);
      } else {
        const response = await axios.post(
          "/api/student/students",
          JSON.stringify(apiFormData),
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Submitting formData:", apiFormData);
        if (response.status === 201) {
          showSuccessToast("Student created successfully");
          router.push("/students");
        } else {
          showErrorToast("Error creating student. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving student data:", error);
      if (error.response) {
        showErrorToast(`Error: ${error.response.data.message}`);
      } else {
        showErrorToast("An error occurred. Please try again later.");
      }
    }
    console.log(apiFormData);
  };
  return (
    <FormWrapper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Divider sx={{ my: 2 }} />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        method="post"
        className="color: black"
      >
        {activeStep === 0 && (
          <FormSection>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 color-black">
              <div>
                <label htmlFor="firstName" className="block mb-2">
                  First Name:
                </label>
                <FormInput
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="middlename" className="block mb-2">
                  Middle Name:
                </label>
                <FormInput
                  type="text"
                  id="middlename"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2">
                  Last Name:
                </label>
                <FormInput
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="profilepicture" className="block mb-2">
                  Profile Picture:
                </label>
                <FormInput
                  type="file"
                  id="profilepicture"
                  name="profilepicture"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <label htmlFor="birthdate" className="block mb-2">
                  Birthdate:
                </label>
                <FormInput
                  type="text"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  required
                />
              </div>
              <div>
                <label htmlFor="batchname" className="block mb-2">
                  Batch Name:
                </label>
                <FormSelect
                  id="batchname"
                  name="batchname"
                  value={formData.batchname}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select Batch
                  </option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch.name}>
                      {batch.name}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <div>
                <label htmlFor="mothername" className="block mb-2">
                  Mother Name:
                </label>
                <FormInput
                  type="text"
                  id="mothername"
                  name="mothername"
                  value={formData.mothername}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block mb-2">
                  Gender:
                </label>
                <FormSelect
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </FormSelect>
              </div>
            </div>
          </FormSection>
        )}
        {activeStep === 1 && (
          <FormSection>
            {
             
              <section className="mb-6">
                <h3>የትምህርት ደረጃ</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="form-col">
                    <label htmlFor="christianname">የክርስትና ስም:</label>
                    <FormInput
                      type="text"
                      id="christianname"
                      name="christianname"
                      value={formData.christianname}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="previoussundayschool">የቀዳሚ ሰንበት ቤት:</label>
                    <FormInput
                      type="text"
                      id="previoussundayschool"
                      name="previoussundayschool"
                      value={formData.previoussundayschool}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="previoussundayschoolstart">
                      የቀዳሚ ሰንበት ትምህርት ቤት የጀመሩበት ቀን:
                    </label>
                    <FormInput
                      type="text"
                      id="previoussundayschoolstart"
                      name="previoussundayschoolstart"
                      value={formData.previoussundayschoolstart}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="DD/MM/YYYY"
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="previoussundayschoolend">
                      የቀዳሚ ሰንበት ትምህርት ቤት የጨረሱበት ቀን:
                    </label>
                    <FormInput
                      type="text"
                      id="previoussundayschoolend"
                      name="previoussundayschoolend"
                      value={formData.previoussundayschoolend}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="DD/MM/YYYY"
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="highereducation">ከፍተኛ ትምህርት:</label>
                    <FormInput
                      type="text"
                      id="highereducation"
                      name="highereducation"
                      value={formData.highereducation}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="institutionname">የትምህርት ቤት:</label>
                    <FormInput
                      type="text"
                      id="institutionname"
                      name="institutionname"
                      value={formData.institutionname}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="highereducationstart">
                      ከፍተኛ ትምህርት የጀመሩበት ቀን:
                    </label>
                    <FormInput
                      type="text"
                      id="highereducationstart"
                      name="highereducationstart"
                      value={formData.highereducationstart}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="DD/MM/YYYY"
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="highereducationEnd">
                      ከፍተኛ ትምህርት የጨረሱበት ቀን:
                    </label>
                    <FormInput
                      type="text"
                      id="highereducationend"
                      name="highereducationend"
                      value={formData.highereducationend}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="DD/MM/YYYY"
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="graduatedin">ከፍትኛ ትምህርት የጨረሱበት ቀን:</label>
                    <FormInput
                      type="text"
                      id="graduatedin"
                      name="graduatedin"
                      value={formData.graduatedin}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </section>
            }
          </FormSection>
        )}
        {activeStep === 2 && (
          <FormSection>
            {
             
              <section className="mb-6">
                <h3>የአድራሻ መረጃ</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="form-col">
                    <label htmlFor="city">ከተማ:</label>
                    <FormInput
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
                    <FormInput
                      type="text"
                      id="subcity"
                      name="subcity"
                      value={formData.subcity}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="kebele">ቀበሌ:</label>
                    <FormInput
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
                    <FormInput
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
                    <FormInput
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="postalnumber">ፖስታ ቁጥር:</label>
                    <FormInput
                      type="text"
                      id="postalnumber"
                      name="postalnumber"
                      value={formData.postalnumber}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="email">ኢሜል:</label>
                    <FormInput
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
            }
          </FormSection>
        )}
        {activeStep === 3 && (
          <FormSection>
            {
             
              <section className="mb-6">
                <h3>የስራ መረጃ</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="form-col">
                    <label htmlFor="employmenttype">የስራ አይነት:</label>
                    <FormInput
                      type="text"
                      id="employmenttype"
                      name="employmenttype"
                      value={formData.employmenttype}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="companyname">የመስርያ ቤት ስም:</label>
                    <FormInput
                      type="text"
                      id="companyname"
                      name="companyname"
                      value={formData.companyname}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="companyaddress">የመስርያ ቤት አድራሻ:</label>
                    <FormInput
                      type="text"
                      id="companyaddress"
                      name="companyaddress"
                      value={formData.companyaddress}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="educationlevel">የትምህርት ደረጃ:</label>
                    <FormInput
                      type="text"
                      id="educationlevel"
                      name="educationlevel"
                      value={formData.educationlevel}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </section>
            }
          </FormSection>
        )}
        {activeStep === 4 && (
          <FormSection>
            {
             
              <section className="mb-6">
                <h3>ሌሎች</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="form-col">
                    <label htmlFor="maritalstatus">የጋብቻ ሁኔታ:</label>
                    <FormInput
                      type="text"
                      id="maritalstatus"
                      name="maritalstatus"
                      value={formData.maritalstatus}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="livewith">የሚኖሩት:</label>
                    <FormInput
                      type="text"
                      id="livewith"
                      name="livewith"
                      value={formData.livewith}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="talentsinterests">የተለየ ተሰጥኦ ፍላጎት:</label>
                    <textarea
                      id="talentsinterests"
                      name="talentsinterests"
                      value={formData.talentsinterests}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-col">
                    <label htmlFor="preferredworkarea">
                      ሊያገለግሉበት የሚፈልጉት ክፍል:
                    </label>
                    <textarea
                      id="preferredworkarea"
                      name="preferredworkarea"
                      value={formData.preferredworkarea}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              </section>
            }
          </FormSection>
        )}
        {activeStep === 5 && (
          <FormSection>
            {
             
              <section className="mb-6">
                <h3>አደጋ ጊዜ ተጠሪ</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="form-col">
                    <label htmlFor="emergencycontactname">
                      የአደጋ ግዜ ተጠሪ (1):
                    </label>
                    <FormInput
                      type="text"
                      id="emergencycontactname"
                      name="emergencycontactname"
                      value={formData.emergencycontactname}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="emergencycontactphone">ስልክ ቁጥር (1):</label>
                    <FormInput
                      type="text"
                      id="emergencycontactphone"
                      name="emergencycontactphone"
                      value={formData.emergencycontactphone}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </section>
            }
          </FormSection>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0}
            variant="contained"
            onClick={handleBack}
            sx={{ my: 1, mx: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            type="button"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
            sx={{ my: 1, mx: 1 }}
          >
            {activeStep === steps.length - 1
              ? initialData
                ? "Save"
                : "Submit"
              : "Next"}
          </Button>
          {initialData && (
            <Button
              variant="contained"
              onClick={onCancel}
              sx={{ my: 1, mx: 1 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>
    </FormWrapper>
  );
};

export default StudentForm;
