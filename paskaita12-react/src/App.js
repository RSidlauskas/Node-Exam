import './App.css';
import MainContext from "./context/MainContext";
import Register from "./pages/Register";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useState} from "react";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import Auctions from "./pages/Auctions";
import CreateAuction from "./pages/CreateAuction";
import SingleAuction from "./pages/SingleAuction";
import MyAuctions from "./pages/MyAuctions";
import BidHistory from "./pages/BidHistory";


function App() {

    let [user, setUser] = useState()
    let [items, setItems] = useState()
    let [myItems, setMyItems] = useState()


    return (
        <div className="App">
            <BrowserRouter>
                <MainContext.Provider value={{
                    user, setUser,
                    items, setItems,
                    myItems, setMyItems}}>
                    <TopBar/>
                    <div className="d-flex flex-column align-items-center body">
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/createAuction" element={<CreateAuction/>}/>
                            <Route path="/myAuctions" element={<MyAuctions/>}/>
                            <Route path="/bidHistory" element={<BidHistory/>}/>
                            <Route path="/singleAuction/:id" element={<SingleAuction/>}/>
                            <Route path="/" element={<Auctions/>}/>
                        </Routes>
                    </div>
                </MainContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
