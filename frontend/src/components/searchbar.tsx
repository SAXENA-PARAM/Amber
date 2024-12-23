import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  // Function to handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Check for space to detect the end of a word
    if (value.trim().length > 0) {
      sendWordsToApi(value.trim()); // Send text as the user types
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
    }
  };

  // Function to send API request
  const sendWordsToApi = async (query: string) => {
    try {
      const response = await axios.post("/api/suggest", { query }); // Use relative path for Next.js API
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Function to handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim().length > 0) {
      router.push(`/course/${searchTerm.trim()}`);
    }
  };

  return (
    <div className="relative hidden md:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 text-black">
      <Search className="text-gray-400" size={20} />
      <input
        type="search"
        placeholder="Search for courses"
        className="bg-transparent border-none focus:outline-none w-full"
        value={searchTerm}
        onChange={handleInput}
        onKeyDown={handleKeyDown} // Listen for key presses
      />
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
              onClick={() => setSearchTerm(suggestion)} // Set searchTerm on suggestion click
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
