"use client"

import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { contentAtom, emailAtom, loggedInSelector, pathAtom, tagsAtom, titleAtom, usernameAtom } from "../store/atoms"
import axios from "axios"

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const loggedInUser = useRecoilValue(loggedInSelector)
  const setUsername = useSetRecoilState(usernameAtom)
  const setEmail = useSetRecoilState(emailAtom)
  const setPath = useSetRecoilState(pathAtom);
  const setTitle = useSetRecoilState(titleAtom);
  const setContent = useSetRecoilState(contentAtom);
  const setTags = useSetRecoilState(tagsAtom);
    useEffect(() => {
    const token = localStorage.getItem("Authorization")
    if (token && loggedInUser.email === "") {
      async function fetchUser() {
        try {
          const res = await axios.get("https://backend.krutarthpipaliya90.workers.dev/api/v1/user", {
            headers: { Authorization: token },
          })
          setUsername(res.data.name)
          setEmail(res.data.email)
        } catch (err) {
          console.error("Failed to fetch user", err)
        }
      }
      fetchUser()
    }
  }, [])
  

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50" style={{ borderColor: "#F3F4F6" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a onClick={()=>{
              setPath('blogs');
              setIsProfileOpen(false);
            }}
            className="flex-shrink-0">
            <img
              src="/BarLogo.png"
              alt="Blogger"
              className="h-12 w-auto hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </a>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {loggedInUser.email ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:scale-105 transition-all duration-200"
                  style={{ color: "#502D55" }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLElement).style.backgroundColor = "#F3F4F6"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLElement).style.backgroundColor = "transparent"
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-base font-semibold text-white"
                    style={{ backgroundColor: "#7C3AED" }}
                  >
                    {getInitials(loggedInUser.name)}
                  </div>
                  <span className="hidden sm:block text-base font-medium">{loggedInUser.name}</span>
                  <span className="text-sm">▼</span>
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border py-2 z-50"
                    style={{ borderColor: "#F3F4F6" }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                      <p className="text-base font-medium" style={{ color: "#502D55" }}>
                        {loggedInUser.name}
                      </p>
                      <p className="text-sm" style={{ color: "#8E4B71" }}>
                        {loggedInUser.email}
                      </p>
                    </div>

                    
                    <a
                      onClick={()=>{
                        setPath('profile');
                        setIsProfileOpen(false);
                      }}
                      className="block px-4 py-3 text-base hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#8E4B71" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#7C3AED")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E4B71")}
                    >
                      👤 Profile
                    </a>

                    <a
                      onClick={()=>{
                        setTitle('');
                        setContent('');
                        setTags([]);
                        setPath('create');
                        setIsProfileOpen(false);
                      }}
                      className="block px-4 py-3 text-base hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#8E4B71" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#7C3AED")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E4B71")}
                    >
                      ✍️ Write a Blog
                    </a>

                    <a
                      href="/settings"
                      className="block px-4 py-3 text-base hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#8E4B71" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#7C3AED")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E4B71")}
                    >
                      ⚙️ Settings
                    </a>

                    <a
                      href="/help"
                      className="block px-4 py-3 text-base hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#8E4B71" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#7C3AED")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E4B71")}
                    >
                      ❓ Help
                    </a>

                    <hr className="my-2" style={{ borderColor: "#F3F4F6" }} />

                    <button
                      className="block w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors duration-200"
                      style={{ color: "#8E4B71" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#DC2626")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E4B71")}
                      onClick={() => {
                        localStorage.removeItem("Authorization")
                        setUsername("")
                        setEmail("")
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/signin"
                  className="text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition"
                  style={{ color: "#8E4B71" }}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="text-sm font-medium px-4 py-2 bg-[#8E4B71] text-white rounded hover:bg-[#7C3AED] transition"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
