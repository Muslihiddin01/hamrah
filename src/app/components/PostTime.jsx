import React from "react";

const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date; // разница в миллисекундах

  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const PostTime = ({ createAt }) => {
  if (!createAt) return null;
  const date = new Date(Number(createAt) || createAt);

  return <span className="text-sm text-gray-500">{getTimeAgo(date)}</span>;
};

export default PostTime;
