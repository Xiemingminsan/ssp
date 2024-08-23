"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CreateHierarchy from "../components/management_components/CreateHierarchy";
import Layout from "../components/layout";
import Protection from "../Protection";

const HierarchyTable = ({ isAdmin }) => {
  const [hierarchies, setHierarchies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchHierarchies = async () => {
      try {
        const response = await fetch("/api/hierarchy"); // Adjust the path as needed
        const data = await response.json();
        setHierarchies(data);
      } catch (error) {
        console.error("Error fetching hierarchies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchies();
  }, []);

  return (
    <Protection>
      <Layout>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={openModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Create Management
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-800 text-lg font-semibold">
                በስራ ላይ ያሉ አመራሮች
              </h2>
              <Link href="/hierarchy/oldManagement">
                <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  የቀድሞ አመራሮች
                </div>
              </Link>
            </div>
            {loading ? (
              <div className="text-center text-gray-600 py-6">Loading...</div>
            ) : hierarchies.length > 0 ? (
              <table className="w-full text-black text-left">
                <thead>
                  <tr>
                    <th className="text-sm font-semibold text-gray-800 uppercase tracking-wider py-3 px-6">
                      ምስል
                    </th>
                    <th className="text-sm font-semibold text-gray-800 uppercase tracking-wider py-3 px-6">
                      ስም
                    </th>
                    <th className="text-sm font-semibold text-gray-800 uppercase tracking-wider py-3 px-6">
                      ክፍል
                    </th>
                    <th className="text-sm font-semibold text-gray-800 uppercase tracking-wider py-3 px-6">
                      ሃላፊነት
                    </th>
                    <th className="text-sm font-semibold text-gray-800 uppercase tracking-wider py-3 px-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hierarchies.map(
                    (item) =>
                      item.isActive && (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.photo ? (
                              <img
                                src={`/Profile_Img/${item.photo}`}
                                alt="photo"
                                className="photo h-10 w-10 rounded-full"
                              />
                            ) : (
                              <span>No Picture</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Link href={`/hierarchy/edit/${item._id}`}>
                                <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                  <i className="fas fa-edit mr-1"></i> Edit
                                </div>
                              </Link>
                              <Link href={`/hierarchy/inactive/${item._id}`}>
                                <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                  <i className="fas fa-trash mr-1"></i> Inactive
                                </div>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-600 py-6">
                No active hierarchies found.
              </div>
            )}
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative mt-12 mx-auto">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <CreateHierarchy onClose={closeModal} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Protection>
  );
};

export default HierarchyTable;
