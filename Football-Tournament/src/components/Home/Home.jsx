import { useContext } from "react"
import { TournamentContext } from "../../contexts/TournamentContext"
export const Home = () => {
    const { matchesGroupStageSchema, matchesPlayedAfterGroups, teams } = useContext(TournamentContext);

    return (
        <div>
            {Object.entries(matchesGroupStageSchema)?.map(([matchGroupName, groupMatchesArray], index) => {
                return (
                    <div key={index}>
                        {matchGroupName}
                        {groupMatchesArray.map((currentMatch) => {
                            return (
                                <p key={currentMatch.ID}> {currentMatch.ID}, {currentMatch.ATeamName}, {currentMatch.BTeamName} , {currentMatch.Score} , {currentMatch.Date} </p>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
