import { NavLink } from "react-router"

import styles from "./navigation.module.css"
export const Navigation = () => {
    return (
            <div className={styles.navContainer}>
                <div className={styles.logo}>
                    <h3>Football</h3>
                    <h3>Championship</h3>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li>
                            <NavLink
                                to="/">
                                Home
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
    )
}