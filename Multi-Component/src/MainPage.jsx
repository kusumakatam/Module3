import Navbar from "./Navbar"
import Content from "./Content"
import Footer from "./Footer"

function MainPage() {
  return (
    <div style={{
        minHeight: "100vh",
         minWidth: "230vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f6fa"
      }}>
      <Navbar />
      <Content />
      <Footer />
    </div>
  )
}

export default MainPage
