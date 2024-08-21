"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../public/css/home.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Protection from "../Protection";
import Layout from "../components/layout";

const LandingPage = ({
  upcomingEvent,
  hierarchies,
  items,
  expenses,
  letters,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleIndicatorClick = (index) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Protection>
      <Layout>
        <div
          className="container mx-auto px-4 py-8"
          style={{ marginLeft: "2.5%" }}
        >
          <div className="bg-white rounded-lg shadow custom-shadow fixed-height2 relative mb-5 overflow-hidden">
            <div
              id="carousel"
              className="h-full relative custom-carousel-height"
            >
              <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                autoPlay
                interval={5000}
                stopOnHover={true}
                emulateTouch
                showIndicators={true}
                className="h-full"
              >
                <div className="carousel-item active p-6 item1 custom-carousel-item-height">
                  <h2 className="text-white text-xl">
                    በ፲፱፻፴፮ ዓ.ም አጼ ኃይለ ሥላሴ ከጠላት ወረራ በፊት በ፲፱፻፳፬ ...
                  </h2>
                </div>
                <div className="carousel-item p-6 item2 custom-carousel-item-height">
                  <h2 className="text-white text-xl">
                    በዓሉም በወጣቶቹ አገልግሎት አምሮና ደምቆ ...
                  </h2>
                </div>
                <div className="carousel-item p-6 item3 custom-carousel-item-height">
                  <h2 className="text-white text-xl">
                    ከዚህም በኋላ በቤ/ያን ዙሪያ ከፍተኛ ...
                  </h2>
                </div>
              </Carousel>
            </div>
            <div className="carousel-indicators">
              <div
                className={`indicator ${
                  activeSlide === 0 ? "active-indicator" : ""
                }`}
                onClick={() => handleIndicatorClick(0)}
              ></div>
              <div
                className={`indicator ${
                  activeSlide === 1 ? "active-indicator" : ""
                }`}
                onClick={() => handleIndicatorClick(1)}
              ></div>
              <div
                className={`indicator ${
                  activeSlide === 2 ? "active-indicator" : ""
                }`}
                onClick={() => handleIndicatorClick(2)}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-rows-3 gap-6">
                <div className="bg-white rounded-lg shadow custom-shadow p-4 fixed-height relative event-cont">
                  <div className="content">
                    <h2 className="text-xl text-black font-bold mb-2">
                      ቀጣይ ፕሮግራም
                    </h2>
                    {upcomingEvent ? (
                      <div className="relative">
                        <div className="absolute top-4 left-4">
                          <h6 className="text-xl text-black">
                            {upcomingEvent.reason}
                          </h6>
                          <h6 className="text-xl text-black">
                            የተያዘው: በ {upcomingEvent.booker}
                          </h6>
                          <h6 className="text-black">
                            ስልክ ቁጥር: {upcomingEvent.phone}
                          </h6>
                          <p className="text-black">
                            {new Date(upcomingEvent.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-black">ምንም አይነት ፕሮግራም የለም!</p>
                    )}
                  </div>
                  <Link href="/event" passHref>
                    <button className="bg-blue-500 text-black px-4 py-2 rounded-lg absolute bottom-4 right-4">
                      Show Calendar
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow custom-shadow p-4 fixed-height">
                    <h2 className="font-bold text-black mb-4">ቁሳቁሶች</h2>
                    <canvas
                      id="inventoryChart"
                      width="200"
                      height="200"
                    ></canvas>
                  </div>

                  <div className="bg-white rounded-lg shadow custom-shadow p-4 fixed-height">
                    <h2 className="font-bold text-black mb-4">የአስትዳደር መዋቅር</h2>
                    <div className="space-y-4">
                      {hierarchies &&
                        hierarchies
                          .filter(
                            (hierarchy) =>
                              hierarchy.isActive && hierarchy.role === "ጽ/ቤት"
                          )
                          .slice(0, 2)
                          .map((hierarchy, index) => (
                            <div
                              key={index}
                              className="p-2 bg-gray-100 rounded custom-shadow text-black"
                            >
                              <h6>{hierarchy.name}</h6>
                              <p>{hierarchy.position}</p>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow custom-shadow p-4 fixed-height2 mb-6">
                <h2 className="font-bold text-black mb-4">የደብዳቤ ልውውጦች</h2>
                <div className="space-y-4">
                  {letters &&
                    letters.slice(0, 2).map((letter, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {letter.typeOfLetter === "ወጪ" ? (
                          <i className="fas fa-paper-plane fa-3x text-black"></i>
                        ) : (
                          <i className="fas fa-envelope-open-text fa-3x text-blue-500"></i>
                        )}
                        <div>
                          <h3 className="font-bold">{letter.title}</h3>
                          <p>
                            Date: {new Date(letter.date).toLocaleDateString()}
                          </p>
                          <p>Type: {letter.typeOfLetter}</p>
                          <p>Destination: {letter.destination}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow custom-shadow p-4 fixed-height">
                <h2 className="font-bold text-black mb-4">ወጪ ገቢ</h2>
                <div className="space-y-4">
                  {expenses &&
                    expenses.slice(0, 7).map((expense, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {expense.type === "ወጪ" ? (
                          <i className="fas fa-minus-circle text-red-500 text-xl"></i>
                        ) : (
                          <i className="fas fa-plus-circle text-green-500 text-xl"></i>
                        )}
                        <div>
                          <h3>{expense.type}</h3>
                          <p>{new Date(expense.date).toLocaleDateString()}</p>
                          <p>መጠን: {expense.amount}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Protection>
  );
};

export default LandingPage;
