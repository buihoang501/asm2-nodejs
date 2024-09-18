import React from "react";
import SearchListIteam from "./SearchListIteam";

//React redux hooks
import { useSelector } from "react-redux";

const SearchList = () => {
  //get hotels after searching
  const { hotels, suitableRooms } = useSelector((state) => state.hotel);

  //Search data
  // const searchData = [
  //   {
  //     name: "Tower Street Apartments",
  //     distance: "500m",
  //     tag: "Free airport taxi",
  //     type: "Entire studio • 1 bathroom • 21m² 1 full bed",
  //     description: "Studio Apartment with Air conditioning",
  //     free_cancel: true,
  //     price: 112,
  //     rate: 8.9,
  //     rate_text: "Excellent",
  //     image_url: "./images/hotel_search_1.webp",
  //   },
  //   {
  //     name: "Comfort Suites Airport",
  //     distance: "200m",
  //     tag: "Free Breakfast",
  //     type: "Entire studio • 2 bathroom • 100m² 2 full bed",
  //     description: "Studio Apartment",
  //     free_cancel: true,
  //     price: 140,
  //     rate: 9.3,
  //     rate_text: "Exceptional",
  //     image_url: "./images/hotel_search_2.jpg",
  //   },
  //   {
  //     name: "Four Seasons Hotel",
  //     distance: "100m",
  //     tag: "Free Parking",
  //     type: "1 bathroom • 51m² 2 full bed",
  //     description: "Hotel in Lisbon",
  //     free_cancel: false,
  //     price: 99,
  //     rate: 8.8,
  //     rate_text: "Excellent",
  //     image_url: "./images/hotel_search_3.jpg",
  //   },
  // ];

  //styling for SearchList component
  const styles = {
    margin: "32px 0 32px 24px",
    flex: "1",
  };

  return (
    <div style={styles}>
      {/* Render SearchListItem Component */}
      <SearchListIteam
        //Pass search prop to SearchListItem component
        search={hotels}
        suitableRooms={suitableRooms}
      />
    </div>
  );
};

export default SearchList;
