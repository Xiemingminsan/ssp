import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CreateHierarchy = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "",
    description: "",
    isActive: "true",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    "https://placehold.co/70x70"
  );
  const router = useRouter();

  useEffect(() => {
    if (photo) {
      console.log("Photo state updated:", photo); // This will log the updated photo state
    }
  }, [photo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setPhoto(file);
      console.log(photo);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
    };

    try {
      const response = await fetch("/api/hierarchy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("ok");
        router.push("/management"); // Redirect on success
      } else {
        console.error("Failed to create hierarchy entry");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className=" rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h1>Add Student</h1>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center relative">
            <div className="relative">
              <Image
                src={photoPreview}
                alt="Profile Icon"
                id="profileImage"
                className="mb-4 w-20 h-20 rounded-full object-cover"
                width={70}
                height={70}
              />
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              id="photoInput"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              onChange={handleFileChange}
              border="1px solid black"
            />
            <h1 className="text-xl font-semibold mb-6">ምስል</h1>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              ሙሉ ስም
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              ስልክ ቁጥር
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              የአገልግሎት ክፍል
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="ጽ/ቤት">ጽ/ቤት</option>
              <option value="መዝሙር ክፍል">መዝሙር ክፍል</option>
              <option value="ትምህርት ክፍል">ትምህርት ክፍል</option>
              <option value="ህፃናት ክፍል">ህፃናት ክፍል</option>
              <option value="ግንኙነት">ግንኙነት</option>
              <option value="ኪነ-ጥበብ">ኪነ-ጥበብ</option>
              <option value="ሂሳብ ክፍል">ሂሳብ ክፍል</option>
              <option value="ንብረት ክፍል">ንብረት ክፍል</option>
              <option value="ልማት እና በጎአድራጎት">ልማት እና በጎአድራጎት</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              ሃላፊነት
            </label>
            <select
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full text-black  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="ሰብሳቢ">ሰብሳቢ</option>
              <option value="ም/ሰብሳቢ">ም/ሰብሳቢ</option>
              <option value="ፀሃፊ">ፀሃፊ</option>
              <option value="አባል">አባል</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="isActive"
              className="block text-sm font-medium text-gray-700"
            >
              Is Active?
            </label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              className="mt-1 block w-full text-black  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHierarchy;
