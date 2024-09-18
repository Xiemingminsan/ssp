import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
const CreateHierarchy = ({ onClose, editData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "",
    description: "",
    isActive: "true",
    email: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    "https://placehold.co/70x70"
  );
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        phone: editData.phone,
        role: editData.role,
        description: editData.description,
        isActive: editData.isActive.toString(),
        email: editData.email,
        password: editData.password,
      });
      setPhotoPreview(
        editData.photo
          ? `/Profile_Img/${editData.photo}`
          : "https://placehold.co/70x70"
      );
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (editData && formData[key] !== editData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (!editData) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (photo) {
      formDataToSend.append("photo", photo);
      console.log("Photo appended to form data:", photo.name);
    }

    try {
      const url = editData
        ? `/api/hierarchy/${editData._id}`
        : "/api/hierarchy";

      console.log("Submitting to URL:", url);
      console.log("Form data keys:", Array.from(formDataToSend.keys()));

      const response = await fetch(url, {
        method: editData ? "PUT" : "POST",
        body: formDataToSend,
      });

      const responseText = await response.text();
      console.log("Raw server response:", responseText);

      if (response.ok) {
        window.location.reload();
        showSuccessToast("Success");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError(
        `Failed to submit form data. Please try again. Error: ${error.message}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8  text-black">
      <div className="mb-4 ">
        <div className="mt-2 flex justify-center">
          <Image
            src={photoPreview}
            alt="Preview"
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {" "}
          Email{" "}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="" disabled>
            Select Head of Department
          </option>
          <option value="SchoolHead">ትምህርት ክፍል</option>
          <option value="LetterHead">ደብዳቤ ክፍል</option>
          <option value="ConductHead">ቅጣት ክፍል</option>
          <option value="ልማት እና በጎአድራጎት">ልማት እና በጎአድራጎት</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700"
        >
          Photo
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="isActive"
          className="block text-sm font-medium text-gray-700"
        >
          Active Status
        </label>
        <select
          name="isActive"
          id="isActive"
          value={formData.isActive}
          onChange={handleChange}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <div className="flex justify-end mb-8">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {editData ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateHierarchy;
