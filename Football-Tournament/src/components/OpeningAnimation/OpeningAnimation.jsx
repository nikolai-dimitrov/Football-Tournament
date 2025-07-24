import { motion } from "framer-motion"
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
                    className={styles.logo}
                >
                    <div>
                        <BiFootball className={styles.ballIcon} />
                        <h3>Football</h3>
                    </div>

                    <h3>Championship</h3>
                </div>
            </motion.div>
        </>
    )

}