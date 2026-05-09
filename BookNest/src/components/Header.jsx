import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  // let { user, logoutUser } = useContext(AuthContext)
  // return (
  //   <div>
  //     { user && <span>Hello {user.username} | </span> }
  //     <Link to="/" >Home</Link>
  //     <span> | </span>
  //     {
  //       user
  //       ? <a onClick={logoutUser}>Logout</a>
  //       : (<Link to="/login">Login</Link>)
  //     }
  //   </div>
  // )
}

export default Header
