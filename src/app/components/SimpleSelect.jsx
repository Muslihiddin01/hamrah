"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SimpleSelect = ({
  value,
  onChange,
  placeholder = "Select option",
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const findLabelByValue = () => {
    if (!children) return placeholder;

    const childrenArray = React.Children.toArray(children);
    const selectedOption = childrenArray.find(
      (child) => child.props.value === value
    );

    return selectedOption ? selectedOption.props.children : placeholder;
  };

  const handleSelect = (newValue) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-slate-700 font-medium 
                   transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-between
                   hover:border-emerald-400 hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-slate-800" : "text-gray-400"}>
          {findLabelByValue()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {React.Children.map(children, (child) => (
            <div
              className={`px-4 py-2.5 cursor-pointer transition-colors duration-150
                         ${
                           child.props.value === value
                             ? "bg-emerald-50 text-emerald-700"
                             : "hover:bg-gray-50 text-slate-700"
                         }`}
              onClick={() => handleSelect(child.props.value)}
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Option component для SimpleSelect
const Option = ({ value, children }) => {
  return <div data-value={value}>{children}</div>;
};

export { SimpleSelect, Option };
