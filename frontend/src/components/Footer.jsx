import React from "react";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 p-4 text-center">
      <p>&copy; 2024 CarbonEmission. All rights reserved.</p>
      <div className="mt-2">
        <a href="#" className="text-violet-500 hover:text-violet-400 mr-4">
          Privacy Policy
        </a>
        <a href="#" className="text-violet-500 hover:text-violet-400">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
