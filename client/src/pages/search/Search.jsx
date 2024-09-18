/* Import Relevant Components */
import NavBar from "../../components/NavBar/NavBar";
import SearchPopup from "../../components/SearchPopup/SearchPopup";
import Footer from "../../components/Footer/Footer";
import SearchList from "../../components/SearchList/SearchList";

const Search = () => {
  //Styles for search page
  const styles = {
    margin: "0 auto",
    maxWidth: "1200px",
    display: "flex",
  };
  return (
    <div>
      {/*Render Navbar Component*/}
      <NavBar />
      <div style={styles}>
        {/* Render Search Popup Component */}
        <SearchPopup />
        {/* Render SearchList Component*/}
        <SearchList />
      </div>
      {/*Render Footer Component*/}
      <Footer />
    </div>
  );
};

export default Search;
