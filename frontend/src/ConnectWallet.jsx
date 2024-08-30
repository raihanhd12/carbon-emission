import Cart from './assets/cart.svg'
import Metamask from './assets/metamask.png'

function ConnectWallet() {
    return (
        <>
            <header className="header">
                <nav className="navbar">
                    <ul>
                        <li className="firstList">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Nier_Automata_Logo.png/1200px-Nier_Automata_Logo.png" alt="Logo" />
                            <input type="text" placeholder="Search item here ...."/>
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
        </>
    )
}

export default ConnectWallet