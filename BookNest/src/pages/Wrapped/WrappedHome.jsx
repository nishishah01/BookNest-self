import React from "react";

const WrappedHome = ({ data }) => {
  return (
    <div className="relative w-full rounded-2xl" style={{ height: "calc(100vh - 210px)" }}>
      <div
        className="flex flex-col justify-center h-full text-left"
        style={{padding: "0 2rem" }}
      >
        <h1
          className="font-bold mb-10 text-pink-500 text-[4.5rem]"
          style={{ fontFamily: "Raleway, consolas" }}
        >
          {data.name}
        </h1>
        <h2
          className="text-5xl font-bold text-rose-500"
          style={{ fontFamily: "Raleway, consolas" }}
        >
          Your Booknest
        </h2>
        <h2
          className="text-5xl font-bold text-rose-500"
          style={{ fontFamily: "Raleway, consolas" }}
        >
          Wrapped is here!
        </h2>
        <button
          className="font-[500] rounded-full bg-rose-300 text-gray-700 cursor-pointer font-bold w-1/2"
          style={{
            marginTop: "3rem",
            padding: "10px 20px",
            fontFamily: "Segoe UI",
          }}
        >
          {"VIEW MORE ➡️"}
        </button>
      </div>
    </div>
  );
};

export default WrappedHome;
