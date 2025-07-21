import { easeInOut, motion } from "framer-motion";

export const FadeTransition = ({ children, className, keyString, durationSeconds, isInAnimatePresence }) => {
    return (
        <motion.div
            className={className && className}
            key={keyString && keyString}
            transition={{
                duration: durationSeconds,
                ease: easeInOut,
            }}

            initial={{
                opacity: 0,

            }}

            animate={{
                opacity: 1,
            }}

            exit={
                isInAnimatePresence && { opacity: 0 }
            }

        >
            {children}
        </motion.div>
    )
}