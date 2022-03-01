import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import MainContext from "../context/MainContext";

const TopBar = () => {

   let {user, setUser} = useContext(MainContext)

    function logout() {
       setUser("")
    }

    return (
        <div className="mb-3">
            <div className="intro d-flex justify-content-center">
                <div className="w-80 d-flex justify-content-between p-1 ms-4">
                    {!user &&
                        <div className="hypertext">
                            Hi!
                            <Link to="/login"><span className="link"> Sign in </span></Link>
                            in or
                            <Link to="/register"><span className="link"> register </span></Link>
                        </div>
                    }
                    {user
                        &&
                        <div className="hypertext">Hello there {user.email}</div>
                    }
                    {user
                        &&
                        <div className="hypertext me-4">
                            You have
                            <Link to="/"><span className="link"> {user.money} € </span></Link>
                        </div>
                    }
                </div>
            </div>
            <div className="header d-flex justify-content-center">
                <div className="w-80 d-flex justify-content-between p-3">
                    <div className="d-flex gap-3">
                        <Link to="/">
                            <p className="m-0 navLink">
                                Browse Auctions
                            </p>
                        </Link>
                        {user
                            &&
                            <Link to="/createAuction">
                                <p className="m-0 navLink">
                                    Create Auction
                                </p>
                            </Link>
                        }
                        {user
                            &&
                            <Link to="/myAuctions">
                                <p className="m-0 navLink">
                                    Auction List
                                </p>
                            </Link>
                        }
                        {user
                            &&
                            <Link to="/bidHistory">
                                <p className="m-0 navLink">
                                    Bid history
                                </p>
                            </Link>
                        }
                    </div>
                    {!user
                        &&
                        <div className="d-flex gap-3">
                            <Link to="/login">
                                <p className="m-0 navLink">
                                    Login
                                </p>
                            </Link>
                            <Link to="/register">
                                <p className="m-0 navLink">
                                    Register
                                </p>
                            </Link>
                        </div>
                    }
                    {user
                        &&
                        <div className="d-flex gap-3">
                            <Link to="/login">
                                <p className="m-0 navLink" onClick={logout}>
                                    Logout
                                </p>
                            </Link>
                        </div>
                    }

                </div>
            </div>

        </div>
    );
};

export default TopBar;