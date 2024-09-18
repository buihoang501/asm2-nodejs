import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import List from "../../components/List/List";
import NavBar from "../../components/NavBar/NavBar";
import Subscribe from "../../components/Subscribe/Subscribe";

const Home = () => {
  return (
    <div>
      {/*Render NavBar Component */}
      <NavBar />
      {/*Render Header Component */}
      <Header />
      {/*Render List Component */}
      <List />
      {/*Render Register Component */}
      <Subscribe />
      {/*Render Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;
