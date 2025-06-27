import { Outlet } from "react-router-dom"
import Topbar from "../components/Topbar"

export default function Layout() {
  return (
    <>
      <Topbar />
      <Outlet />
    </>
  )
}
