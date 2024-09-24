import { useState, useEffect, useRef } from "react";
import Cart from '../assets/cart.svg'
import Next from '../assets/next.svg'
import Metamask from '../assets/metamask.png'
import Slider from "react-slick"

const data = [
    {
        name: 'Patrick',
        img: Metamask,
        price: 1000000,
        unit: 10,
    },
    {
        name: 'Spongebob',
        img: Metamask,
        price: 1000000,
        unit: 10,
    },
    {
        name: 'Mr. Krab',
        img: Metamask,
        price: 1000000,
        unit: 10,
    },
    {
        name: 'Sandy',
        img: Metamask,
        price: 1000000,
        unit: 10,
    },
    {
        name: 'Plankton',
        img: Metamask,
        price: 1000000,
        unit: 10,
    },
]

function LandingPage() {
    const [loadData, setLoadData] = useState(data);
    const [isOldestVisible, setIsOldestVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Reference for the Oldest section
    const oldestRef = useRef(null);

    // Intersection Observer API
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                // setIsOldestVisible(true);  // Trigger render when section is in view
                setIsLoading(true);  // Stop loading indicator
                // observer.disconnect();  // Stop observing after it's visible

                setTimeout(() => {
                    setIsOldestVisible(true);  // Trigger render after delay
                    setIsLoading(false);  // Stop loading indicator
                    observer.disconnect();  // Stop observing after it's visible
                }, 2000);  // 5 seconds delay
            }
        });

        if (oldestRef.current) {
            observer.observe(oldestRef.current);  // Observe the Oldest section
        }

        return () => {
            if (oldestRef.current) {
                observer.disconnect();
            }
        };
    }, []);

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
                breakpoint: 720,
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

                {/* Newest Section */}
                <section className="main-section-two">
                    <div className="section-content-one">
                        <h2>Newest</h2>
                        <a className="section-sub-content">
                            More
                            <img src={Next} alt="" />
                        </a>
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
                                            <p className="card-unit">{d.unit} Token</p>
                                            <p className="card-price">Rp. {d.price}</p>
                                            <button className="card-button">{d.button} Detail</button>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </section>
                
                {/* Oldest Section */}
                {/* Oldest Section with Conditional Rendering */}
                <section className="main-section-two" ref={oldestRef}>
                    <div className="section-content-one">
                        <h2>Oldest</h2>
                        <a className="section-sub-content">
                            More
                            <img src={Next} alt="" />
                        </a>
                    </div>
                    <div className="section-content-two">
                        {isLoading ? (
                            <div className="loading">Loading...</div>  // Loading indicator
                        ) : isOldestVisible ? (
                            <div className="slider-container">
                                <Slider {...settings}>
                                    {data.map((d) => (
                                        <div key={d.name} className="card">
                                            <div className="card-image-container">
                                                <img src={d.img} alt="image" className="card-image" />
                                            </div>
                                            <div className="card-content">
                                                <p className="card-title">{d.name}</p>
                                                <p className="card-unit">{d.unit} Token</p>
                                                <p className="card-price">Rp. {d.price}</p>
                                                <button className="card-button">{d.button} Detail</button>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        ) : null}
                    </div>
                </section>
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