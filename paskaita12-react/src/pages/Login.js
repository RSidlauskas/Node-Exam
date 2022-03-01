import React, {useContext, useRef} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import MainContext from "../context/MainContext";

const Login = () => {

    const nav = useNavigate()
    let {user, setUser} = useContext(MainContext)

    const inputs = {
        email: useRef(),
        password: useRef(),
    }

    async function submit() {
        const user = {
            email: inputs.email.current.value,
            password: inputs.password.current.value,
        }

        try{
            const res = await axios.post("http://localhost:4000/login", user, {withCredentials: true})
            console.log(res.data.response[0])
            setUser(res.data.response[0]);
            nav("/")
        } catch (e) {
            console.log(e)
        }

    }


    return (
        <div className="d-flex justify-content-center w-100">
            <div className="form-control d-flex align-items-center flex-column w-50">
                <h3>Login</h3>
                <div className="d-flex w-100 flex-column align-items-start ">
                    <p>Email:</p>
                    <input ref={inputs.email} type="text" className="form-control"/>
                    <p>Password:</p>
                    <input ref={inputs.password} type="text" className="form-control"/>
                </div>
                <button className="btn form-control primaryButton  mt-1" onClick={submit}>Submit</button>
            </div>
        </div>
    );
};

export default Login;