import { FaGithub } from "react-icons/fa"

import styles from "./footer.module.css"
export const Footer = () => {
    return (
        <div className={styles.footerContainer}>
            <p>©All Rights Reserved. Football Championship 2025</p>
            <a href="https://github.com/nikolai-dimitrov/"><FaGithub /></a>
        </div>
    )
}