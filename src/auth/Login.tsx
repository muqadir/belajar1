
import React, {useState} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { HiMail, HiUser } from 'react-icons/hi';


export default function Login() {

    const [loginInput, setLogin] = useState({
        email: '',
        password: '',
        error_list: [],
    });

    const handleInput = (e) => {
        e.persist();
        setLogin({...loginInput, [e.target.name]: e.target.value });
    }

    const loginSubmit = (e) => {
        e.preventDefault();
        
        const data = {
            email: loginInput.email,
            password: loginInput.password,
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`api/login`, data).then(res => {
                if(res.data.status === 200)
                {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.username);
                    // swal.update("Success",res.data.message,"success");
                    if(res.data.role === 'admin')
                    {
                        history.push('/admin/dashboard');
                    }
                    else
                    {
                        history.push('/');
                    }
                }
                else if(res.data.status === 401)
                {
                    swal.fire("Warning",res.data.message,"warning");
                }
                else
                {
                    setLogin({...loginInput, error_list: res.data.validation_errors });
                }
            });
        });
    }
  return (
    <form className="flex max-w-md flex-col gap-4"  >
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email" value="Your email" />
      </div>
      <TextInput id="email" type="email" name="email" placeholder="name@flowbite.com" required icon={HiMail} onChange={handleInput} value={loginInput.email} />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="password" value="Your password" />
      </div>
      <TextInput id="password" name="password" type="password" required  icon={HiUser} onChange={handleInput} value={loginInput.password} />
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="remember" />
      <Label htmlFor="remember">Remember me</Label>
    </div>
    <Button type="submit" onClick={loginSubmit}>Submit</Button>
  </form>
  )
}

