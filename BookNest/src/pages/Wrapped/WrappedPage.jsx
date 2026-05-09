import React, { useState } from "react";
import IntroNavbar_1 from "../../components/IntroNavbar_1";
import WrappedHome from "./WrappedHome";
import WrappedMostViewedPage from "./WrappedMostViewedPage";
import WrappedTopPage from "./WrappedTopPage";
import WrappedTopPages from "./WrappedTopPages";
import book_cover from "../../WrappedAssets/book1_cover.png";
import authorImg from "../../WrappedAssets/author-img.png";
import bg1 from "../../WrappedAssets/bg1.jpg";

const WrappedPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pageOrder = [
    "WrappedHome",
    "WrappedMostViewedAuthor",
    "WrappedMostViewedBook",
    "WrappedTopAuthor",
    "WrappedTopBook",
    "WrappedTopAuthors",
    "WrappedTopBooks",
  ];

  const pages = {
    WrappedHome: WrappedHome,
    WrappedMostViewedAuthor: WrappedMostViewedPage,
    WrappedMostViewedBook: WrappedMostViewedPage,
    WrappedTopAuthor: WrappedTopPage,
    WrappedTopBook: WrappedTopPage,
    WrappedTopAuthors: WrappedTopPages,
    WrappedTopBooks: WrappedTopPages,
  };

  const data = {
    WrappedHome: {
      name: "Sudev",
      bgImg: bg1,
    },
    WrappedMostViewedAuthor: {
      type: "Author",
      bgImg: bg1,
      names: [
        "Leah Thompson",
        "Sachin Tendulkar",
        "Rohit Sharma",
        "Virat Kohli",
        "MS Dhoni",
      ],
      images: [authorImg, authorImg, authorImg, authorImg, authorImg],
    },
    WrappedMostViewedBook: {
      type: "Book",
      bgImg: bg1,
      names: [
        "Geronimo Stilton",
        "Bake With Shivesh",
        "It Ends With Us",
        "Nana Nani Stories",
        "Harry Potter",
      ],
      images: [book_cover, book_cover, book_cover, book_cover, book_cover],
    },
    WrappedTopAuthor: {
      type: "Author",
      name: "Leah Thompson",
      image: authorImg,
      bgImg: bg1,
    },
    WrappedTopBook: {
      type: "Book",
      name: "Geronimo Stilton",
      image: book_cover,
      bgImg: bg1,
    },
    WrappedTopAuthors: {
      type: "Authors",
      bgImg: bg1,
      authors: Array(5).fill({ name: "Leah Thompson", image: authorImg }),
    },
    WrappedTopBooks: {
      type: "Books",
      bgImg: bg1,
      books: Array(5).fill({ name: "Geronimo Stilton", image: book_cover }),
    },
  };

  return (
    <div>
      <IntroNavbar_1 />
      <div>
        {/* Slider Container */}
        <div className="flex bg-[url('../../WrappedAssets/bg1.jpg')] relative top-[95px]">
          {pageOrder.map((key, index) => {
            const Component = pages[key];
            const pageData = data[key];
            return (
              <div
                key={index}
                className="w-[40vw] shrink-0 bg-gray-200 "
              >
                <Component data={pageData} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WrappedPage;
