import { useContext } from "react"
import { TournamentContext } from "../../contexts/TournamentContext"
export const Home = () => {
    const { matchesGroupStageSchema, matchesPlayedAfterGroups, teams } = useContext(TournamentContext);
    // console.log(Object.entries(matchesGroupStageSchema).sort((a, b) => a[0].localeCompare(b[0])))
    console.log(matchesGroupStageSchema)
    return (
        <div>
            {matchesGroupStageSchema?.map(([matchGroupName, groupMatchesArray], index) => {
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
