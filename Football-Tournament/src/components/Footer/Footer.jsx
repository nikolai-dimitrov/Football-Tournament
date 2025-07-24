import { FaGithub } from "react-icons/fa"

import styles from "./footer.module.css"
export const Footer = () => {
    return (
        <div className={styles.footerContainer}>
                <p>© All Rights Reserved</p>
            <a href="https://github.com/nikolai-dimitrov/"><FaGithub size={25}/></a>
        </div>
    )
}