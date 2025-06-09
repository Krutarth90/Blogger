"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"



// You should get this from your auth system
const authToken = localStorage.getItem("Authorization");

interface BlogData {
  title: string
  content: string
  tags: string[]
}

export default function CreateBlog() {
  const [loggedInAuthor, setAuthor] = useState('');
  useEffect(()=>{
    axios.get('https://backend.krutarthpipaliya90.workers.dev/api/v1/user', {
            headers : {
                Authorization : localStorage.getItem('Authorization')
            }
        })
    .then(({data})=>{
      setAuthor(data.name);
    })
  }, []);
  
  const [blogData, setBlogData] = useState<BlogData>({
    title: "",
    content: "",
    tags: [],
  })

  const [newTag, setNewTag] = useState("")
  const [activeTab, setActiveTab] = useState("write")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setBlogData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setBlogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const saveDraft = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        "https://backend.krutarthpipaliya90.workers.dev/api/v1/blog", // Replace with your draft API endpoint
        {
          title: blogData.title,
          content: blogData.content,
          tags: blogData.tags,
          published : false
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        },
      )

      alert("Draft saved successfully!")
      console.log("Draft saved:", response.data)
    } catch (error) {
      console.error("Error saving draft:", error)
      alert("Failed to save draft. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const publishBlog = async () => {
    if (!blogData.title.trim() || !blogData.content.trim()) {
      alert("Please fill in title and content before publishing")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        "https://backend.krutarthpipaliya90.workers.dev/api/v1/blog", // Replace with your actual API endpoint
        {
          title: blogData.title,
          content: blogData.content,
          tags: blogData.tags,
          published : true
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        },
      )

      alert("Blog published successfully!")
      console.log("Blog published:", response.data)

      // Reset form after successful publish
      setBlogData({
        title: "",
        content: "",
        tags: [],
      })
    } catch (error) {
      console.error("Error publishing blog:", error)
      alert("Failed to publish blog. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const PreviewContent = () => (
    <div className="prose prose-lg prose-gray max-w-none">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{blogData.title || "Untitled Blog Post"}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏱️</span>
          <span>{estimateReadingTime(blogData.content)} min read</span>
        </div>
      </div>

      {loggedInAuthor && (
        <div className="mb-6">
          <p className="font-semibold text-gray-900">{loggedInAuthor}</p>
        </div>
      )}

      {blogData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blogData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {blogData.content || "Start writing your blog content..."}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/BarLogo.png" alt="Blogger" className="h-8 w-auto" />
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Create New Post</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Write Your Story</h2>
          <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <span>Writing as:</span>
            <span className="font-medium text-orange-600">{loggedInAuthor}</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "write"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>✏️</span>
                Write
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "preview"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>👁️</span>
                Preview
              </button>
            </nav>
          </div>

          {/* Write Tab Content */}
          {activeTab === "write" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Blog Content</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          id="title"
                          type="text"
                          placeholder="Enter your blog title..."
                          value={blogData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          className="w-full px-3 py-2 text-lg font-semibold border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors duration-200 bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                          Content *
                        </label>
                        <textarea
                          id="content"
                          placeholder="Start writing your blog content here..."
                          value={blogData.content}
                          onChange={(e) => handleInputChange("content", e.target.value)}
                          rows={20}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors duration-200 resize-none bg-white text-gray-900"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {blogData.content.trim().split(/\s+/).length} words • {estimateReadingTime(blogData.content)}{" "}
                          min read
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tags */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-orange-500">#</span>
                        Tags
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors duration-200 bg-white text-gray-900"
                        />
                        <button
                          onClick={addTag}
                          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Add
                        </button>
                      </div>
                      {blogData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blogData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200 cursor-pointer"
                            >
                              {tag}
                              <span
                                className="cursor-pointer hover:text-red-500 transition-colors duration-200 font-bold"
                                onClick={() => removeTag(tag)}
                              >
                                ×
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">Last saved: Never</div>
                <div className="flex gap-3">
                  <button
                    onClick={saveDraft}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span>💾</span>
                    {isLoading ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    onClick={publishBlog}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span>🚀</span>
                    {isLoading ? "Publishing..." : "Publish Blog"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab Content */}
          {activeTab === "preview" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <PreviewContent />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
