import React, {useRef} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Register = () => {

    const nav = useNavigate()
    const inputs = {
        email: useRef(),
        password1: useRef(),
        password2: useRef()
    }

    async function submit() {

        const user = {
            email: inputs.email.current.value,
            password1: inputs.password1.current.value,
            password2: inputs.password2.current.value,
        }

        try{
            const res = await axios.post("http://localhost:4000/register", user)
            console.log(res.data)
            nav("/login")

        } catch (e) {
            console.log(e)
        }

    }


    return (
        <div className="d-flex justify-content-center mb-3 w-100">
            <div className="form-control secondaryBox d-flex align-items-center flex-column w-50">
                <h3>Register</h3>
                <div className="d-flex w-100 flex-column justify-content-start align-items-start ">
                    <p>Email:</p>
                    <input ref={inputs.email} type="text" className="form-control"/>
                    <p>Password:</p>
                    <input ref={inputs.password1} type="text" className="form-control"/>
                    <p>Repeat Password:</p>
                    <input ref={inputs.password2} type="text" className="form-control"/>
                </div>
                <button className="btn form-control primaryButton  mt-1" onClick={submit}>Submit</button>
            </div>
        </div>
    );
};

export default Register;