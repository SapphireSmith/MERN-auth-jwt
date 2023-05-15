import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik'
import avatar from '../assets/profile.png'
import { Link, useNavigate } from 'react-router-dom';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hooks';
import { useAuthStore } from '../store/store';
import { verifyPasssword } from '../helper/helpers';

const Password = () => {

  const { username } = useAuthStore(state => state.auth)
  const data = useFetch(`/user/${username}`)
  const { apiData, isLoading, serverError } = data[0];
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let passwordPromise = verifyPasssword({ username, password: values.password })
      toast.promise(passwordPromise, {
        loading: "Checking...",
        success: <b>Login success...!</b>,
        error: <b>Password Not Match !</b>
      });

      passwordPromise.then((res) => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
    }
  })

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.messsage}</h1>


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password' />
              <button className={`${styles.btn} bg-indigo-500`} type='submit'>Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Password