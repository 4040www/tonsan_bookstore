import image from '/image.png';

import cart from '/cart.png';
import overview from '/overview.png';
import timer from '/time.png';
import online from '/online.png';
import store from '/store.png';
import todo from '/todo.png';
import water from '/water.png';
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Root() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div id="sidebar">
                <h1>
                    <nav>
                        <Link to={`/Note`} className="link-note">唐山書店交接系統使用說明</Link>
                    </nav>
                </h1>
                <img src={image} alt="tonsan bookstore" className="image" />
                <nav className="nav">
                    <ul>
                        <li className="li-main" style={{marginBottom:'15px'}}>
                            <Link to={`/Home`} className={`link ${isActive('/Home') ? 'active' : ''}`} style={{marginBottom:'15px'}}><img src={timer} className="icon" />今日工作                                                         |</Link>
                            <Link to={`/Works`} className={`link ${isActive('/Works') ? 'active' : ''}`}><img src={overview} className="icon" />工作總覽                                                         |</Link>
                        </li>
                        <li className="li-section">紀錄
                            <li className="li-sub">
                                <Link to={`/Restock-and-Refund`} className={`link-wide ${isActive('/Restock-and-Refund') ? 'active' : ''}`}><img src={cart} className="icon" />進退貨                                        |</Link>
                            </li>
                        </li>
                        <li className="li-section">採購
                            <li className="li-sub">
                                <Link to={`/internet_order`} className={`link-wide ${isActive('/internet_order') ? 'active' : ''}`}><img src={online} className="icon" />網路訂單                                      |</Link>
                            </li>
                            <li className="li-sub">
                                <Link to={`/store_order`} className={`link-wide ${isActive('/store_order') ? 'active' : ''}`}><img src={store} className="icon" />實體訂單                                       |</Link>
                            </li>
                            <li className="li-sub">
                                <Link to={`/river_order`} className={`link-wide ${isActive('/river_order') ? 'active' : ''}`}><img src={water} className="icon" />四分溪                                        |</Link>
                            </li>
                        </li>
                        <li className="li-section">活動
                            <li className="li-sub">
                                <Link to={`/to_do_list`} className={`link-wide ${isActive('/to_do_list') ? 'active' : ''}`}><img src={todo} className="icon" />待辦事項                                        |</Link>
                            </li>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}
