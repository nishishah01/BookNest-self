import React from "react";

const WrappedTopAuthor = ({ data }) => {
  return (
    <div
    className="flex flex-col items-center justify-center text-center"
      style={{
        height: "calc(100vh - 210px)",
      }}
    >
      <h1 className="text-black font-semibold text-[3rem]" style={{marginBottom: "10px"}}>
        Top {data.type}
      </h1>
      <img
        src={data.image}
        style={{
          height: "300px",
          width: "auto",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />
      {data.type === "Author" && (
        <h2 className="text-3xl text-black font-semibold">
          {data.name}
        </h2>
      )}
    </div>
  );
};

export default WrappedTopAuthor;
