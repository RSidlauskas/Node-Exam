import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const AuctionItem = ({auctionItem}) => {

    let[time, setTime] = useState()
    const nav = useNavigate()

    let [active, setActive] = useState(true)


    const timeInterval = setInterval(calculateTime, 1000)
    function calculateTime() {

        const time = Math.floor(new Date(auctionItem.endTime).getTime())
        let difference = time - Date.now();

        if (difference < 0) {
            setActive(false)
        } else {
            setActive(true)
        }


        let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        difference -= daysDifference * 1000 * 60 * 60 * 24

        let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        difference -= hoursDifference * 1000 * 60 * 60

        let minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60

        let secondsDifference = Math.floor(difference / 1000);

        setTime(
            hoursDifference +' hours '+
            minutesDifference + ' minutes ' +
            secondsDifference + ' seconds '
        );

    }

    function goSingleItem(id){
       /* if(active === true) */{ nav("/singleAuction/"+id) }
    }


    return (
        <div onClick={() => goSingleItem(auctionItem._id)} className="d-flex gap-4 mb-2 secondaryBox auctionItem border">
            <div className="">
                <img src={auctionItem.image} alt="image" style={{height: "100%"}}/>
            </div>
            <div className="d-flex w-50 h-100 flex-column justify-content-around align-items-start p-1">
                <h5 className="text-start">{auctionItem.title}</h5>
                <h6>Price: <span className="link">{auctionItem.price} €</span></h6>
                <h6>{auctionItem.email}</h6>
            </div>
            { active ?
                <div className="d-flex flex-column justify-content-around p-2">
                    <h5>Time left:</h5>
                    <h5>{time && time}</h5>
                </div>
                :
                auctionItem.bids[auctionItem.bids.length-1] ?
                    <div className="d-flex flex-column justify-content-around p-2 me-2">
                        <h5>Auction won  by: <span className="link2">{auctionItem.bids[auctionItem.bids.length-1].email}</span></h5>
                    </div>
                    :
                    <div className="d-flex flex-column justify-content-around p-2 me-2">
                        <h5>Auction wasn't sold</h5>
                    </div>
            }
        </div>
    );

};

export default AuctionItem;