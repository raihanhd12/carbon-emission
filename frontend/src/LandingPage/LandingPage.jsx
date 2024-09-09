import { useState } from "react";
import Cart from '../assets/cart.svg'
import Next from '../assets/next.svg'
import Metamask from '../assets/metamask.png'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const data = [
    {
        name: 'Patrick',
        img: Metamask,
        review: 'lorem ipsum'
    },
    {
        name: 'Spongebob',
        img: Metamask,
        review: 'lorem ipsum'
    },
    {
        name: 'Mr. Krab',
        img: Metamask,
        review: 'lorem ipsum'
    },
    {
        name: 'Sandy',
        img: Metamask,
        review: 'lorem ipsum'
    },
    {
        name: 'Plankton',
        img: Metamask,
        review: 'lorem ipsum'
    },
]

function LandingPage() {
    const [loadData, setLoadData] = useState(data);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    function LoadMore() {
        setLoadData([...loadData, {
            name: 'Tifa',
            img: Metamask,
            review: 'lorem ipsum'
        },
    ])
    }

    return (
        <>
            <header className="header">
                <nav className="navbar">
                    <ul>
                        <li className="firstList">
                            <img src={Metamask} alt="Logo" />
                            <input type="text" placeholder="Search item here ...." />
                        </li>
                        <li className="secondList">
                            <button>Connect Wallet<a href="ConnectWallet.jsx"/></button>
                            <img src={Cart} alt="cart" />
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="main">
                <section className="main-section-one">
                    <p className="section-one-title">Market Emisi Karbon</p>
                    <h1>Transakssi Emisi Karbon Dengan Blockchain</h1>
                    <p className="section-one-article">Emisi Karbon yang dijual di marketplace ini diwakili dengan token, satu token sebanding dengan satu ton emisi karbon</p>
                </section>
                <section className="main-section-two">
                    <div className="section-content-one">
                        <h2>Newest</h2>
                        <a className="section-sub-content">
                            More
                            <img src={Next} alt="" />
                        </a>
                        {/* <button>Newest</button> */}
                    </div>
                    <div className="section-content-two">
                        <div className="slider-container">
                            <Slider {...settings}>
                                {data.map((d) => (
                                    <div key={d.name} className="card">
                                        <div className="card-image-container">
                                            <img src={d.img} alt="image" className="card-image" />
                                        </div>

                                        <div className="card-content">
                                            <p className="card-title">{d.name}</p>
                                            <p className="card-review">{d.review}</p>
                                            <button className="card-button">{d.button} Detail</button>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    {/* <ul>
                        <li>
                            <a href="#">All Categories</a>
                            <ul className="dropdown">
                                <li><a href="#">Lorem Ipsum 1</a></li>
                                <li><a href="#">Lorem Ipsum 2</a></li>
                                <li><a href="#">Lorem Ipsum 3</a></li>
                                <li><a href="#">Lorem Ipsum 4</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Buy Now</a>
                            <ul className="dropdown">
                                <li><a href="#">Lorem Ipsum 1</a></li>
                                <li><a href="#">Lorem Ipsum 2</a></li>
                                <li><a href="#">Lorem Ipsum 3</a></li>
                                <li><a href="#">Lorem Ipsum 4</a></li>
                            </ul>
                        </li>
                    </ul> */}
                </section>
                <section className="main-section-two">
                    <div className="section-content-one">
                        <h2>Oldest</h2>
                        <a className="section-sub-content">
                            More
                            <img src={Next} alt="" />
                        </a>
                        {/* <button>Newest</button> */}
                    </div>
                    <div className="section-content-two">
                        <div className="slider-container">
                            <Slider {...settings}>
                                {data.map((d) => (
                                    <div key={d.name} className="card">
                                        <div className="card-image-container">
                                            <img src={d.img} alt="image" className="card-image" />
                                        </div>

                                        <div className="card-content">
                                            <p className="card-title">{d.name}</p>
                                            <p className="card-review">{d.review}</p>
                                            <button className="card-button">{d.button} Detail</button>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </section>
                {/* <section className="main-section-three">
                    <div className="section-content-two">
                        <div key={data.name} className="card">
                            <div className="card-image-container">
                                <img src={data.img} alt="image" className="card-image" />
                            </div>

                            <div className="card-content">
                                <p className="card-title">{data.name}</p>
                                <p className="card-review">{data.review}</p>
                                <button className="card-button">{data.button} Detail</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={LoadMore}>Load More</button>
                </section> */}
            </main>

            <footer className="footer">
                <section className="footer-section-one">
                    <ul>
                        <li className="main-footer-section-list">Marketplace</li>
                        <li>Tentang Market</li>
                        <li>Hak Kekayaan Intelektual</li>
                        <li>Karir</li>
                        <li>Lorem Ipsum</li>
                    </ul>
                    <ul>
                        <li className="main-footer-section-list">Dokumentasi</li>
                        <li>Pembelian</li>
                        <li>Penjualan</li>
                        <li>Akun</li>
                        <li>Lorem Ipsum</li>
                    </ul>
                    <ul>
                        <li className="main-footer-section-list">Bantuan dan Panduan</li>
                        <li>Pembahasan Teknis</li>
                        <li>Syarat dan Ketentuan</li>
                        <li>Kebijakan Privasi</li>
                        <li>Lorem Ipsum</li>
                    </ul>
                    <div className="last-footer-section">
                        <p>Ada masalah? Silakan kontak kami <span>di sini</span></p>
                        <img src={Metamask} alt="" />
                    </div>
                </section>
                <section className="footer-section-two">
                    <p>@Copyright 2024</p>
                    <div className="footerLogo">
                        <p>fb</p>
                        <p>twt</p>
                        <p>IG</p>
                    </div>
                </section>
            </footer>
        </>
    )
}

export default LandingPage