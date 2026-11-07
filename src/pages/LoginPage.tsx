import PageTitle from '../components/PageTitle';
import Login from '../components/Login';

type LoginPageProps = {
  onLogin: () => void;
};

function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main>
      <PageTitle />
      <Login onLogin={onLogin} />
    </main>
  );
}

export default LoginPage;