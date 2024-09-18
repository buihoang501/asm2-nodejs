// Import relevant components
import Navbar from "../../components/NavBar/NavBar";
import Subscribe from "../../components/Subscribe/Subscribe";
import Footer from "../../components/Footer/Footer";
//Import CSS module
import styles from "./Detail.module.css";
const Detail = () => {
  //Detail data
  const detail = {
    name: "Tower Street Apartments",
    address: "Elton St 125 New york",
    distance: "Excellent location - 500m from center",
    price: "Book a stay over $114 at this property and get a free airport taxi",
    photos: [
      "./images/hotel_detail_1.jpg",
      "./images/hotel_detail_2.jpg",
      "./images/hotel_detail_3.jpg",
      "./images/hotel_detail_4.jpg",
      "./images/hotel_detail_5.jpg",
      "./images/hotel_detail_6.jpg",
    ],
    title: "Stay in the heart of City",
    description:
      "Located a 5-minute walk from St. Florian's Gate in Krakow, Tower Street Apartments has accommodations with air conditioning and free WiFi.The units come with hardwood floors and feature a fully equipped kitchenette with a microwave, a flat - screen TV, and a private bathroom with shower and a hairdryer.A fridge is also offered, as well as an electric tea pot and a coffee machine.Popular points of interest near the apartment include Cloth Hall, Main Market Square and Town Hall Tower.The nearest airport is John Paul II International Kraków - Balice, 16.1 km from Tower Street Apartments, and the property offers a paid airport shuttle service.",
    nine_night_price: 955,
  };

  return (
    <div>
      {/*Render Navbar Component*/}
      <Navbar />
      {/* Detail Page Content */}
      <div className={styles["detail"]}>
        <div className={styles["container"]}>
          <div>
            <h2>{detail.name}</h2>
            <button>Reserve or Book Now!</button>
          </div>

          <p>
            <i className="fa-solid fa-location-dot"></i>
            {detail.address}
          </p>
          <p>{detail.distance}</p>
          <p>{detail.price}</p>
          <div className={styles["img-container"]}>
            {/*Map through photos array*/}
            {detail.photos.map((photo) => (
              <img key={photo} src={photo} alt="Couldn't be loaded image" />
            ))}
          </div>
          <div className={styles["desc"]}>
            <div>
              <h2>{detail.title}</h2>
              <p>{detail.description}</p>
            </div>
            <div>
              <h4>Perfect for a 9-night stay!</h4>
              <p>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </p>
              <h3>
                ${detail.nine_night_price} <span>(9 nights)</span>
              </h3>
              <button>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
      </div>
      {/*Render Subscribe Component*/}
      <Subscribe />
      {/*Render Footer Component */}
      <Footer />
    </div>
  );
};

export default Detail;
