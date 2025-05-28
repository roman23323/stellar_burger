import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { selectUser, updateUserData } from '../../services/slices/authSlice';
import { updateUserApi } from '@api';
import { useDispatch } from 'react-redux';

export const Profile: FC = () => {
  const user = useSelector(selectUser) || {
    name: '',
    email: ''
  };

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  const [error, setError] = useState<string | undefined>(undefined);
  const [updateInfo, setUpdateInfo] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    updateUserApi(formValue).then((res) => {
      console.log(res.success);
      if (res.success) {
        dispatch(updateUserData(res.user));
        setUpdateInfo('Данные обновлены');
        console.log('Данные обновлены');
      } else {
        setError('Ошибка при изменении данных аккаунта');
      }
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error}
      updateUserResult={updateInfo}
    />
  );
};
