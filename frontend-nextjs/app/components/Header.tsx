import { CREATE_POST, LOGIN } from '@/constants/routes';
import { TOKEN, USER } from '@/constants/storage';
import { useRouter } from 'next/navigation';


const Header = () => {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push(CREATE_POST);
  };

  const handleLogout = () => {
    localStorage.setItem(TOKEN, '');
    localStorage.setItem(USER, {});
    router.push(LOGIN);
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center mb-20">
      <h1 className="text-xl font-bold">Dialog  </h1>
      <div>
        <button
          onClick={handleCreatePost}
          className="bg-white text-blue-500 px-4 py-2 rounded mr-5"
        >
          Criar +
        </button>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-500 px-4 py-2 rounded"
        >
          Sair ->
        </button>
      </div>
    </header>
  );
};


export default Header;
