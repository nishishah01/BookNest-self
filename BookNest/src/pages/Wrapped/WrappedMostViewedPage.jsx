import React from "react";

const WrappedMostViewedPage = ({ data }) => {
  const colors = ["#060303", "#060303", "#060303", "#060303", "#DAD964"];
  const bgColors = ["#F193C6", "#26C861", "#FF914C", "#E5E64D", "#181712"];

  return (
    <div className="w-full font-black flex flex-col bg-cover bg-center" style={{height: "calc(100vh - 210px)"}}>
      <div className="w-full h-full p-6 bg-gray-200 bg-opacity-50 flex flex-col justify-center" style={{gap: "2rem"}}>
        <h1 className="text-3xl font-bold mb-4 text-black text-center" style={{textAlign: "center"}}>
          Most Viewed {data.type}
        </h1>
        <div className="flex justify-center" style={{gap: "2rem"}}>
          <div className="flex flex-col items-start" style={{gap: "2rem"}}>
            <img
              src={data.images[0]}
              className="h-[200px]"
            />
            <div className="flex flex-col w-full">
              {data.names.map((name, index) => (
                <div
                  key={index}
                  className="py-2 px-4 font-bold text-left w-full"
                  style={{
                    backgroundColor: bgColors[index % bgColors.length],
                    color: colors[index % colors.length],
                  }}
                >
                  {index + 1}. {name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            {data.images.map((image, index) => (
              <img
                key={index}
                src={image}
                className="h-20"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrappedMostViewedPage;
