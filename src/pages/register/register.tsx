import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  register,
  selectAuthError,
  selectAuthLoading
} from '../../services/auth/slice';
import { TRegisterData } from '@api';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const regData: TRegisterData = {
      email,
      name: userName,
      password
    };
    dispatch(register(regData))
      .unwrap()
      .then(() => navigate('/'))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <RegisterUI
        errorText={error || ''}
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};
