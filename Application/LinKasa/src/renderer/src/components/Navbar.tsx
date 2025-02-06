
function Navbar():JSX.Element{

  const style = {
    // display:'flex',
    columnGap:10,
    rowGap:10
  };

  return (
    <div style={style}>
      {
      window.location.pathname == "/login_as_staff" &&
      <a href="/login_as_user">Login as User</a>
      }
      {
        (window.location.pathname == "/login_as_user" || window.location.pathname == '/') &&
        <div style={style}>
        <a href="/login_as_staff">Login as Staff</a><br />
        <a href="/register">Register</a>
        </div>
      }
      {
        window.location.pathname == '/register' && <a href="/login_as_user">Login</a>
      }

    </div>
  )


}

export default Navbar
