import { motion } from "framer-motion"

import styles from "./loading-animation.module.css"
export const LoadingAnimation = () => {
    return (
        <motion.div
        className={styles.animationContainer}
        >
            <motion.span
                transition={{
                    duration: 0.9,
                    delay: 0.01,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                animate={{ y: [0, 30, 0] }}
            />
            <motion.span
                transition={{
                    duration: 0.9,
                    delay: 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}

                animate={{ y: [30, 0, 30] }}
            />
            <motion.span
                transition={{
                    duration: 0.9,
                    delay: 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                animate={{ y: [0, 30, 0] }}
            />

        </motion.div>
    )
}