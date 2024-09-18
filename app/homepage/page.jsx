"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Search,
  Bell,
  Calendar,
  Send,
  ChevronLeft,
  CornerLeftDown,
} from "lucide-react";
import Image from "next/image";
import Protection from "../Protection";
import Layout from "../components/layout";
import LoadingScreen from "../components/LoadingScreen";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SalesDashboard = () => {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [letters, setLetters] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/inventory");
        const data = await response.json();
        const processedData = data.map((item) => ({
          name: item.name,
          value: item.quantity,
        }));
        setCategories(processedData);
        setTotalQuantity(
          processedData.reduce((sum, item) => sum + item.value, 0)
        );
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/hierarchy");
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };

    fetchInventory();
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch("/api/letters");
        const data = await response.json();
        setLetters(data);
      } catch (error) {
        console.error("Error fetching letters:", error);
      }
    };

    fetchLetters();
  }, []);

  const nextLetter = () => {
    setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  const previousLetter = () => {
    setCurrentLetterIndex(
      (prevIndex) => (prevIndex - 1 + letters.length) % letters.length
    );
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/event");
        const data = await response.json();
        // Sort events by date in descending order
        const sortedEvents = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        // Get the 3 most recent events
        setEvents(sortedEvents.slice(0, 3));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  const handleRedirect = () => {
    router.push("/event");
  };
  const handleNotificationClick = () => {
    router.push("/request");
  };

  const currentLetter = letters[currentLetterIndex] || {};
  const getTagColor = (tag) => {
    const colors = {
      Feedback: "bg-blue-100 text-blue-800",
      Bug: "bg-red-100 text-red-800",
      "Design System": "bg-purple-100 text-purple-800",
    };
    return colors[tag] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch("/api/inventory/requests/pending");
        const data = await response.json();
        setNotifications(data.length);
      } catch (error) {
        console.error("Error fetching letters:", error);
      }
    };

    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    fetchNotification();
  }, []);

  const COLORS = [
    "#4ade80", // Green
    "#3b82f6", // Blue
    "#facc15", // Yellow
    "#f87171", // Red
    "#a78bfa", // Purple
    "#34d399", // Teal
    "#f97316", // Orange
    "#2dd4bf", // Turquoise
    "#f43f5e", // Rose
    "#6b7280", // Gray
    "#ec4899", // Pink
    "#14b8a6", // Cyan
    "#e879f9", // Magenta
    "#fde047", // Lemon
    "#60a5fa", // Light Blue
  ];

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="bg-gray-50 p-4 sm:p-6 font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-black">
              {greeting}, {session?.user?.name}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="relative" onClick={handleNotificationClick}>
                  <button>
                    <Bell className="w-6 h-6 text-blue-500" />
                  </button>
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center text-white">
                    {notifications}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div
                className="text-white p-4 sm:p-6 rounded-lg min-h-[200px] bg-cover bg-center"
                style={{ backgroundImage: "url(/Images/banner.png)" }}
              >
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  autoPlay
                  interval={5000}
                  stopOnHover={true}
                  showIndicators={false}
                  selectedItem={currentLetterIndex}
                  onChange={(index) => setCurrentLetterIndex(index)}
                  className="w-full"
                >
                  <div className="carousel-item bg-cover bg-center">
                    <h2 className="text-xl">
                      በ፲፱፻፴፮ ዓ.ም አጼ ኃይለ ሥላሴ ከጠላት ወረራ በፊት በ፲፱፻፳፬ ያስጀመሩትን እና በጣሊያን
                      ወረራ ምክንያት የተቋረጠውን አዲሱን መካነ ስለሴ ገዳም ስራ አጠናቀው የቅዳሴ ቤቱን በዐል
                      ጥር ፯ ቀን ፲፱፻፴፮ ዓ.ም በደማቅ ሁኔታ ለማክበር ብዙ ሊቃ ጳጳሳት፣ የሀገር መሪዎች፣
                      ዲፕሎማቶች እና ከሀገር ውስጥ ለተጠሩ መኳንንት፣ መሳፍንት፣ በወቅቱ የከተማውን ሕዝብ
                      የገዳሙን ህንፃ መጠናቀቅ በጉጉት ይጠብቅ ስለነበር እጅግ ብዙ ሰው እንደሚመጣ ያሰቡት የወቅቱ
                      የገዳሙ መምህር አባ መልዕክቱ (ብፁዕ ወቅዱስ አቡነ ቴዎፍሎስ)፣ ሁለተኛው የቤተክርስቲያናችን
                      ፓትርያርክ የአካባቢውን ወጣቶች ሰብስበው ለማስተማር እና ስለ በዓሉ እና ስለወጣቶቹ
                      አገልግሎት በቂ ግንዛቤ በማስጨበጥ ወጣቶቹን ወደ አገልግሎት አሰማሩ::
                    </h2>
                  </div>
                  <div className="carousel-item bg-cover bg-center">
                    <h2 className="text-xl">
                      {" "}
                      በዓሉም በወጣቶቹ አገልግሎት አምሮና ደምቆ ስለተከበረ አባ መልዕክቱ የወጣቶቹን አገልግሎት
                      የበለጠ እንዲቀጥል ሰብስበው ማስተማር ቀጠሉ በኋላም የገዳሙ አለቃ ተብለው ሲመደቡ እራሱን
                      የቻለ መምህር በመመደብ ወጣቶቹ በሰንበት በሰንበት የበለጠ እንዲማሩ አደረጉ፡፡ ከቅዳሴ ቤቱ
                      ክብረ በዓል በኋላ ብዙ የከተማው ምዕመን ወደ ቤተክርስቲያኑ እየመጣ ያስቀድስ ስለነበር
                      ወጣቶቹ በቅዳሴ ሰዓት የሚመጡ የምዕመናንን እና እንግዶችን በተገቢው መንገድ በማስተናገድ፣
                      የምዕመናንን፣ የመኳንንቱንና የመሳፍንቱ ልጆች በቅዳሴ ሰአት እንዳያውኩ በመንከባከብና
                      በማስተማር አገልግሎታቸውን እና ትምህርታቸው የበለጠ ተጠናክሮ እንዲቀጥል አድርጎታል፡፡
                    </h2>
                  </div>
                  <div className="carousel-item bg-cover bg-center">
                    <h2 className="text-xl">
                      {" "}
                      ከዚህም በኋላ በቤ/ያን ዙሪያ ከፍተኛ አስተዋፅኦ ሲያደርጉ የነበሩ ሌሎችም ማኀበራት ነበሩ
                      ሃይማኖተ አበው የኑቪርስቲ ተማሪዎች ማኀበርየጳውሎስ መንፈሳዊ ትምህርት ቤት ወጣቶች
                      ማኀበርየቅ/ሥላሴ ኮሌጅ ተማሪዎች እና አስተማሪዎች ማኀበር የተምሮ ማስተማር ማኀበር …ወዘተ
                      ናቸው፡፡ <br></br>ሒልኮ ግቢ ጉባኤ ፳፻፲፮ ዓ.ም
                    </h2>
                  </div>
                </Carousel>
              </div>

              <div className="p-4 sm:p-6 font-sans rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-4">
                  Recent Messages
                </h3>
                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg h-64 relative overflow-hidden">
                  {letters.length > 0 ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(Math.min(3, letters.length))].map(
                          (_, index) => (
                            <div
                              key={index}
                              className={`bg-white rounded-lg p-3 shadow-lg absolute w-5/6 h-48 transition-all duration-300 ${
                                index === 0
                                  ? "z-30 opacity-100 scale-100"
                                  : index === 1
                                  ? "z-20 opacity-90 scale-95 translate-x-2 translate-y-2"
                                  : "z-10 opacity-80 scale-90 translate-x-4 translate-y-4"
                              }`}
                              style={{
                                transform: `rotate(${index * 2}deg)`,
                              }}
                            >
                              {index === 0 && (
                                <>
                                  <div className="flex space-x-2 mb-2">
                                    {currentLetter.tags?.map(
                                      (tag, tagIndex) => (
                                        <span
                                          key={tagIndex}
                                          className={`px-2 py-1 rounded-full text-xs ${getTagColor(
                                            tag
                                          )}`}
                                        >
                                          {tag}
                                        </span>
                                      )
                                    )}
                                  </div>
                                  <h4 className="font-bold text-lg mb-1 text-black truncate">
                                    {currentLetter.subject || "No Subject"}
                                  </h4>
                                  <p className="text-xs text-gray-600 mb-1 truncate">
                                    {currentLetter.date || "No Date"}
                                  </p>
                                  <p className="text-sm text-gray-700 mb-2">
                                    {currentLetter.description ||
                                      "No description available"}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                      {currentLetter.avatars
                                        ?.slice(0, 3)
                                        .map((avatar, avatarIndex) => (
                                          <Image
                                            key={avatarIndex}
                                            src={avatar}
                                            alt="User avatar"
                                            width={24} // Width of the image in pixels
                                            height={24} // Height of the image in pixels
                                            className="rounded-full border-2 border-white"
                                          />
                                        ))}
                                    </div>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        currentLetter.status === "received"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {currentLetter.status === "received"
                                        ? "Received"
                                        : "Sent"}
                                    </span>
                                  </div>
                                  {currentLetter.status === "received" ? (
                                    <CornerLeftDown className="absolute top-2 right-2 w-6 h-6 text-green-500" />
                                  ) : (
                                    <Send className="absolute top-2 right-2 w-6 h-6 text-blue-500" />
                                  )}
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                      {letters.length > 1 && (
                        <>
                          <button
                            onClick={previousLetter}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-lg z-40"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            onClick={nextLetter}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-lg z-40"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-white">No Messages available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-black">
                    Management
                  </h3>
                  <ChevronRight size={20} />
                </div>
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Profile</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers
                      .filter((member) => member.isActive === true)
                      .sort((a, b) => {
                        const order = ["ሰብሳቢ", "ም/ሰብሳቢ", "ፀሃፊ", "አባል"];
                        return (
                          order.indexOf(a.description) -
                          order.indexOf(b.description)
                        );
                      })
                      .slice(0, 5)
                      .map((member, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200 text-black"
                        >
                          <td className="p-2">
                            <div className="flex items-center">
                              {member.photo ? (
                                <Image
                                  src={`/Profile_Img/${member.photo}`}
                                  alt="Profile Picture"
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <span className="font-medium">No Image</span>
                              )}
                            </div>
                          </td>

                          <td className="p-2">
                            <div className="flex items-center">
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="p-2">{member.phone}</td>
                          <td className="p-2">{member.role}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-black">
                    Items in store
                  </h3>
                  <ChevronRight size={20} />
                </div>
                <div className="relative h-48 w-48 mx-auto text-black">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categories.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-black">
                      {totalQuantity.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-black">
                  {categories.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center text-black">
                        <div
                          className={`w-3 h-3 rounded-full mr-2`}
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <span>
                        {((category.value / totalQuantity) * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg flex flex-col items-left">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg sm:text-xl font-bold text-black">
                    Next Upcoming Event
                  </h3>
                  <Image
                    src="/images/selase calander.png"
                    alt="Event illustration"
                    width={300}
                    height={280}
                  />
                </div>

                {events.map((event, index) => (
                  <div key={index} className="flex flex-row pl-4 sm:flex-row ">
                    <div>
                      <h4 className="font-bold text-black">{event.reason}</h4>
                      <h6 className="text-sm text-gray-500 flex items-left">
                        <Calendar size={16} className="mr-1" />
                        {formatDate(event.date)}
                      </h6>
                    </div>
                  </div>
                ))}

                <button
                  className="mt-4 flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                  onClick={handleRedirect}
                >
                  View event calendar
                  <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Protection>
  );
};

export default SalesDashboard;
