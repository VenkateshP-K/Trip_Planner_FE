import React from 'react'
import { Link } from 'react-router-dom'
import india_places from "../assets/india_places.jpg";
import coorg_karnataka from "../assets/coorg_karnataka.jpg";
import dal_lake from "../assets/dal_lake.jpg";
import more from "../assets/more.jpg";

function Home() {
    const imageStyle = {
        height: "500px",
        objectFit: "cover",
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">ABC Travel Planner</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <Link className="btn btn-outline-dark me-2" type="submit" to="/register">Register</Link>
                            <Link className="btn btn-outline-dark" type="submit" to="/login">Login</Link>
                        </form>
                    </div>
                </div>
            </nav>
            <div className="container p-4 mb-4">
                <div className="row">
                    <div className="col">
                        <div id="carouselExampleCaptions" className="carousel slide">
                            <div className="carousel-indicators">
                                <button
                                    type="button"
                                    data-bs-target="#carouselExampleCaptions"
                                    data-bs-slide-to="0"
                                    className="active"
                                    aria-current="true"
                                    aria-label="Slide 1"
                                ></button>
                                <button
                                    type="button"
                                    data-bs-target="#carouselExampleCaptions"
                                    data-bs-slide-to="1"
                                    aria-label="Slide 2"
                                ></button>
                                <button
                                    type="button"
                                    data-bs-target="#carouselExampleCaptions"
                                    data-bs-slide-to="2"
                                    aria-label="Slide 3"
                                ></button>
                                <button
                                    type="button"
                                    data-bs-target="#carouselExampleCaptions"
                                    data-bs-slide-to="3"
                                    aria-label="Slide 4"
                                ></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img
                                        src={india_places}
                                        className="d-block w-100 rounded shadow"
                                        alt="Taj Mahal"
                                        style={imageStyle}
                                    />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>Travel & Tourism India</h5>
                                        <p>
                                            Travel and tourism is the largest service industry in India.
                                            It provides heritage, cultural, medical, business and sports
                                            tourism.
                                        </p>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src={coorg_karnataka}
                                        className="d-block w-100 rounded shadow"
                                        alt="Coorg Karnataka"
                                        style={imageStyle}
                                    />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>Coorg, Karanataka</h5>
                                        <p>
                                            Way to waterfalls is well maintained and safe Greenery on
                                            both sides on the way to falls
                                        </p>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src={dal_lake}
                                        className="d-block w-100 rounded shadow"
                                        alt="Dal Lake"
                                        style={imageStyle}
                                    />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>Dal Lake, Srinagar</h5>
                                        <p>
                                            It is an urban lake, the second largest lake in Jammu and
                                            Kashmir
                                        </p>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src={more}
                                        className="d-block w-100 rounded shadow"
                                        alt="Dal Lake"
                                        style={imageStyle}
                                    />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>For More</h5>
                                        <p>
                                            <a
                                                href=" https://tourism.gov.in/"
                                                target="_blank"
                                                className="text-light"
                                            >
                                                Ministry of Tourism
                                            </a>
                                        </p>
                                        <h6>India</h6>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide="prev"
                            >
                                <span
                                    className="carousel-control-prev-icon"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide="next"
                            >
                                <span
                                    className="carousel-control-next-icon"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 mb-4 homepage-cards">
                    <div className="col">
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">Plan Your Trip</h5>
                                        <p className="card-text text-center">
                                            Plan trips & Set them in the App
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title ">
                                            Search Perfect Transportation and Accommodation
                                        </h5>
                                        <p className="card-text ">
                                            Spot travel options and accommodations nearest to your
                                            touring places.
                                        </p>
                                        <p className="card-text">* Limitted to Planes and Trains</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home