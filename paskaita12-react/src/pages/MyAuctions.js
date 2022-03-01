import React, {useContext, useEffect} from 'react';
import MainContext from "../context/MainContext";
import axios from "axios";
import AuctionItem from "../components/AuctionItem";

const MyAuctions = () => {

    let{myItems, setMyItems} = useContext(MainContext)

    useEffect(async () => {
        try{
            const res = await axios.get("http://localhost:4000/getMyAuctions", {withCredentials: true})
            setMyItems(res.data)
        } catch (e) {
            console.log(e)
        }
    },[])



    return (
        <div className="auctions primaryBox p-2 ms-5 w-80">
            {myItems && myItems.map((x, i) => {
                return <AuctionItem key={i} auctionItem={x}/>
            })}
        </div>
    );
};

export default MyAuctions;