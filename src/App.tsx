import { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import InfiniteScroll from "./InfiniteScrollbar";

function App() {
  useEffect(() => {
    console.log(document.getElementsByTagName("button"));
  }, []);
  return (
    <div className="App">
      <Header />
      <main className="flex justify-center">
        <InfiniteScroll />
        <button className="bg-red-400">just a test button</button>
      </main>
    </div>
  );
}

export default App;
