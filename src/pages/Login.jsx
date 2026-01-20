const Login = () => {
  return (
    <>
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <br /><br />
        <input type="password" placeholder="Password" required />
        <br /><br />
        <button>Login</button>
      </form>
    </>
  );
};

export default Login;
