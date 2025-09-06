"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const Select = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  const options = [
    { value: "", label: "Choose option", disabled: true },
    { value: "add", label: "Add apartment" },
    { value: "friends", label: "Friends" },
    { value: "favorites", label: "Favorites" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);

    if (value === "add") {
      router.push("/addApartment");
    } else if (value === "friends") {
      router.push("/viewFriends");
    } else if (value === "favorites") {
      router.push("/viewFavorites");
    }
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label ||
    "Choose option";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select trigger */}
      <div
        className="w-40 px-4 py-2 rounded-lg border border-gray-300 bg-white text-slate-700 font-medium 
                   transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-between
                   hover:border-emerald-400 hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? "text-slate-800" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg 
                       shadow-lg z-10 overflow-hidden"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2.5 cursor-pointer transition-colors duration-150
                         ${
                           option.disabled
                             ? "text-gray-400 cursor-not-allowed"
                             : option.value === selectedValue
                             ? "bg-emerald-50 text-emerald-700"
                             : "hover:bg-gray-50 text-slate-700"
                         }`}
              onClick={() => !option.disabled && handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Add CSS animation to global styles or use inline style */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Select;