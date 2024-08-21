"use client"; // Use this to allow client-side hooks and scripts in Next.js 13+

import { useEffect } from "react";
import Layout from "../components/layout";

export default function Home() {
  useEffect(() => {
    fetch("/api/hierarchy")
      .then((response) => response.json())
      .then((data) => populateHierarchy(data));
  }, []);

  const populateHierarchy = (data) => {
    const departmentDivs = document.querySelectorAll(".card");

    data.forEach((person) => {
      if (person.isActive) {
        // Check if the person is active
        departmentDivs.forEach((departmentDiv) => {
          const roleTitle = departmentDiv.querySelector("h2").innerText.trim();

          if (person.role === roleTitle) {
            if (person.description === "ሰብሳቢ") {
              departmentDiv.querySelector(".name").innerText = person.name;
              departmentDiv.querySelector(".description").innerText =
                person.description;
              departmentDiv.querySelector(".phone").innerText = person.phone;
            } else {
              const subordinatesContainer =
                departmentDiv.querySelector(".subordinates");
              let subCard;

              if (person.description === "ም/ሰብሳቢ") {
                subCard =
                  subordinatesContainer.querySelector(".vice-ceo-card") ||
                  document.createElement("div");
                subCard.classList.add("card", "sub-card", "vice-ceo-card");
                subCard.innerHTML = `
                  <h4 class="font-semibold text-black">${person.name}</h4>
                  <p class="text-black">${person.description}</p>
                  <p class="text-black">${person.phone}</p>
                `;
                if (!subordinatesContainer.querySelector(".vice-ceo-card")) {
                  subordinatesContainer.insertBefore(
                    subCard,
                    subordinatesContainer.firstChild
                  );
                }
              } else if (person.description === "ፀሃፊ") {
                subCard =
                  subordinatesContainer.querySelector(".secretary-card") ||
                  document.createElement("div");
                subCard.classList.add("card", "sub-card", "secretary-card");
                subCard.innerHTML = `
                  <h4 class="font-semibold text-black">${person.name}</h4>
                  <p class="text-black">${person.description}</p>
                  <p class="text-black">${person.phone}</p>
                `;
                if (!subordinatesContainer.querySelector(".secretary-card")) {
                  if (subordinatesContainer.childNodes.length >= 1) {
                    subordinatesContainer.insertBefore(
                      subCard,
                      subordinatesContainer.childNodes[1]
                    );
                  } else {
                    subordinatesContainer.appendChild(subCard);
                  }
                }
              } else {
                subCard = document.createElement("div");
                subCard.classList.add("card", "sub-card");
                subCard.innerHTML = `
                  <h4 class="font-semibold text-black">${person.name}</h4>
                  <p class="text-black">${person.description}</p>
                  <p class="text-black">${person.phone}</p>
                `;
                subordinatesContainer.appendChild(subCard);
              }
            }
          }
        });
      }
    });
  };

  const toggleSubordinates = (element) => {
    const subordinates = element.querySelector(".subordinates");
    const isDisplayed = subordinates.style.display === "flex";
    document
      .querySelectorAll(".subordinates")
      .forEach((sub) => (sub.style.display = "none"));
    document
      .querySelectorAll(".card")
      .forEach((card) => card.classList.remove("selected"));
    if (!isDisplayed) {
      subordinates.style.display = "flex";
      element.classList.add("selected");
    }
  };

  return (
    <Layout>
      <div className="bg-sky-50 font-sans leading-normal tracking-normal">
        <div className="container mx-auto p-10">
          <div className="level">
            <div
              className="card text-black"
              onClick={() => toggleSubordinates(this)}
            >
              <h2 className="text-lg font-semibold text-black">ጽ/ቤት</h2>
              <p className="name"></p>
              <p className="description"></p>
              <p className="phone"></p>
              <div className="subordinates"></div>
              <div className="connector"></div>
            </div>
          </div>

          <div className="level" id="departments">
            {[
              "መዝሙር ክፍል",
              "ትምህርት ክፍል",
              "ህፃናት ክፍል",
              "ግንኙነት",
              "ኪነ-ጥበብ",
              "ሂሳብ ክፍል",
              "ንብረት ክፍል",
              "ልማት እና በጎአድራጎት",
            ].map((dept, idx) => (
              <div
                className="card text-black"
                key={idx}
                onClick={() => toggleSubordinates(this)}
              >
                <h2 className="text-lg font-semibold text-black">{dept}</h2>
                <p className="name"></p>
                <p className="description"></p>
                <p className="phone"></p>
                <div className="subordinates"></div>
                <div className="connector"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 2rem;
        }

        .level {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 2rem;
        }

        .level:before {
          content: "";
          position: absolute;
          top: -1rem;
          width: 100%;
          height: 1px;
          background-color: #ccc;
        }

        .card {
          background-color: #fff;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 0 1rem;
          text-align: center;
          position: relative;
          cursor: pointer;
          width: 150px;
          transition: background-color 0.3s ease;
        }

        .card:hover {
          background-color: #f0f4f8;
        }

        .card.selected {
          background-color: #cce4ff;
        }

        .card:before,
        .card:after {
          content: "";
          position: absolute;
          top: -1rem;
          width: 1px;
          height: 1rem;
          background-color: #ccc;
        }

        .card:before {
          left: 50%;
        }

        .card:after {
          right: 50%;
        }

        .card:first-child:before {
          display: none;
        }

        .card:last-child:after {
          display: none;
        }

        .subordinates {
          display: none;
          flex-wrap: wrap;
          justify-content: center;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 1rem;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          z-index: 10;
          width: 380px;
        }

        .subordinates.is-visible {
          display: flex;
        }

        .sub-card {
          width: 45%;
          margin: 0.5rem;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          background-color: #f9f9f9;
          text-align: center;
        }

        .connector {
          position: absolute;
          top: -1rem;
          left: 50%;
          width: 1px;
          height: 1rem;
          background-color: #ccc;
        }
      `}</style>
    </Layout>
  );
}
