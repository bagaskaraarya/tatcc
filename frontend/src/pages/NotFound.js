const React = require("react");

function NotFound() {
  return React.createElement("div", { className: "text-center mt-20 text-gray-500" },
    React.createElement("h2", { className: "text-xl font-semibold" }, "404 - Halaman tidak ditemukan")
  );
}

module.exports = NotFound;
