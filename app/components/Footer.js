"use client";
import React from "react";
import  Link from "next/link";
import { useRouter } from "next/navigation";
import { BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import { FaPinterest } from "react-icons/fa";
import GoTop from "./GoTop";
import profileService from "../services/Home";
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
    const router = useRouter();
  const pathname =router.pathname
  const currentYear = new Date().getFullYear();

  const { data: siteSetting } = useQuery({
    queryKey: ["siteSetting"],
    queryFn: profileService.SiteSetting,
    select: (res) => res?.data || {},
  });

  const { data: pages } = useQuery({
    queryKey: ["getPages"],
    queryFn: profileService.GetPages,
    select: (res) => res?.data || [],
  });

  const socialLinks = [
    { icon: <BsInstagram />, link: siteSetting?.instagram_link },
    { icon: <BsFacebook />, link: siteSetting?.facebook_link },
    { icon: <FaPinterest />, link: siteSetting?.pinterest_link },
    { icon: <BsYoutube />, link: siteSetting?.youtube_link },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer_details">
          <Link href="/" className="navbar-brand m-0">
            <img src='/assets/images/logo.png' alt="logo" width={100} />
          </Link>

          <div className="footer_list">
            <ul>
              {pages?.map((page) => (
                <li
                  key={page?.slug}
                  className={`text-uppercase pb-2 pb-md-0 ${
                    pathname === page?.slug ? "active" : ""
                  }`}
                >
                  <Link href={page?.slug || '#'}>
                    <b>{page?.name}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer_social_list">
            <ul>
              {socialLinks.map(
                ({ icon, link }) =>
                  link && (
                    <li key={link}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {icon}
                      </a>
                    </li>
                  )
              )}
            </ul>
          </div>

          <hr />

          <div className="footer_copyright">
            <h2
              dangerouslySetInnerHTML={{
                __html: siteSetting?.frontend_copyright?.replace(
                  "{year}",
                  currentYear
                ),
              }}
            />
          </div>
        </div>
      </div>
      <GoTop />
    </footer>
  );
};

export default Footer;
