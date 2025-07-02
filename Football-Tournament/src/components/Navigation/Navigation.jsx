import { NavLink } from "react-router"

export const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink
                        to="/">
                        Home
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}