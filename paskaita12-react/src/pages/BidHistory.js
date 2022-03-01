import React, {useEffect, useState} from 'react';
import axios from "axios";

const BidHistory = () => {

    const [bidHistory, setBidHistory] = useState([])

    useEffect(async () => {
        const res = await axios.get("http://localhost:4000/getUserBids", {withCredentials:true})
        console.log(res.data.bidHistory)
        setBidHistory(res.data.bidHistory)
    }, [])


    return (
        <div className="primaryBox d-flex flex-column justify-content-center align-content-center w-80 mt-5 p-3">
            <h1>Your Bids Log</h1>
            <div className="secondaryBox min-400 d-flex flex-column-reverse justify-content-end box w-100 border p-2">
                {bidHistory &&
                    bidHistory.map((x, i) => {
                        return <div key={i} className="d-flex gap-2">
                            <p>{new Date(x.time).toLocaleString()}</p>
                            <p>{x.title} bid:</p>
                            <p className="link">{x.bidValue}€</p>
                        </div>
                    })
                }
            </div>
        </div>

    );
};

export default BidHistory;