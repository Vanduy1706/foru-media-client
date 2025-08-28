import { NavLink } from "react-router"

export default function Option({ children, path }) {
  return <NavLink to={path}>{children}</NavLink>
}
