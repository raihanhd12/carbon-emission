import Cart from './assets/cart.svg'
import Metamask from './assets/metamask.png'

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
                    <h1>Connect Wallet</h1>
                </section>
            </header>

            <main className="main">
                <div className="mainType">
                    <div className="content">
                        <img src={Metamask} alt="Metamask Logo" />
                        <p className="contentDescriptioon">Most Popular</p>
                    </div>
                    <p>Start exploring blockchain applications in seconds. Trusted by over 1 million user worldwide.</p>
                </div>
                <div className="mainType">
                    <div className="content">
                        <img src={Metamask} alt="Metamask Logo" />
                        <p>Most Popular</p>
                    </div>
                    <p>Start exploring blockchain applications in seconds. Trusted by over 1 million user worldwide.</p>
                </div>
                <div className="mainType">
                    <div className="content">
                        <img src={Metamask} alt="Metamask Logo" />
                        <p>Most Popular</p>
                    </div>
                    <p>Start exploring blockchain applications in seconds. Trusted by over 1 million user worldwide.</p>
                </div>
            </main>

            <footer className="footer">
                <section className="footerSectionOne">
                    <ul>
                        <li className="mainFooterSectionList">Marketplace</li>
                        <li>Tentang Market</li>
                        <li>Hak Kekayaan Intelektual</li>
                        <li>Karir</li>
                        <li>Lorem Ipsum</li>
                    </ul>
                    <ul>
                        <li className="mainFooterSectionList">Dokumentasi</li>
                        <li>Pembelian</li>
                        <li>Penjualan</li>
                        <li>Akun</li>
                        <li>Lorem Ipsum</li>
                    </ul>
                    <ul>
                        <li className="mainFooterSectionList">Bantuan dan Panduan</li>
                        <li>Pembahasan Teknis</li>
                        <li>Syarat dan Ketentuan</li>
                        <li>Kebijakan Privasi</li>
                        <li>Lorem Ipsum</li>
                    </ul>
                    <div className="lastFooterSection">
                        <p>Ada masalah? Silakan kontak kami <span>di sini</span></p>
                        <img src={Metamask} alt="" />
                    </div>
                </section>
                <section className="footerSectionTwo">
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