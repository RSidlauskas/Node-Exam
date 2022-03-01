import React, {useContext, useEffect} from 'react';
import axios from "axios";
import MainContext from "../context/MainContext";
import AuctionItem from "../components/AuctionItem";

const Auctions = () => {

    let{items, setItems} = useContext(MainContext)

    useEffect(async () => {
        try{
            const res = await axios.get("http://localhost:4000/getItems")
            setItems(res.data)
            console.log(res.data)
        } catch (e) {
            console.log(e)
        }
    },[])


    return (
        <div className="auctions primaryBox p-2 ms-5 w-80">
            {items && items.map((x, i) => {
                return <AuctionItem key={i} auctionItem={x}/>
            })}
        </div>
    );




};

export default Auctions;