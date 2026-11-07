import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';

type LoginPageProps = {
  onLogin: () => void;
};

function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main>
      <PageTitle />

      <Login onLogin={onLogin} />

      <hr />

      <Register />
    </main>
  );
}

export default LoginPage;