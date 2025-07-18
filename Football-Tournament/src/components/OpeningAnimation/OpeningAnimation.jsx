import { motion, AnimatePresence } from "framer-motion"
import { BiFootball } from "react-icons/bi"
import styles from "./opening-animation.module.css"
export const OpeningAnimation = () => {
    return (
        <>
            <motion.div
                className={styles.logo}
                initial={{
                    scale: 0,
                }}

                animate={{
                    scale: 1,
                }}

                transition={{
                    duration: 0.7,

                }}
            >
                <div
                    className={styles.logo}>
                    <BiFootball className={styles.ballIcon} size={44} />
                    <h3>Football</h3>
                    <h3>Championship</h3>
                </div>
            </motion.div>
        </>
    )

}