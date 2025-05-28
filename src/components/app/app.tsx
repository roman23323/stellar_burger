import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import {
  ingredients,
  selectIsIngredientsLoaded
} from '../../services/slices/ingredientsSlice';
import { useEffect } from 'react';
import { ProtectedRoute } from '../protected-route/protected-route';
import {
  getUserWithToken,
  selectIsAuthLoading,
  selectUser
} from '../../services/slices/authSlice';
import { deleteCookie, getCookie } from '../../utils/cookie';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const isIngredientsLoaded = useSelector(selectIsIngredientsLoaded);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsAuthLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIngredientsLoaded) {
      dispatch(ingredients());
    }
  }, []);

  useEffect(() => {
    const token =
      getCookie('accessToken') || localStorage.getItem('refreshToken');
    console.log(
      'Токен для входа: ',
      token,
      'Куки с accessToken: ',
      getCookie('accessToken'),
      'refreshToken из хранилища: ',
      localStorage.getItem('refreshToken')
    );
    if (token && !user && !isLoading) {
      dispatch(getUserWithToken());
    }
  }, [dispatch, user, isLoading]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal title='/feed/:number' onClose={() => navigate('/')} />
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={() => navigate('/')}>
              <IngredientDetails />
            </Modal>
          }
        />

        {/* ----- Защитить: ----- */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='/feed/:number' onClose={() => navigate(-1)} />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
