import { createContext } from "react"

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    let values = {
        x:5
    }

    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}