import Cart from '../assets/cart.svg'
import Metamask from '../assets/metamask.png'
import './Explore.scss';

function ConnectWallet() {
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
                            <button className="redButton">Connect Wallet</button>
                            <img src={Cart} alt="cart" />
                        </li>
                    </ul>
                </nav>

                <section className="sectionHeader">
                    <h1>Explore</h1>
                </section>
            </header>

            <main className="main">
                <div class="section-item section-one">
                    <div class="category">
                        <h3>Select Category</h3>
                        <div class="option-list">
                            <label class="option">
                                <input type="radio" name="category" />
                                <span>Option 1</span>
                            </label>
                            <label class="option">
                                <input type="radio" name="category" />
                                <span>Option 2</span>
                            </label>
                            <label class="option">
                                <input type="radio" name="category" />
                                <span>Option 3</span>
                            </label>
                        </div>
                    </div>
                    {/* <div class="type">
                        <h3>Select Type</h3>
                        <div class="option-list">
                            <label class="option">
                                <input type="radio" name="category" />
                                <span>Option 1</span>
                            </label>
                            <label class="option">
                                <input type="radio" name="category" />
                                <span>Option 2</span>
                            </label>
                            <label class="option">
                                <input type="radio" name="category" />
                                <span>Option 3</span>
                            </label>
                        </div>
                    </div> */}
                </div>

                <div className="section-item section-two">
                    <div className="container-section-content-one">
                        <div className="section-content-one">
                            <div className="card-image-container">
                                <img src={Metamask} alt="image" className="card-image" />
                            </div>
                            <div className="container-section-card-content">
                                <div class="section-card-content">
                                    <div class="card-content">
                                        <p className="card-title">Emisi Karbon</p>
                                        <p className="card-type">.....</p>
                                    </div>
                                    <div class="card-content">
                                        <p className="card-unit">10 Ton Token</p>
                                        <p className="card-price">1.000.000</p>
                                    </div>
                                </div>
                                <button className="card-seller">Perusahaan Sinar Jaya</button>
                            </div>
                        </div>
                        <div className="section-content-one">
                            <div className="card-image-container">
                                <img src={Metamask} alt="image" className="card-image" />
                            </div>
                            <div className="container-section-card-content">
                                <div class="section-card-content">
                                    <div class="card-content">
                                        <p className="card-title">Emisi Karbon</p>
                                        <p className="card-type">.....</p>
                                    </div>
                                    <div class="card-content">
                                        <p className="card-unit">10 Ton Token</p>
                                        <p className="card-price">1.000.000</p>
                                    </div>
                                </div>
                                <button className="card-seller">Perusahaan Sinar Jaya</button>
                            </div>
                        </div>
                        <div className="section-content-one">
                            <div className="card-image-container">
                                <img src={Metamask} alt="image" className="card-image" />
                            </div>
                            <div className="container-section-card-content">
                                <div class="section-card-content">
                                    <div class="card-content">
                                        <p className="card-title">Emisi Karbon</p>
                                        <p className="card-type">.....</p>
                                    </div>
                                    <div class="card-content">
                                        <p className="card-unit">10 Ton Token</p>
                                        <p className="card-price">1.000.000</p>
                                    </div>
                                </div>
                                <button className="card-seller">Perusahaan Sinar Jaya</button>
                            </div>
                        </div>
                        <div className="section-content-one">
                            <div className="card-image-container">
                                <img src={Metamask} alt="image" className="card-image" />
                            </div>
                            <div className="container-section-card-content">
                                <div class="section-card-content">
                                    <div class="card-content">
                                        <p className="card-title">Emisi Karbon</p>
                                        <p className="card-type">.....</p>
                                    </div>
                                    <div class="card-content">
                                        <p className="card-unit">10 Ton Token</p>
                                        <p className="card-price">1.000.000</p>
                                    </div>
                                </div>
                                <button className="card-seller">Perusahaan Sinar Jaya</button>
                            </div>
                        </div>
                    </div>
                    <button className="container-section-content-two">
                        Load More
                    </button>
                </div>
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

export default ConnectWallet