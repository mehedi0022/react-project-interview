import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Utils/Loader/Loader";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://itder.com/api/get-course-list");
        setCourses(res.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchCourses();
  }, []);

  console.log(courses);

  const addToCart = (course) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.some((item) => item.id === course.id)) {
      toast.error("Course already in cart");
      return;
    }
    if (cart.length >= 1) {
      toast.error("You can only add up to 1 courses to the cart");
      return;
    }

    cart.push(course);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Course added to cart");
  };

  if (!courses.courseData) {
    return <Loader />;
  }

  return (
    <div className="m-mt_16px">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.courseData?.map((course, index) => (
          <div
            key={index}
            className=" bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="relative">
              <img src={course.photo} alt="" />
              <div className="absolute top-0 left-0 p-2">
                <h3 className="text-black text-xl font-bold">Category</h3>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-gray-800 text-lg font-semibold mb-2">
                {course.course_name}
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="flex text-blue-500 text-md">★★★★★</span>
                <span className="ml-2 text-gray-600 text-md font-bold">
                  {course.trainer_data.name}
                </span>
              </div>
              <p className="text-gray-600 text-md mb-4">
                Course Details{" "}
                <span className="text-blue-500">
                  Show Details(no need to change)
                </span>
              </p>
              <hr />
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="line-through text-gray-400 text-sm">
                    {course.regular_price} Tk
                  </span>
                  <span className="text-green-600 text-md font-bold ml-2">
                    -{" "}
                    {((course.regular_price - course.discount_price) /
                      course.regular_price) *
                      100}
                    %
                  </span>
                  <span className="text-black text-lg font-bold ml-2">
                    {course.discount_price} Tk
                  </span>
                </div>
                {/* <span className="text-green-600 text-sm">Earn Tk 48</span> */}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => addToCart(course)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500 w-full font-bold text-md"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
