"use client";

import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
// Use 'next/link' instead of 'react-router-dom/Link'
import Link from "next/link";
// Removed: import { Helmet } from "react-helmet-async";
// Assuming profileService, ProfileSystem, and Loader paths are correct
import profileService from "../services/Auth";
import { ProfileSystem } from "../context/ProfileContext";
import Loader from "../components/common/Loader";

const DealerProfile = () => {
  // Assuming this context is a client-side context (defined with "use client")
  const { dispatch: image, state: imagestate } = useContext(ProfileSystem);

  const [DealerEmail, setDealerEmail] = useState(null);
  const [DealerToken, setDealerToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Client-side fetch for localStorage data
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDealerEmail(localStorage.getItem("email"));
      setDealerToken(localStorage.getItem("token"));
    }
  }, []);

  // 2. Fetch profile data once email and token are available
  useEffect(() => {
    if (DealerEmail && DealerToken) {
      getDealerProfileData(DealerEmail, DealerToken);
    }
  }, [DealerEmail, DealerToken, imagestate?.image]); // Depend on imagestate.image to refetch after image upload

  const getDealerProfileData = (email, token) => {
    setIsLoading(true); // Set loading to true before fetch
    profileService
      .profile({ email: email, token: token })
      .then((res) => {
        if (res.data) {
          setProfileData(res.data);
          // localStorage access is safe inside useEffect/then block after client check
          localStorage.setItem("user_type", res.data.user_type);
        } else {
            setProfileData(null); // Clear data if fetch failed/data is empty
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dealer profile:", err);
        setIsLoading(false);
        setProfileData(null);
        toast.error("Failed to load profile data.");
      });
  };

  const handleImageChange = (e) => {
    const fileInput = document.getElementById("upload");
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!file) return;

    if (file.size > maxSize) {
      toast.error("File size exceeds the 5 MB limit.");
      if (fileInput) fileInput.value = "";
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a PNG, JPEG, JPG, or GIF file."
      );
      if (fileInput) fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    // Ensure form is retrieved safely, and handle case where it might be null
    const formElement = document.getElementById("user-profile-form");
    if (!formElement) {
        toast.error("Form not found for submission.");
        return;
    }
    const myFormData = new FormData(formElement);

    reader.onloadend = () => {
      setIsLoading(true);
      profileService
        .UserProfileImage(myFormData)
        .then((res) => {
          if (res.status === true) {
            // Refetch profile data to update the image source
            // This refetch will be triggered by the imagestate dependency in the main useEffect
            image({
              type: "SET_IMAGE",
              payload: { image: !imagestate?.image },
            });
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
        .catch((error) => {
          console.error("Error uploading profile image:", error);
          toast.error("Failed to upload image.");
        })
        .finally(() => {
          // If the profile fetch succeeds (via useEffect refetch), isLoading will be set to false there.
          // If you want immediate UI feedback even if the refetch is still pending, 
          // you might need a separate, specific loading state for the upload process.
        });
    };

    // Since validation passed, read the file (this triggers onloadend)
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Next.js equivalent of <Helmet> for title, though <title> is safe in a client component */}
      <title>Impel Store - Dealer Profile</title>
      <section className="dealer_profile_data">
        <div className="container py-5">
          <div className="row">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <div className="col-md-6 mb-3">
                  <div className="card" style={{ height: "100%" }}>
                    <div className="card-header">
                      <strong>Owner Information</strong>
                    </div>
                    <div className="card-body">
                      <table className="table">
                        <tbody>
                          <tr>
                            <th scope="col">Full Name : </th>
                            <td>{profileData?.name || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">Email : </th>
                            <td>{profileData?.email || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">Phone No. : </th>
                            <td>{profileData?.phone || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">Whatsapp No. : </th>
                            <td>{profileData?.phone || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-header">
                      <strong>Company Information</strong>
                    </div>
                    <div className="card-body">
                      <table className="table">
                        <tbody>
                          <tr>
                            <th scope="col">Company Name : </th>
                            <td>{profileData?.comapany_name || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">GST No. : </th>
                            <td>{profileData?.gst_no || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">Address : </th>
                            <td>{profileData?.address || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">Pincode : </th>
                            <td>{profileData?.pincode || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">State : </th>
                            <td>{profileData?.state?.name || "N/A"}</td>
                          </tr>
                          <tr>
                            <th scope="col">City : </th>
                            <td>{profileData?.city?.name || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <div className="card">
                    <div className="card-header">
                      <strong>Logo & Documents</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-3 text-center">
                          <h5>Profile Picture</h5>
                          <div>
                            {profileData?.profile && (
                              <>
                                <div className="imagesss">
                                  <div className="profile-image">
                                    <form
                                      id="user-profile-form"
                                      method="POST"
                                      encType="multipart/form-data"
                                    >
                                      <input
                                        type="hidden"
                                        name="user_id"
                                        value={profileData?.id || ""}
                                      />
                                      <input
                                        id="upload"
                                        name="user_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                      />

                                      <label
                                        htmlFor="upload"
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      >
                                        <img
                                          src={profileData?.profile}
                                          alt="Profile Picture"
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            borderRadius: "50%",
                                            border: "1px solid #ccc",
                                            padding: "2px",
                                          }}
                                        />
                                      </label>
                                    </form>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 mb-3 text-center">
                          <h5>Company Logo</h5>
                          <div>
                            <img
                              src={profileData?.company_logo}
                              alt="Company Logo"
                              style={{
                                width: "200px",
                                height: "200px",
                                borderRadius: "50%",
                                border: "1px solid #ccc",
                                padding: "2px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 mb-3 ">
                          <h5 className="text-center">Documents</h5>
                          <div>
                            {/* Use next/link and set target="_blank" for external link */}
                            {profileData?.documents?.map((file, index) => (
                              <Link
                                key={index}
                                href={file?.document || "#"}
                                className="light-up-button m-2"
                                style={{ border: "1px solid #ccc" }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Document {index + 1}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DealerProfile;