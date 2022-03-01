import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import MainContext from "../context/MainContext";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4001")


const SingleAuction = () => {

    const {id} = useParams()
    let {user, setUser} = useContext(MainContext)
    const nav = useNavigate()
    const bid = useRef()
    let [currentItem, setCurrentItem] = useState()
    let [currentTime, setCurrentTime] = useState()
    let [currentPrice, setCurrentPrice] = useState()
    let [bidHistory, setBidHistory] = useState([])
    let [time, setTime] = useState()
    let [active, setActive] = useState(true)



    useEffect(update, [])

    useEffect( async () => {
        const res = await axios.get("http://localhost:4000/getSingleAuction/" + id)
        setBidHistory(res.data.item[0].bids)
    })

    async function update() {
        const res = await axios.get("http://localhost:4000/getSingleAuction/" + id)
        setCurrentItem(res.data.item[0])
        setCurrentTime(res.data.item[0].endTime)
        setCurrentPrice(res.data.item[0].price)
    }


    const startInterval = setInterval(calculateTime, 1000)

    function calculateTime() {

        const time = Math.floor(new Date(currentTime).getTime())
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
            // daysDifference + ' day/s ' +
      hoursDifference + ' hours ' +
            minutesDifference + ' minutes ' +
            secondsDifference + ' seconds ');
    }

    useEffect(() => {
        socket.on("auction", async (data) => {
            const info = await  data
            console.log(info)
            if(info.postId === id) {
                setBidHistory([...bidHistory, data])
                setCurrentPrice(data.bidValue)
            }
        })

    }, [socket])

    async function submitBid() {

        const bidInfo = {
            bidValue: bid.current.value,
            postId: currentItem._id
        }

        try {
            const res = await axios.post("http://localhost:4000/submitBit", bidInfo, {withCredentials: true})
            console.log(res.data)
            if(res.data.user)(
                setUser(res.data.user)
            )
            update();
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className="d-flex justify-content-center align-content-center">
            {currentItem &&
                <div className="d-flex flex-column primaryBox border p-3 w-80">
                    <div className="d-flex">
                        <div className="">
                            <img src={currentItem.image} alt="image" style={{width: "100%"}}/>
                        </div>
                        <div className="d-flex flex-column ms-4 align-items-start text-start">
                            <h5>{currentItem.title}</h5>
                            <h3>Current price: <span className="link">{currentPrice && currentPrice}€</span></h3>
                            <h4>Seller: <span className="link">{currentItem.email}</span></h4>
                            { active &&
                                <div className="d-flex justify-content-around p-2">
                                    <h5>Time left: </h5>
                                    <h5>{time && time}</h5>
                                </div>
                            }
                            {(user && active) && ((user.email === currentItem.email) ?
                                    <div></div>
                                    :
                                <div className="d-flex">
                                    <button className="btn secondaryButton" onClick={submitBid}>Place Bid</button>
                                    <input type="number" className="form-control" ref={bid}/>
                                </div>
                            )}
                        { !active &&
                             currentItem.bids[currentItem.bids.length-1] ?
                                <h2>Auction won by: <span className="link2">{currentItem.bids[currentItem.bids.length-1].email}</span></h2>
                                    :
                                <h2>Auction wasn't sold</h2>
                        }
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-content-center mt-5">
                        <h1>Bids Log</h1>
                        <div className="secondaryBox min-200 d-flex flex-column-reverse justify-content-end box w-100 border p-2">
                            {bidHistory &&
                                bidHistory.map((x, i) => {
                                    return <div key={i} className="d-flex gap-2">
                                        <p>{new Date(x.time).toLocaleString()}</p>
                                        <p>{x.email} bid:</p>
                                        <p className="link">{x.bidValue}€</p>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default SingleAuction;