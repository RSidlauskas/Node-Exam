import React, {useContext, useRef} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import MainContext from "../context/MainContext";

const CreateAuction = () => {

    const nav = useNavigate()

    const inputs = {
        image: useRef(),
        title: useRef(),
        startPrice: useRef(),
        duration: useRef(),
    }

    async function submit() {

        const date = Date.now() + Number(inputs.duration.current.value * 1000)

        const item = {
            image: inputs.image.current.value,
            title: inputs.title.current.value,
            startPrice: inputs.startPrice.current.value,
            duration: date
        }

        try{
            const res = await axios.post("http://localhost:4000/listItem", item, {withCredentials: true})
            console.log(res.data)
        } catch (e) {
            console.log(e)
        }

    }


    return (
        <div className="d-flex justify-content-center w-100">
            <div className="form-control d-flex align-items-center flex-column w-50">
                <h3>Create Listing</h3>
                <div className="d-flex w-100 flex-column align-items-start ">
                    <p>Image (url):</p>
                    <input ref={inputs.image} type="text" className="form-control"/>
                    <p>Title:</p>
                    <input ref={inputs.title} type="text" className="form-control"/>
                    <p>Start Price:</p>
                    <input ref={inputs.startPrice} type="text" className="form-control"/>
                    <p>Duration:</p>
                    <div className="input-group mb-3 d-flex">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                        </div>
                        <select ref={inputs.duration} defaultValue={60} className="custom-select flex-grow-1" id="inputGroupSelect01">
                            <option value="60">1 minute</option>
                            <option value="120">2 minutes</option>
                            <option value="600">10 minutes</option>
                            <option value="3600">1 hour</option>
                            <option value="28800">8 hour</option>
                        </select>
                    </div>
                </div>
                <button className="btn form-control primaryButton  mt-1" onClick={submit}>Create Auction</button>
            </div>
        </div>
    );
};

export default CreateAuction;