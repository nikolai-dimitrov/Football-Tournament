import { easeInOut, motion } from "framer-motion";

export const FadeTransition = ({ children }) => {
    return (
        <motion.div
            transition={{
                duration: 0.5,
                ease: easeInOut,
            }}

            initial={{
                opacity: 0,

            }}

            animate={{
                opacity: 1,
            }}
        >
            {children}
        </motion.div>
    )
}