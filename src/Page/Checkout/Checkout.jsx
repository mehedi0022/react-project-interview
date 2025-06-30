import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Utils/Loader/Loader";

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { cartItems = [], quantity = 1 } = location.state || {};

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.discount_price * quantity,
    0
  );

  const [formData, setFormData] = useState({
    course_id: cartItems[0].id,
    name: "",
    email: "",
    phone_no: "",
    photo: "#",
    father_name: "",
    father_phone_no: "",
    school_collage_name: "",
    job_title: "",
    gender: "",
    admission_date: "",
    present_address: "",
    permanent_address: "",
    nid_no: "",
    blood_group: "",
    date_of_birth: "",
    local_guardian_name: "",
    local_guardian_phone_no: "",
    course_fee: cartItems[0].regular_price,
    course_qty: quantity,
    total_course_fee: totalPrice,
    discount_course_fee: cartItems[0].discount_price,
    sub_total_course_fee: totalPrice,
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile?.type?.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview("");
    }
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();

    form.append("photo", file);
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await axios.post(
        "https://itder.com/api/course-purchase",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res) {
        toast.success("Order submitted successfully!");
        setFormData({
          course_id: cartItems[0].id,
          name: "",
          email: "",
          phone_no: "",
          photo: "#",
          father_name: "",
          father_phone_no: "",
          school_collage_name: "",
          job_title: "",
          gender: "",
          admission_date: "",
          present_address: "",
          permanent_address: "",
          nid_no: "",
          blood_group: "",
          date_of_birth: "",
          local_guardian_name: "",
          local_guardian_phone_no: "",
          course_fee: cartItems[0].regular_price,
          course_qty: quantity,
          total_course_fee: totalPrice,
          discount_course_fee: cartItems[0].discount_price,
          sub_total_course_fee: totalPrice,
        });
        setFile(null);
        setPreview("");
        setLoading(false);

        navigate("/order-details", {
          state: { orderDetails: res.data },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit order. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-5 border mx-2">
      <div className="bg-purple-700 text-white p-6 text-center mb-5">
        <h2 className="text-4xl font-bold">Checkout Form</h2>
      </div>

      <form
        onSubmit={submitOrder}
        className="bg-white shadow-md rounded-lg p-6"
      >
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {["name", "email", "phone_no"].map((key) => (
            <div key={key}>
              <label className="block font-semibold mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type={
                  key === "email"
                    ? "email"
                    : key === "phone_no"
                    ? "tel"
                    : "text"
                }
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-2">
              Father/Mother Name:
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.father_name}
              onChange={(e) => handleChange("father_name", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">
              Father/Mother Phone:
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.father_phone_no}
              onChange={(e) => handleChange("father_phone_no", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">School/College:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.school_collage_name}
              onChange={(e) =>
                handleChange("school_collage_name", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-2">Job Title:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.job_title}
              onChange={(e) => handleChange("job_title", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Gender:</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Admission Date:</label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.admission_date}
              onChange={(e) => handleChange("admission_date", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-2">Present Address:</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.present_address}
              onChange={(e) => handleChange("present_address", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">
              Permanent Address:
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.permanent_address}
              onChange={(e) =>
                handleChange("permanent_address", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-2">NID Number:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.nid_no}
              onChange={(e) => handleChange("nid_no", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Blood Group:</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.blood_group}
              onChange={(e) => handleChange("blood_group", e.target.value)}
            >
              <option value="" disabled>
                Select Blood Group
              </option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Date of Birth:</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.date_of_birth}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
            />
          </div>
        </div>

        {/* Guardian Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-2">
              Local Guardian’s Name:
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.local_guardian_name}
              onChange={(e) =>
                handleChange("local_guardian_name", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">
              Local Guardian’s Phone:
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={formData.local_guardian_phone_no}
              onChange={(e) =>
                handleChange("local_guardian_phone_no", e.target.value)
              }
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label
            htmlFor="fileUpload"
            className="block font-semibold mb-2 cursor-pointer"
          >
            Upload File:
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="fileUpload"
              className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Choose File
            </label>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-sm text-gray-600">
              {file?.name || "No file chosen"}
            </span>
          </div>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-40 rounded border"
            />
          )}
        </div>

        {/* Cart Table */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">Order Summary</h3>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Course</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={item.photo}
                        alt="Course"
                        className="w-14 h-10 object-cover rounded"
                      />
                      {item.course_name}
                    </td>
                    <td className="p-3">{item.discount_price} BDT</td>
                    <td className="p-3">{quantity}</td>
                    <td className="p-3">
                      {item.discount_price * quantity} BDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-right font-bold mb-4">Total: {totalPrice} BDT</div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#D2C5A2] hover:bg-[#bcae8d] text-black font-semibold py-2 px-6 rounded w-full md:w-auto"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
